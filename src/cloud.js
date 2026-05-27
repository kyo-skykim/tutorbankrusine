import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://igibmxfsbgfdxkwemuez.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnaWJteGZzYmdmZHhrd2VtdWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjY1MTYsImV4cCI6MjA5NTIwMjUxNn0.HTQE8Fns_ChTf2MnuEXVsPHK_BGOW4geKxiomnV6E_Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 5 } },
});

const readLocal = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const writeLocal = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

// Fetch a single shared value from the cloud. Returns undefined if missing.
export async function fetchRow(key) {
  const { data, error } = await supabase
    .from('app_state')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) throw error;
  return data ? data.value : undefined;
}

// Upsert a shared value. seedOnly=true never overwrites an existing row.
export async function upsertRow(key, value, { seedOnly = false } = {}) {
  const { error } = await supabase
    .from('app_state')
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key', ignoreDuplicates: seedOnly },
    );
  if (error) throw error;
}

/*
 * useCloudState — like useState, but the value is shared across all devices
 * through the Supabase `app_state` table.
 *
 * - Renders instantly from localStorage (also the offline fallback).
 * - On mount: pulls the latest cloud value; if the cloud has none yet, it
 *   seeds the cloud with the current value (without clobbering other devices).
 * - On change: debounced write to the cloud + localStorage.
 * - Subscribes to realtime changes so other devices' edits arrive live.
 */
export function useCloudState(key, initialValue) {
  const [value, setValue] = useState(() => readLocal(key, initialValue));

  const valueRef = useRef(value);
  const lastSynced = useRef(null); // JSON string last seen from / written to cloud
  const loaded = useRef(false);
  useEffect(() => { valueRef.current = value; });

  // Initial load + seed
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await fetchRow(key);
        if (cancelled) return;
        if (remote !== undefined && remote !== null) {
          lastSynced.current = JSON.stringify(remote);
          setValue(remote);
          writeLocal(key, remote);
        } else {
          const cur = valueRef.current;
          lastSynced.current = JSON.stringify(cur);
          upsertRow(key, cur, { seedOnly: true }).catch(() => {});
        }
      } catch {
        // Offline / unreachable: keep the localStorage value.
      } finally {
        loaded.current = true;
      }
    })();
    return () => { cancelled = true; };
  }, [key]);

  // Persist on change (local always; cloud once loaded and actually changed)
  useEffect(() => {
    writeLocal(key, value);
    if (!loaded.current) return;
    const str = JSON.stringify(value);
    if (str === lastSynced.current) return; // unchanged vs cloud → avoid echo loop
    lastSynced.current = str;
    const t = setTimeout(() => { upsertRow(key, value).catch(() => {}); }, 400);
    return () => clearTimeout(t);
  }, [key, value]);

  // Realtime updates from other devices
  useEffect(() => {
    const channel = supabase
      .channel(`app_state:${key}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'app_state', filter: `key=eq.${key}` },
        (payload) => {
          const remote = payload.new?.value;
          if (remote === undefined) return;
          const str = JSON.stringify(remote);
          if (str === lastSynced.current) return; // our own write echoed back
          lastSynced.current = str;
          setValue(remote);
          writeLocal(key, remote);
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [key]);

  return [value, setValue];
}
