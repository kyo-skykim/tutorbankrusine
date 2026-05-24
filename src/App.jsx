import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Sigma,
  Shield,
  GraduationCap,
  LogOut,
  Search,
  Filter,
  Clock,
  Users,
  Tag as TagIcon,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Calendar,
  Download,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Printer,
  X,
  Trash2,
  Pencil,
  Plus,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────
 * Mock data
 * ───────────────────────────────────────────────────────────────────── */
const mockCourses = [
  { id: 1, title: 'คณิตศาสตร์พื้นฐาน ระดับมัธยมต้น', level: 'มัธยมต้น', hours: 40, price: 3500, tags: ['พีชคณิต', 'เรขาคณิต'], teacher: 'อ.สมชาย', slots: 15, enrolled: 8 },
  { id: 2, title: 'แคลคูลัส ระดับมัธยมปลาย', level: 'มัธยมปลาย', hours: 60, price: 5500, tags: ['แคลคูลัส', 'ลิมิต'], teacher: 'อ.สมหญิง', slots: 12, enrolled: 12 },
  { id: 3, title: 'สถิติและความน่าจะเป็น', level: 'มัธยมศึกษา', hours: 48, price: 4800, tags: ['สถิติ', 'ความน่าจะเป็น'], teacher: 'ผศ.วิชัย', slots: 10, enrolled: 5 },
  { id: 4, title: 'คณิตศาสตร์ PAT1', level: 'มัธยมศึกษา', hours: 72, price: 7200, tags: ['PAT', 'ติวสอบ'], teacher: 'ผศ.นภา', slots: 20, enrolled: 18 },
  { id: 5, title: 'พีชคณิตเชิงเส้น', level: 'มหาวิทยาลัย', hours: 90, price: 9000, tags: ['เมทริกซ์', 'เวกเตอร์'], teacher: 'รศ.ดร.ประวิทย์', slots: 8, enrolled: 3 },
  { id: 6, title: 'คณิตศาสตร์เข้มข้น เตรียมสอบเข้า ม.1', level: 'ประถมศึกษา', hours: 30, price: 2800, tags: ['เลขคณิต', 'สอบเข้า'], teacher: 'อ.มาลี', slots: 15, enrolled: 10 },
];

const timeSlotOptions = [
  'จ. 16:00–18:00',
  'อ. 17:00–19:00',
  'พ. 16:00–18:00',
  'พฤ. 17:00–19:00',
  'ศ. 16:00–18:00',
  'ส. 09:00–11:00',
  'ส. 13:00–15:00',
  'อา. 10:00–12:00',
];

const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

const defaultSchedule = [
  { id: 1, courseId: 1, day: 'จันทร์',  time: '16:00–18:00', room: 'A-101' },
  { id: 2, courseId: 2, day: 'อังคาร', time: '17:00–19:00', room: 'A-202' },
  { id: 3, courseId: 3, day: 'พุธ',    time: '16:00–18:00', room: 'B-105' },
  { id: 4, courseId: 4, day: 'พฤหัส', time: '17:00–19:00', room: 'B-204' },
  { id: 5, courseId: 5, day: 'ศุกร์',  time: '16:00–18:00', room: 'C-301' },
  { id: 6, courseId: 6, day: 'เสาร์',  time: '09:00–11:00', room: 'A-101' },
  { id: 7, courseId: 2, day: 'เสาร์',  time: '13:00–15:00', room: 'A-202' },
  { id: 8, courseId: 4, day: 'อาทิตย์', time: '10:00–12:00', room: 'B-204' },
];

const DEMO = {
  student: { email: 'student@math.com', password: '1234' },
  admin:   { email: 'admin@math.com',   password: 'admin' },
};

/* ─────────────────────────────────────────────────────────────────────
 * LocalStorage helpers
 * ───────────────────────────────────────────────────────────────────── */
const LS_KEYS = {
  user: 'mm.currentUser',
  regs: 'mm.registrations',
  courses: 'mm.courses',
  schedule: 'mm.schedule',
  users: 'mm.users',
};

const loadLS = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const saveLS = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

/* ─────────────────────────────────────────────────────────────────────
 * Tiny helpers
 * ───────────────────────────────────────────────────────────────────── */
const fmtBaht = (n) => `฿${n.toLocaleString('en-US')}`;

async function hashPassword(plain) {
  const buf = new TextEncoder().encode(plain);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const Badge = ({ children, color = 'indigo' }) => {
  const palette = {
    indigo: 'bg-indigo/10 text-indigo border-indigo/30',
    gold: 'bg-gold/15 text-amber-700 border-gold/40',
    navy: 'bg-navy/10 text-navy border-navy/20',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
  }[color];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${palette}`}>
      {children}
    </span>
  );
};

const Dots = () => (
  <span className="inline-flex items-center gap-1 font-mono text-indigo">
    <span className="h-1.5 w-1.5 rounded-full bg-indigo animate-dots" />
    <span className="h-1.5 w-1.5 rounded-full bg-indigo animate-dots" style={{ animationDelay: '0.2s' }} />
    <span className="h-1.5 w-1.5 rounded-full bg-indigo animate-dots" style={{ animationDelay: '0.4s' }} />
  </span>
);

/* ─────────────────────────────────────────────────────────────────────
 * Floating math symbols (Login background)
 * ───────────────────────────────────────────────────────────────────── */
const FloatingSymbols = () => {
  const symbols = ['∑', '∫', 'π', '√', '∞', 'θ', 'Δ', 'λ', 'f(x)', '∂'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {symbols.map((s, i) => (
        <span
          key={i}
          className="absolute font-display text-indigo/30 animate-float-y"
          style={{
            top: `${(i * 13 + 8) % 90}%`,
            left: `${(i * 17 + 5) % 90}%`,
            fontSize: `${24 + (i % 4) * 14}px`,
            animationDelay: `${(i % 6) * 0.6}s`,
            animationDuration: `${6 + (i % 5)}s`,
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
 * Navbar
 * ───────────────────────────────────────────────────────────────────── */
const Navbar = ({ currentUser, activePage, setActivePage, onLogout }) => {
  const studentMenu = [
    { key: 'courses',  label: 'คอร์สทั้งหมด',       icon: BookOpen },
    { key: 'register', label: 'ลงทะเบียน',           icon: ClipboardList },
    { key: 'schedule', label: 'ตารางเรียนของฉัน',    icon: Calendar },
  ];
  const adminMenu = [
    { key: 'admin-dashboard', label: 'จัดการคอร์ส',    icon: LayoutDashboard },
    { key: 'schedule',        label: 'ตารางสอนรวม',    icon: Calendar },
    { key: 'admin-users',     label: 'ผู้ลงทะเบียน',   icon: Users },
  ];
  const menu = currentUser?.role === 'admin' ? adminMenu : studentMenu;

  return (
    <header className="sticky top-0 z-30 border-b border-navy/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <button
          onClick={() => setActivePage(currentUser?.role === 'admin' ? 'admin-dashboard' : 'courses')}
          className="flex items-center gap-2"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy text-gold shadow-sm">
            <Sigma size={20} strokeWidth={2.4} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-navy">
            MathMaster<span className="text-indigo">.</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {menu.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activePage === key
                  ? 'bg-navy text-white shadow'
                  : 'text-navy/70 hover:bg-navy/5 hover:text-navy'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="text-right leading-tight">
              <div className="text-sm font-semibold text-navy flex items-center gap-1 justify-end">
                {currentUser?.role === 'admin' && (
                  <Shield size={14} className="text-gold" fill="#FBBF24" />
                )}
                {currentUser?.name || (currentUser?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'นักเรียน')}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-navy/50">
                {currentUser?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'นักเรียน'}
              </div>
            </div>
            <Badge color={currentUser?.role === 'admin' ? 'gold' : 'indigo'}>
              {currentUser?.role === 'admin' ? '🛡 ผู้ดูแล' : '🎓 นักเรียน'}
            </Badge>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-lg border border-navy/10 bg-white px-3 py-2 text-sm font-medium text-navy/80 transition hover:border-rose-300 hover:text-rose-600"
          >
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </div>
    </header>
  );
};

/* ─────────────────────────────────────────────────────────────────────
 * Login Page
 * ───────────────────────────────────────────────────────────────────── */
const LoginPage = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError('');
  };

  const switchMode = (next) => {
    setMode(next);
    resetForm();
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      if (mode === 'signup') {
        if (!name.trim()) {
          setError('กรุณากรอกชื่อ-นามสกุล');
          return;
        }
        if (password.length < 8) {
          setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
          return;
        }
        if (!/[a-z]/.test(password)) {
          setError('รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว');
          return;
        }
        if (!/[0-9]/.test(password)) {
          setError('รหัสผ่านต้องมีตัวเลข (0-9) อย่างน้อย 1 ตัว');
          return;
        }
        if (password !== confirmPassword) {
          setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน');
          return;
        }

        const users = loadLS(LS_KEYS.users, []);
        if (users.find((u) => u.email === cleanEmail)) {
          setError('อีเมลนี้ถูกใช้แล้ว กรุณาเข้าสู่ระบบหรือใช้อีเมลอื่น');
          return;
        }
        if (cleanEmail === DEMO.student.email || cleanEmail === DEMO.admin.email) {
          setError('อีเมลนี้สงวนไว้สำหรับบัญชีทดสอบ');
          return;
        }

        const passwordHash = await hashPassword(password);
        const newUser = {
          email: cleanEmail,
          passwordHash,
          name: name.trim(),
          role: 'student',
          createdAt: Date.now(),
        };
        saveLS(LS_KEYS.users, [...users, newUser]);
        onLogin({ role: 'student', email: cleanEmail, name: newUser.name });
        return;
      }

      // Login flow — registered users first, then demo accounts
      const users = loadLS(LS_KEYS.users, []);
      const found = users.find((u) => u.email === cleanEmail);
      if (found) {
        const passwordHash = await hashPassword(password);
        if (passwordHash === found.passwordHash) {
          onLogin({ role: found.role, email: found.email, name: found.name });
          return;
        }
        setError('รหัสผ่านไม่ถูกต้อง');
        return;
      }

      const expected = DEMO[role];
      if (cleanEmail === expected.email && password === expected.password) {
        onLogin({
          role,
          email: expected.email,
          name: role === 'admin' ? 'ผู้ดูแลระบบ' : 'นักเรียนทดสอบ',
        });
        return;
      }
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    const d = DEMO[role];
    setEmail(d.email);
    setPassword(d.password);
  };

  return (
    <div className="relative min-h-screen graph-paper">
      <FloatingSymbols />
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Brand panel */}
          <div className="hidden flex-col justify-center lg:flex">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy text-gold shadow-lg">
                <Sigma size={26} strokeWidth={2.4} />
              </span>
              <span className="font-display text-3xl font-bold text-navy">
                MathMaster<span className="text-indigo">.</span>Academy
              </span>
            </div>
            <h1 className="font-display text-5xl font-bold leading-tight text-navy">
              ที่ซึ่งตัวเลข <span className="text-indigo">กลายเป็น</span>
              <br />
              <span className="italic">ศิลปะ</span>
            </h1>
            <p className="mt-6 max-w-md text-navy/70">
              สถาบันติวคณิตศาสตร์ระดับพรีเมียม สำหรับนักเรียนที่มุ่งมั่นสู่ความเป็นเลิศ
              จากเลขคณิตพื้นฐานถึงแคลคูลัสขั้นสูง ครูผู้เชี่ยวชาญของเราพร้อมสร้างความชัดเจน
              ความลึกซึ้ง และความมั่นใจให้คุณ
            </p>
            <div className="mt-8 flex items-center gap-3 font-mono text-sm text-indigo/80">
              <span className="animate-equation">f(x) = ax² + bx + c</span>
            </div>
          </div>

          {/* Login / Signup card */}
          <div className="relative animate-fade-in">
            <div className="rounded-3xl border border-navy/10 bg-white/95 p-8 shadow-2xl backdrop-blur">
              {/* Mode tabs */}
              <div className="mb-6 flex rounded-xl border border-navy/10 bg-navy/5 p-1">
                {[
                  { key: 'login',  label: 'เข้าสู่ระบบ' },
                  { key: 'signup', label: 'สมัครสมาชิก' },
                ].map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => switchMode(m.key)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      mode === m.key
                        ? 'bg-navy text-white shadow'
                        : 'text-navy/60 hover:text-navy'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="mb-6 text-center">
                <div className="font-display text-2xl font-bold text-navy">
                  {mode === 'login' ? 'ยินดีต้อนรับกลับ' : 'สร้างบัญชีใหม่'}
                </div>
                <div className="text-sm text-navy/60">
                  {mode === 'login' ? 'เข้าสู่ระบบเพื่อเดินทางต่อ' : 'สมัครสมาชิกฟรีเพื่อเริ่มเรียน'}
                </div>
              </div>

              {/* Role toggle — login mode only */}
              {mode === 'login' && (
                <div className="mb-5 flex rounded-xl border border-navy/10 bg-navy/5 p-1">
                  {['student', 'admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        role === r
                          ? 'bg-navy text-white shadow'
                          : 'text-navy/60 hover:text-navy'
                      }`}
                    >
                      {r === 'admin' ? <Shield size={16} /> : <GraduationCap size={16} />}
                      {r === 'admin' ? 'ผู้ดูแล' : 'นักเรียน'}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-navy/60">
                      ชื่อ-นามสกุล
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-navy outline-none transition focus:border-indigo focus:ring-2 focus:ring-indigo/30"
                      placeholder="สมชาย ใจดี"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-navy/60">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-navy outline-none transition focus:border-indigo focus:ring-2 focus:ring-indigo/30"
                    placeholder="you@math.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-navy/60">
                    รหัสผ่าน {mode === 'signup' && <span className="text-navy/40 normal-case">(8+ ตัว, a-z, 0-9)</span>}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-navy outline-none transition focus:border-indigo focus:ring-2 focus:ring-indigo/30"
                    placeholder="••••••"
                    minLength={mode === 'signup' ? 8 : undefined}
                    required
                  />
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-navy/60">
                      ยืนยันรหัสผ่าน
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-navy outline-none transition focus:border-indigo focus:ring-2 focus:ring-indigo/30"
                      placeholder="••••••"
                      required
                    />
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3 font-semibold text-white shadow-lg shadow-navy/20 transition hover:bg-indigo disabled:opacity-60"
                >
                  {submitting ? (
                    'กำลังดำเนินการ...'
                  ) : mode === 'login' ? (
                    <>
                      เข้าสู่ระบบในฐานะ{role === 'admin' ? 'ผู้ดูแล' : 'นักเรียน'}
                      <ChevronRight size={18} className="transition group-hover:translate-x-0.5" />
                    </>
                  ) : (
                    <>
                      สมัครสมาชิก
                      <ChevronRight size={18} className="transition group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              {mode === 'login' ? (
                <div className="mt-6 rounded-xl border border-dashed border-indigo/30 bg-indigo/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo">
                      บัญชีทดสอบ
                    </div>
                    <button
                      type="button"
                      onClick={fillDemo}
                      className="text-xs font-semibold text-indigo hover:underline"
                    >
                      กรอกอัตโนมัติ
                    </button>
                  </div>
                  <ul className="space-y-1 font-mono text-xs text-navy/70">
                    <li>👤 student@math.com / 1234</li>
                    <li>🛡 admin@math.com / admin</li>
                  </ul>
                </div>
              ) : (
                <p className="mt-6 text-center text-xs text-navy/50">
                  เมื่อสมัครสมาชิก คุณยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัวของ MathMaster Academy
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
 * Hero (Courses page)
 * ───────────────────────────────────────────────────────────────────── */
const HeroBanner = () => (
  <section className="relative overflow-hidden">
    <div className="graph-paper-dark relative">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="animate-fade-in">
            <Badge color="gold">★ การศึกษาระดับพรีเมียม</Badge>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-white">
              เชี่ยวชาญ <span className="text-gold italic">ภาษา</span>
              <br />
              แห่งจักรวาล
            </h1>
            <p className="mt-4 max-w-lg text-white/70">
              คอร์สที่คัดสรรมาเป็นพิเศษ สอนโดยนักคณิตศาสตร์ที่ดีที่สุดในประเทศ
              เลือกระดับที่เหมาะกับคุณ จองเวลาเรียน และเริ่มต้นการเดินทางวันนี้
            </p>
            <div className="mt-6 inline-block rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-mono text-lg text-gold animate-equation">
              f(x) = ax² + bx + c
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 grid grid-cols-3 gap-3 opacity-70">
              {['∑', '∫', 'π', '√', '∞', '∂', 'θ', 'λ', 'Δ'].map((s, i) => (
                <div
                  key={i}
                  className="grid aspect-square place-items-center rounded-2xl border border-white/10 bg-white/[0.03] font-display text-4xl text-white/80 animate-float-y"
                  style={{ animationDelay: `${(i % 5) * 0.5}s` }}
                >
                  {s}
                </div>
              ))}
            </div>
            <div className="invisible grid grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-square" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────
 * Courses Page (Student-facing list)
 * ───────────────────────────────────────────────────────────────────── */
const CourseCard = ({ course, onRegister }) => {
  const full = course.enrolled >= course.slots;
  const pct = Math.min(100, Math.round((course.enrolled / course.slots) * 100));
  return (
    <div className="card-lift flex flex-col rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <Badge color="indigo">{course.level}</Badge>
          <h3 className="mt-2 font-display text-xl font-bold text-navy">
            {course.title}
          </h3>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-bold text-navy">
            {fmtBaht(course.price)}
          </div>
          <div className="text-xs text-navy/50">รวม</div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {course.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-md bg-indigo/5 px-2 py-0.5 text-[11px] font-medium text-indigo"
          >
            <TagIcon size={11} /> {t}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-navy/70">
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-indigo" />
          <span className="font-mono">{course.hours} ชม.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-indigo" />
          <span className="font-mono">
            {course.enrolled}/{course.slots}
          </span>
        </div>
        <div className="col-span-2 text-xs text-navy/50">
          ผู้สอน: <span className="text-navy/80">{course.teacher}</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy/5">
          <div
            className={`h-full rounded-full ${full ? 'bg-rose-400' : 'bg-indigo'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => onRegister(course)}
        disabled={full}
        className={`mt-5 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
          full
            ? 'cursor-not-allowed bg-navy/10 text-navy/40'
            : 'bg-navy text-white hover:bg-indigo'
        }`}
      >
        {full ? 'เต็มแล้ว' : 'ลงทะเบียน'}
        {!full && <ChevronRight size={16} />}
      </button>
    </div>
  );
};

const CoursesPage = ({ courses, onRegister }) => {
  const [level, setLevel] = useState('ทั้งหมด');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [query, setQuery] = useState('');

  const levels = useMemo(
    () => ['ทั้งหมด', ...Array.from(new Set(courses.map((c) => c.level)))],
    [courses],
  );

  const filtered = courses.filter(
    (c) =>
      (level === 'ทั้งหมด' || c.level === level) &&
      c.price <= maxPrice &&
      (query.trim() === '' || c.title.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="animate-fade-in">
      <HeroBanner />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Filter bar */}
        <div className="mb-8 rounded-2xl border border-navy/10 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-navy/60">
              <Filter size={16} /> <span className="text-sm font-semibold">กรอง</span>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาวิชา..."
                className="w-56 rounded-xl border border-navy/10 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-indigo focus:ring-2 focus:ring-indigo/30"
              />
            </div>
            <div>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="rounded-xl border border-navy/10 bg-white px-3 py-2 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/30"
              >
                {levels.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-1 items-center gap-3 min-w-[220px]">
              <span className="text-xs text-navy/50">ราคาสูงสุด</span>
              <input
                type="range"
                min={1000}
                max={10000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="flex-1 accent-indigo"
              />
              <span className="font-mono text-sm font-semibold text-navy">
                {fmtBaht(maxPrice)}
              </span>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-navy/15 bg-white p-16 text-center">
            <div className="font-mono text-5xl text-navy/30">{'(╯°□°）╯'}</div>
            <div className="mt-3 font-display text-2xl text-navy">ไม่พบคอร์ส</div>
            <div className="text-sm text-navy/50">ลองขยายเงื่อนไขการค้นหา</div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CourseCard key={c.id} course={c} onRegister={onRegister} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
 * Confetti
 * ───────────────────────────────────────────────────────────────────── */
const Confetti = () => {
  const pieces = Array.from({ length: 60 });
  const colors = ['#6366F1', '#FBBF24', '#0F172A', '#818CF8', '#10B981'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="absolute block animate-confetti"
          style={{
            top: `-${Math.random() * 20}px`,
            left: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 8}px`,
            height: `${10 + Math.random() * 14}px`,
            background: colors[i % colors.length],
            transform: `rotate(${Math.random() * 360}deg)`,
            animationDelay: `${Math.random() * 0.4}s`,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
 * Register Page (3-step wizard)
 * ───────────────────────────────────────────────────────────────────── */
const RegisterPage = ({ courses, preselectCourse, onSubmit, setActivePage }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    level: '',
    courseId: preselectCourse?.id || '',
    slot: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (preselectCourse) {
      setForm((f) => ({ ...f, courseId: preselectCourse.id }));
    }
  }, [preselectCourse]);

  const selectedCourse = courses.find((c) => c.id === Number(form.courseId));

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.firstName.trim()) e.firstName = 'จำเป็น';
      if (!form.lastName.trim()) e.lastName = 'จำเป็น';
      if (!/^[0-9]{9,10}$/.test(form.phone)) e.phone = '9–10 หลัก';
      if (!form.level) e.level = 'กรุณาเลือกระดับชั้น';
    }
    if (s === 2) {
      if (!form.courseId) e.courseId = 'กรุณาเลือกคอร์ส';
      if (!form.slot) e.slot = 'กรุณาเลือกเวลา';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validateStep(step) && setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = () => {
    if (!validateStep(2)) return;
    onSubmit({
      ...form,
      courseId: Number(form.courseId),
      courseTitle: selectedCourse?.title,
      submittedAt: new Date().toISOString(),
    });
    setShowSuccess(true);
  };

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const StepDot = ({ n, label }) => (
    <div className="flex flex-1 items-center gap-3">
      <div
        className={`grid h-9 w-9 place-items-center rounded-full font-mono font-bold transition ${
          step >= n ? 'bg-navy text-white' : 'bg-navy/10 text-navy/50'
        }`}
      >
        {step > n ? <CheckCircle2 size={18} /> : n}
      </div>
      <div className="hidden text-sm font-semibold text-navy md:block">{label}</div>
      {n < 3 && (
        <div className={`mx-2 hidden h-0.5 flex-1 md:block ${step > n ? 'bg-navy' : 'bg-navy/10'}`} />
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-4xl font-bold text-navy">ลงทะเบียนเรียน</h1>
        <p className="mt-2 text-navy/60">เพียง 3 ขั้นตอนง่ายๆ แล้วคุณก็พร้อมเรียน</p>

        {/* Progress */}
        <div className="mt-8 flex items-center">
          <StepDot n={1} label="ข้อมูลส่วนตัว" />
          <StepDot n={2} label="คอร์สและเวลา" />
          <StepDot n={3} label="ยืนยัน" />
        </div>

        <div className="mt-8 rounded-3xl border border-navy/10 bg-white p-8 shadow-sm">
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="ชื่อ" error={errors.firstName}>
                  <input
                    className="input"
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                  />
                </Field>
                <Field label="นามสกุล" error={errors.lastName}>
                  <input
                    className="input"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                  />
                </Field>
                <Field label="เบอร์โทรศัพท์" error={errors.phone}>
                  <input
                    className="input font-mono"
                    placeholder="0812345678"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
                  />
                </Field>
                <Field label="ระดับชั้น" error={errors.level}>
                  <select
                    className="input"
                    value={form.level}
                    onChange={(e) => update('level', e.target.value)}
                  >
                    <option value="">เลือก...</option>
                    <option>ประถมศึกษา</option>
                    <option>มัธยมต้น</option>
                    <option>มัธยมศึกษา</option>
                    <option>มัธยมปลาย</option>
                    <option>มหาวิทยาลัย</option>
                  </select>
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <Field label="คอร์ส" error={errors.courseId}>
                <select
                  className="input"
                  value={form.courseId}
                  onChange={(e) => update('courseId', e.target.value)}
                >
                  <option value="">เลือกคอร์ส...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} disabled={c.enrolled >= c.slots}>
                      {c.title} — {fmtBaht(c.price)}{c.enrolled >= c.slots ? ' (เต็มแล้ว)' : ''}
                    </option>
                  ))}
                </select>
              </Field>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-navy/60">
                  ช่วงเวลาที่สามารถเรียนได้
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {timeSlotOptions.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => update('slot', slot)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                        form.slot === slot
                          ? 'border-indigo bg-indigo text-white shadow'
                          : 'border-navy/10 bg-white text-navy/70 hover:border-indigo hover:text-indigo'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {errors.slot && (
                  <div className="mt-1 text-xs font-semibold text-rose-600">{errors.slot}</div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-navy">ยืนยันข้อมูล</h2>
              <p className="text-sm text-navy/60">กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน</p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Summary label="ชื่อ-นามสกุล" value={`${form.firstName} ${form.lastName}`} />
                <Summary label="เบอร์โทรศัพท์" value={form.phone} mono />
                <Summary label="ระดับชั้น" value={form.level} />
                <Summary label="คอร์ส" value={selectedCourse?.title} />
                <Summary label="ผู้สอน" value={selectedCourse?.teacher} />
                <Summary label="เวลาเรียน" value={form.slot} />
                <Summary label="จำนวนชั่วโมง" value={`${selectedCourse?.hours} ชม.`} mono />
                <Summary
                  label="ราคา"
                  value={selectedCourse ? fmtBaht(selectedCourse.price) : '-'}
                  mono
                  highlight
                />
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 1}
              className="flex items-center gap-1.5 rounded-xl border border-navy/10 bg-white px-4 py-2 text-sm font-semibold text-navy/70 transition hover:border-navy hover:text-navy disabled:opacity-40"
            >
              <ChevronLeft size={16} /> ย้อนกลับ
            </button>
            {step < 3 ? (
              <button
                onClick={next}
                className="flex items-center gap-1.5 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo"
              >
                ถัดไป <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={submit}
                className="flex items-center gap-1.5 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-navy shadow-lg transition hover:bg-amber-300"
              >
                ยืนยันการลงทะเบียน <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <Confetti />
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-display text-3xl font-bold text-navy">สำเร็จแล้ว! 🎉</h3>
            <p className="mt-2 text-navy/60">
              การลงทะเบียนสำหรับ <span className="font-semibold text-navy">{selectedCourse?.title}</span> ได้รับการบันทึกแล้ว
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                setActivePage('schedule');
              }}
              className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo"
            >
              ดูตารางเรียนของฉัน <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <label className="block">
    <div className="mb-1 flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider text-navy/60">{label}</span>
      {error && <span className="text-xs font-semibold text-rose-600">{error}</span>}
    </div>
    {children}
  </label>
);

const Summary = ({ label, value, mono, highlight }) => (
  <div className="rounded-xl border border-navy/10 bg-navy/[0.02] p-4">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/50">{label}</div>
    <div
      className={`mt-1 font-semibold ${mono ? 'font-mono' : ''} ${
        highlight ? 'text-gold text-xl' : 'text-navy'
      }`}
    >
      {value || '-'}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────
 * Schedule (Student weekly view + Admin master schedule)
 * ───────────────────────────────────────────────────────────────────── */
const SchedulePage = ({ currentUser, courses, registrations, schedule, setSchedule }) => {
  const isAdmin = currentUser.role === 'admin';
  const [editing, setEditing] = useState(null);

  const myRegs = registrations.filter((r) => r.studentEmail === currentUser.email);

  const studentEvents = days.map((d) => {
    return schedule
      .filter((s) => s.day === d)
      .filter((s) => myRegs.some((r) => r.courseId === s.courseId))
      .map((s) => {
        const course = courses.find((c) => c.id === s.courseId);
        return { ...s, course };
      });
  });

  const adminEvents = days.map((d) =>
    schedule.filter((s) => s.day === d).map((s) => ({
      ...s,
      course: courses.find((c) => c.id === s.courseId),
    })),
  );

  const events = isAdmin ? adminEvents : studentEvents;

  const hasAny = events.some((d) => d.length > 0);

  const exportPDF = () => window.print();

  const removeEntry = (id) => {
    if (!confirm('ต้องการลบรายการนี้ใช่ไหม?')) return;
    setSchedule((s) => s.filter((e) => e.id !== id));
  };

  const saveEntry = (entry) => {
    const normalized = {
      ...entry,
      courseId: Number(entry.courseId),
    };
    setSchedule((s) => {
      if (normalized.id) return s.map((e) => (e.id === normalized.id ? normalized : e));
      return [...s, { ...normalized, id: Math.max(0, ...s.map((e) => e.id)) + 1 }];
    });
    setEditing(null);
  };

  return (
    <div className="mx-auto max-w-7xl animate-fade-in px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-navy">
            {isAdmin ? 'ตารางสอนรวม' : 'ตารางเรียนรายสัปดาห์'}
          </h1>
          <p className="mt-1 text-navy/60">
            {isAdmin
              ? 'คอร์สทั้งหมดในแต่ละสัปดาห์ — กดปุ่ม + เพื่อเพิ่ม หรือคลิกการ์ดเพื่อแก้ไข'
              : 'แผนการเรียนส่วนตัวของคุณสำหรับสัปดาห์นี้'}
          </p>
        </div>
        {isAdmin ? (
          <button
            onClick={() => setEditing({ courseId: '', day: 'จันทร์', time: '', room: '' })}
            className="flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-navy shadow hover:bg-amber-300"
          >
            <Plus size={16} /> เพิ่มรายการ
          </button>
        ) : (
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo print:hidden"
          >
            <Printer size={16} /> ส่งออก PDF
          </button>
        )}
      </div>

      {!isAdmin && !hasAny ? (
        <div className="mt-10 rounded-2xl border border-dashed border-navy/15 bg-white p-16 text-center">
          <div className="font-mono text-5xl text-navy/30">∅</div>
          <div className="mt-3 font-display text-2xl text-navy">ยังไม่มีคลาสเรียน</div>
          <div className="text-sm text-navy/50">ลงทะเบียนคอร์สเพื่อดูตารางเรียนที่นี่</div>
        </div>
      ) : (
        <div className="mt-8 grid gap-3 md:grid-cols-7">
          {days.map((d, i) => (
            <div
              key={d}
              className="rounded-2xl border border-navy/10 bg-white p-3 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="font-display text-lg font-bold text-navy">{d}</div>
                <div className="flex items-center gap-1">
                  <Badge color="indigo">{events[i].length}</Badge>
                  {isAdmin && (
                    <button
                      onClick={() => setEditing({ courseId: '', day: d, time: '', room: '' })}
                      className="grid h-6 w-6 place-items-center rounded-full border border-navy/10 text-navy/60 transition hover:border-indigo hover:text-indigo"
                      title="เพิ่มรายการ"
                    >
                      <Plus size={12} />
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {events[i].length === 0 && (
                  <div className="rounded-lg border border-dashed border-navy/10 py-6 text-center text-xs text-navy/40">
                    ว่าง
                  </div>
                )}
                {events[i].map((ev) => (
                  <div
                    key={ev.id}
                    className={`group relative rounded-xl border border-indigo/20 bg-indigo/5 p-3 ${
                      isAdmin ? 'cursor-pointer transition hover:border-indigo' : ''
                    }`}
                    onClick={() => isAdmin && setEditing(ev)}
                  >
                    <div className="text-[11px] font-mono text-indigo">{ev.time || '—'}</div>
                    <div className="mt-0.5 line-clamp-2 text-sm font-semibold text-navy">
                      {ev.course?.title || '⚠ ไม่พบคอร์ส'}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-navy/60">
                      <span>{ev.course?.teacher}</span>
                      <span className="font-mono">📍 {ev.room}</span>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEntry(ev.id);
                        }}
                        className="absolute right-1.5 top-1.5 hidden rounded-md border border-rose-200 bg-white p-1 text-rose-600 hover:bg-rose-50 group-hover:block"
                        title="ลบรายการ"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ScheduleEntryEditor
          draft={editing}
          courses={courses}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={saveEntry}
        />
      )}

      {isAdmin && (
        <div className="mt-10 rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-navy">ภาพรวมการลงทะเบียน</h2>
          <p className="text-sm text-navy/60">จำนวนผู้ลงทะเบียนในแต่ละคอร์ส</p>
          <div className="mt-5 space-y-4">
            {courses.map((c) => {
              const liveEnrolled =
                c.enrolled + registrations.filter((r) => r.courseId === c.id).length;
              const pct = Math.min(100, Math.round((liveEnrolled / c.slots) * 100));
              return (
                <div key={c.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div className="font-semibold text-navy">{c.title}</div>
                    <div className="font-mono text-navy/70">
                      {liveEnrolled}/{c.slots}
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-navy/5">
                    <div
                      className={`h-full ${pct >= 100 ? 'bg-rose-400' : 'bg-indigo'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
 * Schedule Entry Editor (modal)
 * ───────────────────────────────────────────────────────────────────── */
const ScheduleEntryEditor = ({ draft, courses, onChange, onClose, onSave }) => {
  const upd = (k, v) => onChange({ ...draft, [k]: v });
  const isNew = !draft.id;
  const valid = draft.courseId && draft.day && draft.time.trim() && draft.room.trim();

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl font-bold text-navy">
            {isNew ? 'เพิ่มรายการตารางสอน' : 'แก้ไขรายการตารางสอน'}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-navy/60 hover:bg-navy/5">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="คอร์ส">
            <select
              className="input"
              value={draft.courseId}
              onChange={(e) => upd('courseId', e.target.value)}
            >
              <option value="">เลือกคอร์ส...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} — {c.teacher}
                </option>
              ))}
            </select>
          </Field>

          <Field label="วัน">
            <select
              className="input"
              value={draft.day}
              onChange={(e) => upd('day', e.target.value)}
            >
              {days.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>

          <Field label="เวลา (เช่น 16:00–18:00)">
            <input
              className="input font-mono"
              placeholder="16:00–18:00"
              value={draft.time}
              onChange={(e) => upd('time', e.target.value)}
            />
          </Field>

          <Field label="ห้องเรียน">
            <input
              className="input font-mono"
              placeholder="A-101"
              value={draft.room}
              onChange={(e) => upd('room', e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-navy/10 px-4 py-2 text-sm font-semibold text-navy/70 hover:border-navy hover:text-navy"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => onSave(draft)}
            disabled={!valid}
            className="rounded-xl bg-navy px-5 py-2 text-sm font-semibold text-white hover:bg-indigo disabled:cursor-not-allowed disabled:opacity-40"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
 * Admin Dashboard — manage courses
 * ───────────────────────────────────────────────────────────────────── */
const emptyCourseDraft = {
  title: '',
  level: 'มัธยมต้น',
  hours: 40,
  price: 3500,
  tags: '',
  teacher: '',
  slots: 10,
  enrolled: 0,
};

const AdminDashboard = ({ courses, setCourses, registrations }) => {
  const [editing, setEditing] = useState(null);

  const totalEnrolled = registrations.length + courses.reduce((s, c) => s + c.enrolled, 0);

  const remove = (id) => {
    if (!confirm('ต้องการลบคอร์สนี้ใช่ไหม?')) return;
    setCourses((cs) => cs.filter((c) => c.id !== id));
  };

  const saveDraft = (draft) => {
    const normalized = {
      ...draft,
      hours: Number(draft.hours),
      price: Number(draft.price),
      slots: Number(draft.slots),
      enrolled: Number(draft.enrolled),
      tags:
        typeof draft.tags === 'string'
          ? draft.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : draft.tags,
    };
    setCourses((cs) => {
      if (normalized.id) return cs.map((c) => (c.id === normalized.id ? normalized : c));
      return [...cs, { ...normalized, id: Math.max(...cs.map((c) => c.id), 0) + 1 }];
    });
    setEditing(null);
  };

  return (
    <div className="mx-auto max-w-7xl animate-fade-in px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-navy">แผงควบคุมผู้ดูแล</h1>
          <p className="mt-1 text-navy/60">จัดการรายการคอร์สของสถาบัน</p>
        </div>
        <button
          onClick={() => setEditing({ ...emptyCourseDraft })}
          className="flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-navy shadow hover:bg-amber-300"
        >
          <Plus size={16} /> เพิ่มคอร์สใหม่
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat label="คอร์สทั้งหมด"   value={courses.length}          icon={BookOpen} />
        <Stat label="ลงทะเบียนแล้ว"  value={totalEnrolled}           icon={Users} />
        <Stat label="รอการอนุมัติ"   value={registrations.length}    icon={ClipboardList} />
        <Stat
          label="ราคาเฉลี่ย"
          value={fmtBaht(
            Math.round(courses.reduce((s, c) => s + c.price, 0) / Math.max(1, courses.length)),
          )}
          icon={TagIcon}
          mono
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy/[0.03] text-navy/60">
              <tr>
                <th className="px-4 py-3 font-semibold">คอร์ส</th>
                <th className="px-4 py-3 font-semibold">ระดับ</th>
                <th className="px-4 py-3 font-semibold">ผู้สอน</th>
                <th className="px-4 py-3 font-semibold">ชั่วโมง</th>
                <th className="px-4 py-3 font-semibold">ราคา</th>
                <th className="px-4 py-3 font-semibold">ลงทะเบียน</th>
                <th className="px-4 py-3 font-semibold text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {courses.map((c) => {
                const live = c.enrolled + registrations.filter((r) => r.courseId === c.id).length;
                return (
                  <tr key={c.id} className="hover:bg-indigo/[0.03]">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-navy">{c.title}</div>
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        {c.tags.map((t) => (
                          <span key={t} className="text-[10px] font-medium text-indigo">#{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge>{c.level}</Badge></td>
                    <td className="px-4 py-3 text-navy/80">{c.teacher}</td>
                    <td className="px-4 py-3 font-mono text-navy/70">{c.hours} ชม.</td>
                    <td className="px-4 py-3 font-mono font-semibold text-navy">{fmtBaht(c.price)}</td>
                    <td className="px-4 py-3 font-mono">
                      <span className={live >= c.slots ? 'text-rose-600' : 'text-navy'}>
                        {live}/{c.slots}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditing({ ...c, tags: c.tags.join(', ') })}
                          className="rounded-lg border border-navy/10 p-1.5 text-navy/70 hover:border-indigo hover:text-indigo"
                          title="แก้ไข"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => remove(c.id)}
                          className="rounded-lg border border-navy/10 p-1.5 text-navy/70 hover:border-rose-300 hover:text-rose-600"
                          title="ลบ"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <CourseEditor
          draft={editing}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={saveDraft}
        />
      )}
    </div>
  );
};

const Stat = ({ label, value, icon: Icon, mono }) => (
  <div className="rounded-2xl border border-navy/10 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="text-xs font-semibold uppercase tracking-wider text-navy/50">{label}</div>
      <Icon size={16} className="text-indigo" />
    </div>
    <div className={`mt-2 text-2xl font-bold text-navy ${mono ? 'font-mono' : 'font-display'}`}>
      {value}
    </div>
  </div>
);

const CourseEditor = ({ draft, onChange, onClose, onSave }) => {
  const upd = (k, v) => onChange({ ...draft, [k]: v });
  const isNew = !draft.id;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl font-bold text-navy">
            {isNew ? 'เพิ่มคอร์สใหม่' : 'แก้ไขคอร์ส'}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-navy/60 hover:bg-navy/5">
            <X size={18} />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="ชื่อคอร์ส">
            <input className="input" value={draft.title} onChange={(e) => upd('title', e.target.value)} />
          </Field>
          <Field label="ผู้สอน">
            <input className="input" value={draft.teacher} onChange={(e) => upd('teacher', e.target.value)} />
          </Field>
          <Field label="ระดับชั้น">
            <select className="input" value={draft.level} onChange={(e) => upd('level', e.target.value)}>
              <option>ประถมศึกษา</option>
              <option>มัธยมต้น</option>
              <option>มัธยมศึกษา</option>
              <option>มัธยมปลาย</option>
              <option>มหาวิทยาลัย</option>
            </select>
          </Field>
          <Field label="แท็ก (คั่นด้วยจุลภาค)">
            <input className="input" value={draft.tags} onChange={(e) => upd('tags', e.target.value)} />
          </Field>
          <Field label="จำนวนชั่วโมง">
            <input type="number" className="input font-mono" value={draft.hours} onChange={(e) => upd('hours', e.target.value)} />
          </Field>
          <Field label="ราคา (฿)">
            <input type="number" className="input font-mono" value={draft.price} onChange={(e) => upd('price', e.target.value)} />
          </Field>
          <Field label="จำนวนที่นั่ง">
            <input type="number" className="input font-mono" value={draft.slots} onChange={(e) => upd('slots', e.target.value)} />
          </Field>
          <Field label="ผู้ลงทะเบียนเดิม">
            <input type="number" className="input font-mono" value={draft.enrolled} onChange={(e) => upd('enrolled', e.target.value)} />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border border-navy/10 px-4 py-2 text-sm font-semibold text-navy/70 hover:border-navy hover:text-navy">
            ยกเลิก
          </button>
          <button
            onClick={() => onSave(draft)}
            className="rounded-xl bg-navy px-5 py-2 text-sm font-semibold text-white hover:bg-indigo"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
 * Admin → Registered Users
 * ───────────────────────────────────────────────────────────────────── */
const statusLabel = { pending: 'รอดำเนินการ', approved: 'อนุมัติแล้ว', rejected: 'ปฏิเสธ' };

const AdminUsersPage = ({ registrations, courses, setRegistrations }) => {
  const approve = (id) =>
    setRegistrations((rs) => rs.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)));
  const reject = (id) =>
    setRegistrations((rs) => rs.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)));

  return (
    <div className="mx-auto max-w-7xl animate-fade-in px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-navy">ผู้ลงทะเบียน</h1>
      <p className="mt-1 text-navy/60">ตรวจสอบและอนุมัติการลงทะเบียน</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
        {registrations.length === 0 ? (
          <div className="p-16 text-center">
            <div className="font-mono text-5xl text-navy/30">∅</div>
            <div className="mt-3 font-display text-2xl text-navy">ยังไม่มีการลงทะเบียน</div>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-navy/[0.03] text-navy/60">
              <tr>
                <th className="px-4 py-3 font-semibold">นักเรียน</th>
                <th className="px-4 py-3 font-semibold">เบอร์โทร</th>
                <th className="px-4 py-3 font-semibold">ระดับ</th>
                <th className="px-4 py-3 font-semibold">คอร์ส</th>
                <th className="px-4 py-3 font-semibold">เวลา</th>
                <th className="px-4 py-3 font-semibold">สถานะ</th>
                <th className="px-4 py-3 font-semibold text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {registrations.map((r) => {
                const course = courses.find((c) => c.id === r.courseId);
                return (
                  <tr key={r.id} className="hover:bg-indigo/[0.03]">
                    <td className="px-4 py-3 font-semibold text-navy">
                      {r.firstName} {r.lastName}
                    </td>
                    <td className="px-4 py-3 font-mono text-navy/70">{r.phone}</td>
                    <td className="px-4 py-3"><Badge>{r.level}</Badge></td>
                    <td className="px-4 py-3 text-navy/80">{course?.title || '—'}</td>
                    <td className="px-4 py-3 font-mono text-navy/70">{r.slot}</td>
                    <td className="px-4 py-3">
                      <Badge color={r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'gold'}>
                        {statusLabel[r.status] || statusLabel.pending}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => approve(r.id)}
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          อนุมัติ
                        </button>
                        <button
                          onClick={() => reject(r.id)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
 * Root App with state-based routing
 * ───────────────────────────────────────────────────────────────────── */
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => loadLS(LS_KEYS.user, null));
  const [activePage, setActivePage] = useState(currentUser ? (currentUser.role === 'admin' ? 'admin-dashboard' : 'courses') : 'login');
  const [courses, setCourses] = useState(() => loadLS(LS_KEYS.courses, mockCourses));
  const [registrations, setRegistrations] = useState(() => loadLS(LS_KEYS.regs, []));
  const [schedule, setSchedule] = useState(() => loadLS(LS_KEYS.schedule, defaultSchedule));
  const [preselectCourse, setPreselectCourse] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => saveLS(LS_KEYS.user, currentUser), [currentUser]);
  useEffect(() => saveLS(LS_KEYS.regs, registrations), [registrations]);
  useEffect(() => saveLS(LS_KEYS.courses, courses), [courses]);
  useEffect(() => saveLS(LS_KEYS.schedule, schedule), [schedule]);

  useEffect(() => {
    if (!currentUser && activePage !== 'login') setActivePage('login');
  }, [currentUser, activePage]);

  const changePage = (next) => {
    setTransitioning(true);
    setTimeout(() => {
      setActivePage(next);
      setTransitioning(false);
    }, 280);
  };

  const handleLogin = (u) => {
    setCurrentUser(u);
    changePage(u.role === 'admin' ? 'admin-dashboard' : 'courses');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('login');
  };

  const handleRegisterClick = (course) => {
    setPreselectCourse(course);
    changePage('register');
  };

  const submitRegistration = (data) => {
    setRegistrations((rs) => [
      ...rs,
      {
        id: Date.now(),
        studentEmail: currentUser.email,
        status: 'pending',
        ...data,
      },
    ]);
  };

  if (!currentUser) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar
        currentUser={currentUser}
        activePage={activePage}
        setActivePage={changePage}
        onLogout={handleLogout}
      />

      {transitioning ? (
        <div className="grid place-items-center py-32">
          <div className="text-center">
            <Dots />
            <div className="mt-3 font-mono text-sm text-navy/50">กำลังแก้สมการ x...</div>
          </div>
        </div>
      ) : (
        <main>
          {activePage === 'courses' && (
            <CoursesPage courses={courses} onRegister={handleRegisterClick} />
          )}
          {activePage === 'register' && (
            <RegisterPage
              courses={courses}
              preselectCourse={preselectCourse}
              onSubmit={submitRegistration}
              setActivePage={changePage}
            />
          )}
          {activePage === 'schedule' && (
            <SchedulePage
              currentUser={currentUser}
              courses={courses}
              registrations={registrations}
              schedule={schedule}
              setSchedule={setSchedule}
            />
          )}
          {activePage === 'admin-dashboard' && currentUser.role === 'admin' && (
            <AdminDashboard
              courses={courses}
              setCourses={setCourses}
              registrations={registrations}
            />
          )}
          {activePage === 'admin-users' && currentUser.role === 'admin' && (
            <AdminUsersPage
              registrations={registrations}
              courses={courses}
              setRegistrations={setRegistrations}
            />
          )}
        </main>
      )}

      <footer className="mt-16 border-t border-navy/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-xs text-navy/50">
          <div className="flex items-center gap-2">
            <Sigma size={14} className="text-indigo" />
            <span className="font-display text-sm font-bold text-navy">MathMaster Academy</span>
          </div>
          <div className="font-mono">© {new Date().getFullYear()} — แก้สมการสู่ความชัดเจน</div>
        </div>
      </footer>
    </div>
  );
}

/* Tailwind component helpers via plain class — used inline */
const InputStyles = `
.input {
  width: 100%;
  border: 1px solid rgba(15,23,42,0.15);
  border-radius: 0.75rem;
  background: #fff;
  padding: 0.625rem 0.875rem;
  outline: none;
  font-size: 0.95rem;
  color: #0F172A;
  transition: border-color .2s, box-shadow .2s;
}
.input:focus {
  border-color: #6366F1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.3);
}
`;

if (typeof document !== 'undefined' && !document.getElementById('mm-input-styles')) {
  const s = document.createElement('style');
  s.id = 'mm-input-styles';
  s.innerHTML = InputStyles;
  document.head.appendChild(s);
}
