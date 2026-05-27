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

  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Printer,
  X,
  Trash2,
  Pencil,
  Plus,
  UserCog,
  User,
  Camera,
  Sun,
  Moon,
  ArrowLeftRight,
  UserMinus,
  ChevronDown,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────
 * Mock data
 * ───────────────────────────────────────────────────────────────────── */
const TEACHER = 'ครูทราย';
const TEACHER_BIG = 'ครูพี่บิ๊ก';

const mockCourses = [
  // ─── ป.5-6 เสาร์บ่าย ─────────────────────────────────────────────
  { id: 1, title: 'คอร์สเสาร์ ป.5 (เพิ่มเกรดในห้องเรียน)', level: 'ประถมศึกษา', hours: 12, price: 2000, tags: ['ป.5', 'เปิดเทอม 1', 'รายเดือน'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'ส. 13:00–16:00' },
  { id: 2, title: 'คอร์สเสาร์ ป.6 (สรุปสอบเข้า ม.1)', level: 'ประถมศึกษา', hours: 12, price: 2000, tags: ['ป.6', 'สอบเข้า ม.1', 'คณิต-วิทย์-อังกฤษ'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'ส. 13:00–16:00' },

  // ─── ป.1-4 อาทิตย์เช้า ───────────────────────────────────────────
  { id: 3, title: 'คอร์สอาทิตย์ ป.1 (คณิต/วิทย์/อังกฤษ/ไทย)', level: 'ประถมศึกษา', hours: 16, price: 2000, tags: ['ป.1', '4 วิชา', 'รายเดือน'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'อา. 08:30–12:30' },
  { id: 4, title: 'คอร์สอาทิตย์ ป.2 (คณิต/วิทย์/อังกฤษ/ไทย)', level: 'ประถมศึกษา', hours: 16, price: 2000, tags: ['ป.2', '4 วิชา', 'รายเดือน'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'อา. 08:30–12:30' },
  { id: 5, title: 'คอร์สอาทิตย์ ป.3 (คณิต/วิทย์/อังกฤษ/ไทย)', level: 'ประถมศึกษา', hours: 16, price: 2000, tags: ['ป.3', '4 วิชา', 'รายเดือน'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'อา. 08:30–12:30' },
  { id: 6, title: 'คอร์สอาทิตย์ ป.4 (คณิต/วิทย์/อังกฤษ/ไทย)', level: 'ประถมศึกษา', hours: 16, price: 2000, tags: ['ป.4', '4 วิชา', 'รายเดือน'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'อา. 08:30–12:30' },

  // ─── ป.1-6 วันธรรมดา 17-19 น. ─────────────────────────────────────
  { id: 7,  title: 'คอร์สวันธรรมดา ป.1 (จันทร์+พุธ)', level: 'ประถมศึกษา', hours: 16, price: 2000, tags: ['ป.1', 'วันธรรมดา', '4 วิชา'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'จ.+พ. 17:00–19:00' },
  { id: 8,  title: 'คอร์สวันธรรมดา ป.2 (จันทร์+พุธ)', level: 'ประถมศึกษา', hours: 16, price: 2000, tags: ['ป.2', 'วันธรรมดา', '4 วิชา'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'จ.+พ. 17:00–19:00' },
  { id: 9,  title: 'คอร์สวันธรรมดา ป.3 (อังคาร+พฤหัส)', level: 'ประถมศึกษา', hours: 16, price: 2000, tags: ['ป.3', 'วันธรรมดา', '4 วิชา'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'อ.+พฤ. 17:00–19:00' },
  { id: 10, title: 'คอร์สวันธรรมดา ป.4 (อังคาร+พฤหัส)', level: 'ประถมศึกษา', hours: 16, price: 2000, tags: ['ป.4', 'วันธรรมดา', '4 วิชา'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'อ.+พฤ. 17:00–19:00' },
  { id: 11, title: 'คอร์สวันธรรมดา ป.5 (พุธ+พฤหัส)', level: 'ประถมศึกษา', hours: 16, price: 2000, tags: ['ป.5', 'วันธรรมดา', '4 วิชา'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'พ.+พฤ. 17:00–19:00' },
  { id: 12, title: 'คอร์สวันธรรมดา ป.6 (พุธ+พฤหัส)', level: 'ประถมศึกษา', hours: 16, price: 2000, tags: ['ป.6', 'วันธรรมดา', '4 วิชา'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'พ.+พฤ. 17:00–19:00' },

  // ─── ม.1-3 เสาร์เช้า ──────────────────────────────────────────────
  { id: 13, title: 'คอร์สเสาร์ ม.1 (เพิ่มเกรดในห้องเรียน)', level: 'มัธยมต้น', hours: 12, price: 1800, tags: ['ม.1', 'คณิต-วิทย์-อังกฤษ'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'ส. 09:00–12:00' },
  { id: 14, title: 'คอร์สเสาร์ ม.2 (เพิ่มเกรดในห้องเรียน)', level: 'มัธยมต้น', hours: 12, price: 1800, tags: ['ม.2', 'คณิต-วิทย์-อังกฤษ'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'ส. 09:00–12:00' },
  { id: 15, title: 'คอร์สเสาร์ ม.3 (สรุปสอบเข้า ม.4)', level: 'มัธยมต้น', hours: 12, price: 1800, tags: ['ม.3', 'สอบเข้า ม.4'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'ส. 09:00–12:00' },

  // ─── ม.1 วันธรรมดา รายวิชา ────────────────────────────────────────
  { id: 16, title: 'วิทย์ ม.1 (วันจันทร์)', level: 'มัธยมต้น', hours: 6, price: 1000, tags: ['ม.1', 'วิทย์'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'จ. 17:00–18:30' },
  { id: 17, title: 'คณิต ม.1 (วันอังคาร)', level: 'มัธยมต้น', hours: 6, price: 1000, tags: ['ม.1', 'คณิต'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'อ. 17:00–18:30' },
  { id: 18, title: 'อังกฤษ ม.1 (วันพุธ)', level: 'มัธยมต้น', hours: 6, price: 1000, tags: ['ม.1', 'อังกฤษ'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'พ. 17:00–18:30' },

  // ─── ม.2 วันธรรมดา รายวิชา ────────────────────────────────────────
  { id: 19, title: 'อังกฤษ ม.2 (วันจันทร์)', level: 'มัธยมต้น', hours: 6, price: 1000, tags: ['ม.2', 'อังกฤษ'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'จ. 17:00–18:30' },
  { id: 20, title: 'วิทย์ ม.2 (วันอังคาร)', level: 'มัธยมต้น', hours: 6, price: 1000, tags: ['ม.2', 'วิทย์'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'อ. 17:00–18:30' },
  { id: 21, title: 'คณิต ม.2 (วันพุธ)', level: 'มัธยมต้น', hours: 6, price: 1000, tags: ['ม.2', 'คณิต'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'พ. 17:00–18:30' },

  // ─── ม.4 วันธรรมดา รายวิชา ────────────────────────────────────────
  { id: 22, title: 'ฟิสิกส์ ม.4 (วันจันทร์)', level: 'มัธยมปลาย', hours: 8, price: 1500, tags: ['ม.4', 'ฟิสิกส์'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'จ. 17:00–19:00' },
  { id: 23, title: 'คณิต ม.4 (วันอังคาร)', level: 'มัธยมปลาย', hours: 8, price: 1500, tags: ['ม.4', 'คณิต'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'อ. 17:00–19:00' },
  { id: 24, title: 'เคมี+ชีวะ ม.4 (วันพุธ)', level: 'มัธยมปลาย', hours: 8, price: 1500, tags: ['ม.4', 'เคมี', 'ชีวะ'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'พ. 17:00–19:00' },
  { id: 25, title: 'อังกฤษ ม.4 (วันศุกร์)', level: 'มัธยมปลาย', hours: 8, price: 1500, tags: ['ม.4', 'อังกฤษ'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'ศ. 17:00–19:00' },

  // ─── ม.5 วันธรรมดา รายวิชา ────────────────────────────────────────
  { id: 26, title: 'เคมี+ชีวะ ม.5 (วันจันทร์)', level: 'มัธยมปลาย', hours: 8, price: 1500, tags: ['ม.5', 'เคมี', 'ชีวะ'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'จ. 17:00–19:00' },
  { id: 27, title: 'ฟิสิกส์ ม.5 (วันอังคาร)', level: 'มัธยมปลาย', hours: 8, price: 1500, tags: ['ม.5', 'ฟิสิกส์'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'อ. 17:00–19:00' },
  { id: 28, title: 'คณิต ม.5 (วันพุธ)', level: 'มัธยมปลาย', hours: 8, price: 1500, tags: ['ม.5', 'คณิต'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'พ. 17:00–19:00' },
  { id: 29, title: 'อังกฤษ ม.5 (วันพฤหัส)', level: 'มัธยมปลาย', hours: 8, price: 1500, tags: ['ม.5', 'อังกฤษ'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'พฤ. 17:00–19:00' },

  // ─── ม.6 ──────────────────────────────────────────────────────────
  { id: 30, title: 'คณิต A-LEVEL 1,2 ม.6 (วันศุกร์)', level: 'มัธยมปลาย', hours: 8, price: 1500, tags: ['ม.6', 'A-LEVEL', 'คณิต'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'ศ. 17:00–19:00' },

  // ─── คอร์สพิเศษ มหิดล/จุฬาภรณ์/วมว. ─────────────────────────────
  {
    id: 31,
    title: 'เตรียมสอบคณิต มหิดล/จุฬาภรณ์/วมว. ป.4-6 (เตรียมเข้า ม.1)',
    level: 'ประถมศึกษา', hours: 20, price: 2990, tags: ['สอบเข้า ม.1', 'มหิดล', 'จุฬาภรณ์', 'วมว.', 'Early Bird'],
    teacher: TEACHER_BIG, slots: 12, enrolled: 0, timeSlot: 'อา. 09:00–11:00',
    startDate: '2026-05-24', endDate: '2026-07-26',
    earlyBirdPrice: 2500, earlyBirdUntil: '2026-05-15',
  },
  {
    id: 32,
    title: 'เตรียมสอบคณิต มหิดล/จุฬาภรณ์/วมว. ม.1-3 (เตรียมเข้า ม.4)',
    level: 'มัธยมต้น', hours: 20, price: 2990, tags: ['สอบเข้า ม.4', 'มหิดล', 'จุฬาภรณ์', 'วมว.', 'Early Bird'],
    teacher: TEACHER_BIG, slots: 12, enrolled: 0, timeSlot: 'อา. 12:00–14:00',
    startDate: '2026-05-24', endDate: '2026-07-26',
    earlyBirdPrice: 2500, earlyBirdUntil: '2026-05-15',
  },

  // ─── แพ็คเกจรวมวิชา ──────────────────────────────────────────────
  { id: 33, title: 'แพ็คเกจ ม.1 รวม 2 วิชา (เลือกได้ 2 จากคณิต/วิทย์/อังกฤษ)', level: 'มัธยมต้น', hours: 12, price: 1700, tags: ['ม.1', 'ประหยัด'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'จ.+อ. 17:00–18:30', bundleCourseIds: [16, 17] },
  { id: 34, title: 'แพ็คเกจ ม.1 รวม 3 วิชา (คณิต+วิทย์+อังกฤษ)', level: 'มัธยมต้น', hours: 18, price: 2400, tags: ['ม.1', 'ประหยัด'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'จ.+อ.+พ. 17:00–18:30', bundleCourseIds: [16, 17, 18] },
  { id: 35, title: 'แพ็คเกจ ม.2 รวม 3 วิชา (คณิต+วิทย์+อังกฤษ)', level: 'มัธยมต้น', hours: 18, price: 2400, tags: ['ม.2', 'ประหยัด'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'จ.+อ.+พ. 17:00–18:30', bundleCourseIds: [19, 20, 21] },
  { id: 36, title: 'แพ็คเกจ ม.4 รวม 4 วิชา (ฟิสิกส์+คณิต+เคมี/ชีวะ+อังกฤษ)', level: 'มัธยมปลาย', hours: 32, price: 4500, tags: ['ม.4', 'ครบทุกวิชา'], teacher: TEACHER, slots: 10, enrolled: 0, timeSlot: 'จ.+อ.+พ.+ศ. 17:00–19:00', bundleCourseIds: [22, 23, 24, 25] },
];

const timeSlotOptions = [
  'จ. 17:00–18:30',
  'จ. 17:00–19:00',
  'อ. 17:00–18:30',
  'อ. 17:00–19:00',
  'พ. 17:00–18:30',
  'พ. 17:00–19:00',
  'พฤ. 17:00–19:00',
  'ศ. 17:00–19:00',
  'ส. 09:00–12:00',
  'ส. 13:00–16:00',
  'อา. 08:30–12:30',
  'อา. 09:00–11:00',
  'อา. 12:00–14:00',
];

const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

const defaultSchedule = [
  // ─── ประถม (เสาร์บ่าย) ────────
  { id: 1, courseId: 1, day: 'เสาร์', time: '13:00–16:00', room: 'A-101' },
  { id: 2, courseId: 2, day: 'เสาร์', time: '13:00–16:00', room: 'A-102' },

  // ─── ป.1-4 อาทิตย์เช้า ─────────
  { id: 3, courseId: 3, day: 'อาทิตย์', time: '08:30–12:30', room: 'A-201' },
  { id: 4, courseId: 4, day: 'อาทิตย์', time: '08:30–12:30', room: 'A-202' },
  { id: 5, courseId: 5, day: 'อาทิตย์', time: '08:30–12:30', room: 'A-203' },
  { id: 6, courseId: 6, day: 'อาทิตย์', time: '08:30–12:30', room: 'A-204' },

  // ─── ป.1-6 วันธรรมดา ──────────
  { id: 7,  courseId: 7,  day: 'จันทร์', time: '17:00–19:00', room: 'B-101' },
  { id: 8,  courseId: 7,  day: 'พุธ',    time: '17:00–19:00', room: 'B-101' },
  { id: 9,  courseId: 8,  day: 'จันทร์', time: '17:00–19:00', room: 'B-102' },
  { id: 10, courseId: 8,  day: 'พุธ',    time: '17:00–19:00', room: 'B-102' },
  { id: 11, courseId: 9,  day: 'อังคาร', time: '17:00–19:00', room: 'B-103' },
  { id: 12, courseId: 9,  day: 'พฤหัส', time: '17:00–19:00', room: 'B-103' },
  { id: 13, courseId: 10, day: 'อังคาร', time: '17:00–19:00', room: 'B-104' },
  { id: 14, courseId: 10, day: 'พฤหัส', time: '17:00–19:00', room: 'B-104' },
  { id: 15, courseId: 11, day: 'พุธ',    time: '17:00–19:00', room: 'B-105' },
  { id: 16, courseId: 11, day: 'พฤหัส', time: '17:00–19:00', room: 'B-105' },
  { id: 17, courseId: 12, day: 'พุธ',    time: '17:00–19:00', room: 'B-106' },
  { id: 18, courseId: 12, day: 'พฤหัส', time: '17:00–19:00', room: 'B-106' },

  // ─── ม.1-3 เสาร์เช้า ──────────
  { id: 19, courseId: 13, day: 'เสาร์', time: '09:00–12:00', room: 'C-101' },
  { id: 20, courseId: 14, day: 'เสาร์', time: '09:00–12:00', room: 'C-102' },
  { id: 21, courseId: 15, day: 'เสาร์', time: '09:00–12:00', room: 'C-103' },

  // ─── ม.1 รายวิชา ──────────────
  { id: 22, courseId: 16, day: 'จันทร์', time: '17:00–18:30', room: 'C-201' },
  { id: 23, courseId: 17, day: 'อังคาร', time: '17:00–18:30', room: 'C-201' },
  { id: 24, courseId: 18, day: 'พุธ',    time: '17:00–18:30', room: 'C-201' },

  // ─── ม.2 รายวิชา ──────────────
  { id: 25, courseId: 19, day: 'จันทร์', time: '17:00–18:30', room: 'C-202' },
  { id: 26, courseId: 20, day: 'อังคาร', time: '17:00–18:30', room: 'C-202' },
  { id: 27, courseId: 21, day: 'พุธ',    time: '17:00–18:30', room: 'C-202' },

  // ─── ม.4 รายวิชา ──────────────
  { id: 28, courseId: 22, day: 'จันทร์', time: '17:00–19:00', room: 'D-101' },
  { id: 29, courseId: 23, day: 'อังคาร', time: '17:00–19:00', room: 'D-101' },
  { id: 30, courseId: 24, day: 'พุธ',    time: '17:00–19:00', room: 'D-101' },
  { id: 31, courseId: 25, day: 'ศุกร์',  time: '17:00–19:00', room: 'D-101' },

  // ─── ม.5 รายวิชา ──────────────
  { id: 32, courseId: 26, day: 'จันทร์', time: '17:00–19:00', room: 'D-102' },
  { id: 33, courseId: 27, day: 'อังคาร', time: '17:00–19:00', room: 'D-102' },
  { id: 34, courseId: 28, day: 'พุธ',    time: '17:00–19:00', room: 'D-102' },
  { id: 35, courseId: 29, day: 'พฤหัส', time: '17:00–19:00', room: 'D-102' },

  // ─── ม.6 ──────────────────────
  { id: 36, courseId: 30, day: 'ศุกร์', time: '17:00–19:00', room: 'D-201' },

  // ─── คอร์สเตรียมสอบ ─────────
  { id: 37, courseId: 31, day: 'อาทิตย์', time: '09:00–11:00', room: 'E-101' },
  { id: 38, courseId: 32, day: 'อาทิตย์', time: '12:00–14:00', room: 'E-101' },
];

const defaultSemesters = [
  {
    id: 1,
    name: 'ภาคเรียนที่ 1/2567',
    startDate: '2024-05-01',
    endDate: '2024-09-30',
    courseIds: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,33,34,35,36],
  },
  {
    id: 2,
    name: 'คอร์สพิเศษ มหิดล/จุฬาภรณ์/วมว. 2567',
    startDate: '2026-05-24',
    endDate: '2026-07-26',
    courseIds: [31, 32],
  },
];

const DEMO = {
  student: { email: 'student@math.com', password: '1234' },
  admin:   { email: 'admin@math.com',   password: 'admin' },
};

const mockRegistrations = [
  // ─── อนุมัติแล้ว (8) ────────────────────────────────────────────────
  { id: 1001, studentEmail: 'phum.j@demo.com',     firstName: 'ภูมิ',   lastName: 'ใจดี',        phone: '0812345678', level: 'ประถมศึกษา', courseId: 1,  courseTitle: 'คอร์สเสาร์ ป.5 (เพิ่มเกรดในห้องเรียน)',          status: 'approved', submittedAt: '2026-05-08T09:12:00.000Z', paymentMethod: 'transfer', paymentSlip: null },
  { id: 1002, studentEmail: 'pim.s@demo.com',      firstName: 'พิมพ์',  lastName: 'สวยงาม',      phone: '0823456789', level: 'ประถมศึกษา', courseId: 2,  courseTitle: 'คอร์สเสาร์ ป.6 (สรุปสอบเข้า ม.1)',               status: 'approved', submittedAt: '2026-05-09T11:30:00.000Z', paymentMethod: 'cash',     paymentSlip: null },
  { id: 1003, studentEmail: 'tune.r@demo.com',     firstName: 'ตูน',    lastName: 'เรียบร้อย',   phone: '0834567890', level: 'ประถมศึกษา', courseId: 31, courseTitle: 'เตรียมสอบคณิต มหิดล/จุฬาภรณ์/วมว. ป.4-6 (เตรียมเข้า ม.1)', status: 'approved', submittedAt: '2026-05-10T14:05:00.000Z', paymentMethod: 'transfer', paymentSlip: null },
  { id: 1004, studentEmail: 'namtarn.h@demo.com',  firstName: 'น้ำตาล', lastName: 'หวานใจ',      phone: '0845678901', level: 'ประถมศึกษา', courseId: 5,  courseTitle: 'คอร์สอาทิตย์ ป.3 (คณิต/วิทย์/อังกฤษ/ไทย)',       status: 'approved', submittedAt: '2026-05-11T08:45:00.000Z', paymentMethod: 'cash',     paymentSlip: null },
  { id: 1005, studentEmail: 'ploy.c@demo.com',     firstName: 'พลอย',   lastName: 'ฉลาดเฉลียว',  phone: '0878901234', level: 'มัธยมต้น',   courseId: 34, courseTitle: 'แพ็คเกจ ม.1 รวม 3 วิชา (คณิต+วิทย์+อังกฤษ)',    status: 'approved', submittedAt: '2026-05-12T15:20:00.000Z', paymentMethod: 'transfer', paymentSlip: null },
  { id: 1006, studentEmail: 'oak.r@demo.com',      firstName: 'โอ๊ค',   lastName: 'รักเรียน',    phone: '0801234567', level: 'มัธยมปลาย',  courseId: 36, courseTitle: 'แพ็คเกจ ม.4 รวม 4 วิชา (ฟิสิกส์+คณิต+เคมี/ชีวะ+อังกฤษ)', status: 'approved', submittedAt: '2026-05-13T12:00:00.000Z', paymentMethod: 'cash',     paymentSlip: null },
  { id: 1007, studentEmail: 'win.m@demo.com',      firstName: 'วิน',    lastName: 'มั่นใจ',      phone: '0845670123', level: 'มัธยมปลาย',  courseId: 30, courseTitle: 'คณิต A-LEVEL 1,2 ม.6 (วันศุกร์)',                 status: 'approved', submittedAt: '2026-05-14T10:18:00.000Z', paymentMethod: 'transfer', paymentSlip: null },
  { id: 1008, studentEmail: 'mew.c@demo.com',      firstName: 'มิว',    lastName: 'ช่างสงสัย',   phone: '0867890123', level: 'มัธยมต้น',   courseId: 13, courseTitle: 'คอร์สเสาร์ ม.1 (เพิ่มเกรดในห้องเรียน)',         status: 'approved', submittedAt: '2026-05-15T09:30:00.000Z', paymentMethod: 'cash',     paymentSlip: null },

  // ─── รอดำเนินการ (9) ─────────────────────────────────────────────────
  { id: 1009, studentEmail: 'arm.k@demo.com',      firstName: 'อาร์ม',  lastName: 'ขยัน',        phone: '0889012345', level: 'มัธยมต้น',   courseId: 21, courseTitle: 'คณิต ม.2 (วันพุธ)',                                status: 'pending',  submittedAt: '2026-05-18T13:45:00.000Z', paymentMethod: 'transfer', paymentSlip: null },
  { id: 1010, studentEmail: 'miew.t@demo.com',     firstName: 'หมิว',   lastName: 'ตั้งใจ',      phone: '0890123456', level: 'มัธยมต้น',   courseId: 32, courseTitle: 'เตรียมสอบคณิต มหิดล/จุฬาภรณ์/วมว. ม.1-3 (เตรียมเข้า ม.4)', status: 'pending',  submittedAt: '2026-05-19T16:10:00.000Z', paymentMethod: null,       paymentSlip: null },
  { id: 1011, studentEmail: 'prae.r@demo.com',     firstName: 'แพร',    lastName: 'เรียนเก่ง',   phone: '0812345670', level: 'มัธยมปลาย',  courseId: 23, courseTitle: 'คณิต ม.4 (วันอังคาร)',                            status: 'pending',  submittedAt: '2026-05-20T11:25:00.000Z', paymentMethod: 'cash',     paymentSlip: null },
  { id: 1012, studentEmail: 'keng.r@demo.com',     firstName: 'เก่ง',   lastName: 'ใฝ่รู้',      phone: '0823456701', level: 'มัธยมปลาย',  courseId: 27, courseTitle: 'ฟิสิกส์ ม.5 (วันอังคาร)',                          status: 'pending',  submittedAt: '2026-05-20T14:38:00.000Z', paymentMethod: null,       paymentSlip: null },
  { id: 1013, studentEmail: 'aan.c@demo.com',      firstName: 'แอน',    lastName: 'เฉียบขาด',    phone: '0834567012', level: 'มัธยมปลาย',  courseId: 26, courseTitle: 'เคมี+ชีวะ ม.5 (วันจันทร์)',                          status: 'pending',  submittedAt: '2026-05-21T09:50:00.000Z', paymentMethod: 'transfer', paymentSlip: null },
  { id: 1014, studentEmail: 'pluem.r@demo.com',    firstName: 'ปลื้ม',  lastName: 'รัก',         phone: '0856701234', level: 'ประถมศึกษา', courseId: 3,  courseTitle: 'คอร์สอาทิตย์ ป.1 (คณิต/วิทย์/อังกฤษ/ไทย)',       status: 'pending',  submittedAt: '2026-05-21T17:00:00.000Z', paymentMethod: null,       paymentSlip: null },
  { id: 1015, studentEmail: 'jib.n@demo.com',      firstName: 'จิ๊บ',   lastName: 'น่ารัก',      phone: '0867012345', level: 'ประถมศึกษา', courseId: 4,  courseTitle: 'คอร์สอาทิตย์ ป.2 (คณิต/วิทย์/อังกฤษ/ไทย)',       status: 'pending',  submittedAt: '2026-05-22T08:15:00.000Z', paymentMethod: 'cash',     paymentSlip: null },
  { id: 1016, studentEmail: 'ice.y@demo.com',      firstName: 'ไอซ์',   lastName: 'เย็น',        phone: '0870123456', level: 'มัธยมต้น',   courseId: 35, courseTitle: 'แพ็คเกจ ม.2 รวม 3 วิชา (คณิต+วิทย์+อังกฤษ)',    status: 'pending',  submittedAt: '2026-05-22T19:30:00.000Z', paymentMethod: 'transfer', paymentSlip: null },
  { id: 1017, studentEmail: 'fon.m@demo.com',      firstName: 'ฝน',     lastName: 'ใหม่',        phone: '0801234560', level: 'ประถมศึกษา', courseId: 11, courseTitle: 'คอร์สวันธรรมดา ป.5 (พุธ+พฤหัส)',                 status: 'pending',  submittedAt: '2026-05-23T10:45:00.000Z', paymentMethod: null,       paymentSlip: null },

  // ─── ปฏิเสธ (3) ──────────────────────────────────────────────────────
  { id: 1018, studentEmail: 'om.s@demo.com',       firstName: 'โอม',    lastName: 'สุภาพ',       phone: '0812340567', level: 'มัธยมต้น',   courseId: 17, courseTitle: 'คณิต ม.1 (วันอังคาร)',                           status: 'rejected', submittedAt: '2026-05-05T14:20:00.000Z', paymentMethod: null, paymentSlip: null },
  { id: 1019, studentEmail: 'boss.k@demo.com',     firstName: 'บอส',    lastName: 'กล้าหาญ',     phone: '0856789012', level: 'ประถมศึกษา', courseId: 6,  courseTitle: 'คอร์สอาทิตย์ ป.4 (คณิต/วิทย์/อังกฤษ/ไทย)',       status: 'rejected', submittedAt: '2026-05-07T11:40:00.000Z', paymentMethod: null, paymentSlip: null },
  { id: 1020, studentEmail: 'taengmoa.s@demo.com', firstName: 'แตงโม',  lastName: 'สดใส',        phone: '0823405678', level: 'มัธยมปลาย',  courseId: 22, courseTitle: 'ฟิสิกส์ ม.4 (วันจันทร์)',                         status: 'rejected', submittedAt: '2026-05-08T16:00:00.000Z', paymentMethod: null, paymentSlip: null },
];

/* ─────────────────────────────────────────────────────────────────────
 * LocalStorage helpers
 * ───────────────────────────────────────────────────────────────────── */
const LS_KEYS = {
  user: 'mm.currentUser',
  regs: 'mm.registrations.v3',
  courses: 'mm.courses.v3',
  schedule: 'mm.schedule.v2',
  users: 'mm.users',
  theme: 'mm.theme',
  semesters: 'mm.semesters.v1',
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
const fmtBaht = (n) => `฿${Number(n || 0).toLocaleString('en-US')}`;

const fmtThaiDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
};

const isEarlyBirdActive = (course, now = new Date()) => {
  if (!course?.earlyBirdPrice || !course?.earlyBirdUntil) return false;
  const deadline = new Date(course.earlyBirdUntil);
  if (Number.isNaN(deadline.getTime())) return false;
  return now <= deadline;
};

const effectivePrice = (course) =>
  isEarlyBirdActive(course) ? Number(course.earlyBirdPrice) : Number(course.price || 0);

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
    navy: 'bg-navy/10 text-navy border-navy/20 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
    red: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700',
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
const Navbar = ({ currentUser, activePage, setActivePage, onLogout, darkMode, toggleDark }) => {
  const studentMenu = [
    { key: 'courses',  label: 'คอร์สทั้งหมด',       icon: BookOpen },
    { key: 'register', label: 'ลงทะเบียน',           icon: ClipboardList },
    { key: 'schedule', label: 'ตารางเรียนของฉัน',    icon: Calendar },
    { key: 'profile',  label: 'โปรไฟล์',             icon: User },
  ];
  const adminMenu = [
    { key: 'admin-dashboard',  label: 'จัดการคอร์ส',   icon: LayoutDashboard },
    { key: 'schedule',         label: 'ตารางสอนรวม',   icon: Calendar },
    { key: 'admin-users',      label: 'ผู้ลงทะเบียน',  icon: Users },
    { key: 'admin-accounts',   label: 'จัดการบัญชี',   icon: UserCog },
    { key: 'admin-semesters',  label: 'ภาคเรียน',       icon: GraduationCap },
  ];
  const menu = currentUser?.role === 'admin' ? adminMenu : studentMenu;

  return (
    <header className="sticky top-0 z-30 border-b border-navy/10 dark:border-slate-700 bg-white/80 dark:bg-slate-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <button
          onClick={() => setActivePage(currentUser?.role === 'admin' ? 'admin-dashboard' : 'courses')}
          className="flex items-center gap-2"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy text-gold shadow-sm">
            <Sigma size={20} strokeWidth={2.4} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-navy dark:text-white">
            บ้านครูทราย
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {menu.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activePage === key
                  ? 'bg-navy text-white shadow dark:bg-indigo'
                  : 'text-navy/70 hover:bg-navy/5 hover:text-navy dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Day/night toggle */}
          <button
            onClick={toggleDark}
            title={darkMode ? 'โหมดกลางวัน' : 'โหมดกลางคืน'}
            className="grid h-9 w-9 place-items-center rounded-lg border border-navy/10 dark:border-slate-600 text-navy/60 dark:text-slate-300 hover:bg-navy/5 dark:hover:bg-slate-700 transition"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="text-right leading-tight">
              <div className="text-sm font-semibold text-navy dark:text-white flex items-center gap-1 justify-end">
                {currentUser?.role === 'admin' && (
                  <Shield size={14} className="text-gold" fill="#FBBF24" />
                )}
                {currentUser?.nickname || currentUser?.name || (currentUser?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'นักเรียน')}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-navy/50 dark:text-slate-500">
                {currentUser?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'นักเรียน'}
              </div>
            </div>
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt="avatar"
                className="h-9 w-9 rounded-full border-2 border-indigo/30 object-cover"
              />
            ) : (
              <Badge color={currentUser?.role === 'admin' ? 'gold' : 'indigo'}>
                {currentUser?.role === 'admin' ? '🛡 ผู้ดูแล' : '🎓 นักเรียน'}
              </Badge>
            )}
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-lg border border-navy/10 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-navy/80 dark:text-slate-300 transition hover:border-rose-300 hover:text-rose-600"
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
const LoginPage = ({ onLogin, darkMode, toggleDark }) => {
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
          onLogin({
            role: found.role,
            email: found.email,
            name: found.name,
            nickname: found.nickname || '',
            gradeLevel: found.gradeLevel || '',
            avatar: found.avatar || '',
          });
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
      {/* Day/night toggle on login screen */}
      <button
        onClick={toggleDark}
        title={darkMode ? 'โหมดกลางวัน' : 'โหมดกลางคืน'}
        className="absolute right-6 top-6 z-10 grid h-9 w-9 place-items-center rounded-lg border border-navy/10 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 text-navy/60 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition backdrop-blur"
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Brand panel */}
          <div className="hidden flex-col justify-center lg:flex">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy text-gold shadow-lg">
                <Sigma size={26} strokeWidth={2.4} />
              </span>
              <span className="font-display text-3xl font-bold text-navy dark:text-white">
                บ้านครูทราย
              </span>
            </div>
            <h1 className="font-display text-5xl font-bold leading-tight text-navy dark:text-white">
              ที่ซึ่งตัวเลข <span className="text-indigo">กลายเป็น</span>
              <br />
              <span className="italic">ศิลปะ</span>
            </h1>
            <p className="mt-6 max-w-md text-navy/70 dark:text-slate-300">
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
            <div className="rounded-3xl border border-navy/10 dark:border-slate-700 bg-white/95 dark:bg-slate-800 p-8 shadow-2xl backdrop-blur">
              {/* Mode tabs */}
              <div className="mb-6 flex rounded-xl border border-navy/10 dark:border-slate-600 bg-navy/5 dark:bg-slate-700/50 p-1">
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
                        : 'text-navy/60 hover:text-navy dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="mb-6 text-center">
                <div className="font-display text-2xl font-bold text-navy dark:text-white">
                  {mode === 'login' ? 'ยินดีต้อนรับกลับ' : 'สร้างบัญชีใหม่'}
                </div>
                <div className="text-sm text-navy/60 dark:text-slate-400">
                  {mode === 'login' ? 'เข้าสู่ระบบเพื่อเดินทางต่อ' : 'สมัครสมาชิกฟรีเพื่อเริ่มเรียน'}
                </div>
              </div>

              {/* Role toggle — login mode only */}
              {mode === 'login' && (
                <div className="mb-5 flex rounded-xl border border-navy/10 dark:border-slate-600 bg-navy/5 dark:bg-slate-700/50 p-1">
                  {['student', 'admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        role === r
                          ? 'bg-navy text-white shadow'
                          : 'text-navy/60 hover:text-navy dark:text-slate-400 dark:hover:text-white'
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
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-navy/60 dark:text-slate-400">
                      ชื่อ-นามสกุล
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-navy/15 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-navy dark:text-slate-100 outline-none transition focus:border-indigo focus:ring-2 focus:ring-indigo/30"
                      placeholder="สมชาย ใจดี"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-navy/60 dark:text-slate-400">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-navy/15 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-navy dark:text-slate-100 outline-none transition focus:border-indigo focus:ring-2 focus:ring-indigo/30"
                    placeholder="you@math.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-navy/60 dark:text-slate-400">
                    รหัสผ่าน {mode === 'signup' && <span className="text-navy/40 dark:text-slate-500 normal-case">(8+ ตัว, a-z, 0-9)</span>}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-navy/15 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-navy dark:text-slate-100 outline-none transition focus:border-indigo focus:ring-2 focus:ring-indigo/30"
                    placeholder="••••••"
                    minLength={mode === 'signup' ? 8 : undefined}
                    required
                  />
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-navy/60 dark:text-slate-400">
                      ยืนยันรหัสผ่าน
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-navy/15 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-navy dark:text-slate-100 outline-none transition focus:border-indigo focus:ring-2 focus:ring-indigo/30"
                      placeholder="••••••"
                      required
                    />
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-900/40 dark:border-rose-700 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
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
                <div className="mt-6 rounded-xl border border-dashed border-indigo/30 bg-indigo/5 dark:bg-indigo/10 p-4">
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
                  <ul className="space-y-1 font-mono text-xs text-navy/70 dark:text-slate-400">
                    <li>👤 student@math.com / 1234</li>
                    <li>🛡 admin@math.com / admin</li>
                  </ul>
                </div>
              ) : (
                <p className="mt-6 text-center text-xs text-navy/50 dark:text-slate-500">
                  เมื่อสมัครสมาชิก คุณยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัวของ บ้านครูทราย
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
const CourseCard = ({ course, allCourses = [], onRegister, liveEnrolled = 0 }) => {
  const totalEnrolled = course.enrolled + liveEnrolled;
  const full = totalEnrolled >= course.slots;
  const pct = Math.min(100, Math.round((totalEnrolled / course.slots) * 100));
  const bundle = isBundleCourse(course);
  const bundleChildren = bundle
    ? course.bundleCourseIds.map((id) => allCourses.find((c) => c.id === id)).filter(Boolean)
    : [];
  const bundleSavings = bundle
    ? bundleChildren.reduce((s, c) => s + (c.price || 0), 0) - course.price
    : 0;
  const earlyBird = isEarlyBirdActive(course);
  const displayPrice = earlyBird ? course.earlyBirdPrice : course.price;

  return (
    <div className={`card-lift flex flex-col rounded-2xl border p-6 shadow-sm ${
      bundle
        ? 'border-gold/40 bg-gradient-to-br from-gold/5 to-indigo/5 dark:from-gold/10 dark:to-indigo/10 dark:border-gold/30'
        : 'border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800'
    }`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge color="indigo">{course.level}</Badge>
            {bundle && <Badge color="gold">📦 คอร์สรวม</Badge>}
            {earlyBird && <Badge color="green">🐦 Early Bird</Badge>}
          </div>
          <h3 className="mt-2 font-display text-xl font-bold text-navy dark:text-white">
            {course.title}
          </h3>
          {(course.startDate || course.endDate) && (
            <div className="mt-1 font-mono text-[11px] text-navy/50 dark:text-slate-400">
              📅 {fmtThaiDate(course.startDate)}{course.endDate ? ` – ${fmtThaiDate(course.endDate)}` : ''}
            </div>
          )}
        </div>
        <div className="text-right">
          {earlyBird ? (
            <>
              <div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {fmtBaht(displayPrice)}
              </div>
              <div className="font-mono text-[11px] text-navy/40 dark:text-slate-500 line-through">
                {fmtBaht(course.price)}
              </div>
              <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                ก่อน {fmtThaiDate(course.earlyBirdUntil)}
              </div>
            </>
          ) : (
            <>
              <div className="font-mono text-lg font-bold text-navy dark:text-white">
                {fmtBaht(course.price)}
              </div>
              <div className="text-xs text-navy/50 dark:text-slate-500">
                {bundle ? 'ราคาแพ็คเกจ' : 'รวม'}
              </div>
            </>
          )}
        </div>
      </div>

      {bundle && bundleChildren.length > 0 && (
        <div className="mb-3 rounded-xl border border-gold/30 bg-white/60 dark:bg-slate-800/60 p-3">
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            ✨ รวมทั้งหมด {bundleChildren.length} วิชา
          </div>
          <ul className="space-y-1 text-xs text-navy/80 dark:text-slate-300">
            {bundleChildren.map((c) => (
              <li key={c.id} className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-600 flex-shrink-0" />
                <span className="truncate">{c.title}</span>
              </li>
            ))}
          </ul>
          {bundleSavings > 0 && (
            <div className="mt-2 font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              ประหยัด {fmtBaht(bundleSavings)}!
            </div>
          )}
        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-1.5">
        {course.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-md bg-indigo/5 dark:bg-indigo/10 px-2 py-0.5 text-[11px] font-medium text-indigo"
          >
            <TagIcon size={11} /> {t}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-navy/70 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-indigo" />
          <span className="font-mono">{course.hours} ชม.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-indigo" />
          <span className="font-mono">
            {totalEnrolled}/{course.slots}
          </span>
        </div>
        <div className="col-span-2 text-xs text-navy/50 dark:text-slate-500">
          ผู้สอน: <span className="text-navy/80 dark:text-slate-300">{course.teacher}</span>
        </div>
        {course.timeSlot && (
          <div className="col-span-2 flex items-center gap-1.5 text-xs text-navy/60 dark:text-slate-400">
            <Calendar size={12} className="text-indigo" />
            <span className="font-mono">{course.timeSlot}</span>
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy/5 dark:bg-slate-700">
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
            ? 'cursor-not-allowed bg-navy/10 dark:bg-slate-700 text-navy/40 dark:text-slate-500'
            : 'bg-navy text-white hover:bg-indigo'
        }`}
      >
        {full ? 'เต็มแล้ว' : 'ลงทะเบียน'}
        {!full && <ChevronRight size={16} />}
      </button>
    </div>
  );
};

const GRADE_ORDER = ['ป.1','ป.2','ป.3','ป.4','ป.5','ป.6','ม.1','ม.2','ม.3','ม.4','ม.5','ม.6'];

const CoursesPage = ({ courses, onRegister, registrations = [] }) => {
  const [grade, setGrade] = useState('ทั้งหมด');
  const [query, setQuery] = useState('');

  const gradeOptions = useMemo(() => {
    const found = new Set();
    for (const c of courses) {
      for (const tag of c.tags) {
        if (GRADE_ORDER.includes(tag)) found.add(tag);
      }
    }
    return ['ทั้งหมด', ...GRADE_ORDER.filter((g) => found.has(g))];
  }, [courses]);

  const enrolledByCourse = useMemo(() => {
    const map = {};
    for (const r of registrations) {
      map[r.courseId] = (map[r.courseId] || 0) + 1;
    }
    return map;
  }, [registrations]);

  const filtered = courses.filter(
    (c) =>
      (grade === 'ทั้งหมด' || c.tags.includes(grade)) &&
      (query.trim() === '' || c.title.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="animate-fade-in">
      <HeroBanner />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Filter bar */}
        <div className="mb-8 rounded-2xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-navy/60 dark:text-slate-400">
              <Filter size={16} /> <span className="text-sm font-semibold">กรอง</span>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40 dark:text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาวิชา..."
                className="w-56 rounded-xl border border-navy/10 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-indigo focus:ring-2 focus:ring-indigo/30"
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {gradeOptions.map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  grade === g
                    ? 'border-indigo bg-indigo text-white shadow'
                    : 'border-navy/10 dark:border-slate-600 bg-white dark:bg-slate-700 text-navy/70 dark:text-slate-300 hover:border-indigo hover:text-indigo'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-navy/15 dark:border-slate-700 bg-white dark:bg-slate-800 p-16 text-center">
            <div className="font-mono text-5xl text-navy/30 dark:text-slate-600">{'(╯°□°）╯'}</div>
            <div className="mt-3 font-display text-2xl text-navy dark:text-white">ไม่พบคอร์ส</div>
            <div className="text-sm text-navy/50 dark:text-slate-500">ลองขยายเงื่อนไขการค้นหา</div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CourseCard key={c.id} course={c} allCourses={courses} onRegister={onRegister} liveEnrolled={enrolledByCourse[c.id] || 0} />
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
const RegisterPage = ({ courses, preselectCourse, onSubmit, setActivePage, currentUser, registrations = [] }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    level: '',
    courseId: preselectCourse?.id || '',
    paymentMethod: '',
    paymentSlip: null,
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const slipRef = useRef(null);

  useEffect(() => {
    if (preselectCourse) {
      setForm((f) => ({ ...f, courseId: preselectCourse.id }));
    }
  }, [preselectCourse]);

  const enrolledByCourse = useMemo(() => {
    const map = {};
    for (const r of registrations) {
      map[r.courseId] = (map[r.courseId] || 0) + 1;
    }
    return map;
  }, [registrations]);

  const selectedCourse = courses.find((c) => c.id === Number(form.courseId));
  const selectedBundleChildren = selectedCourse && isBundleCourse(selectedCourse)
    ? selectedCourse.bundleCourseIds.map((id) => courses.find((c) => c.id === id)).filter(Boolean)
    : [];

  const alreadyRegistered = selectedCourse && registrations.some(
    (r) => r.studentEmail === currentUser?.email &&
           r.courseId === selectedCourse.id &&
           r.status !== 'rejected',
  );

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
      else if (alreadyRegistered) e.courseId = 'คุณลงทะเบียนคอร์สนี้แล้ว';
    }
    if (s === 3) {
      if (!form.paymentMethod) e.paymentMethod = 'กรุณาเลือกวิธีชำระเงิน';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validateStep(step) && setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = () => {
    if (!validateStep(3)) return;
    onSubmit({
      ...form,
      courseId: Number(form.courseId),
      courseTitle: selectedCourse?.title,
      submittedAt: new Date().toISOString(),
    });
    setShowSuccess(true);
  };

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSlipUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await fileToCompressedDataURL(file, 800);
    update('paymentSlip', compressed);
  };

  const StepDot = ({ n, label }) => (
    <div className="flex flex-1 items-center gap-3">
      <div
        className={`grid h-9 w-9 place-items-center rounded-full font-mono font-bold transition ${
          step >= n ? 'bg-navy text-white' : 'bg-navy/10 dark:bg-slate-700 text-navy/50 dark:text-slate-400'
        }`}
      >
        {step > n ? <CheckCircle2 size={18} /> : n}
      </div>
      <div className="hidden text-sm font-semibold text-navy dark:text-white md:block">{label}</div>
      {n < 3 && (
        <div className={`mx-2 hidden h-0.5 flex-1 md:block ${step > n ? 'bg-navy dark:bg-indigo' : 'bg-navy/10 dark:bg-slate-700'}`} />
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-4xl font-bold text-navy dark:text-white">ลงทะเบียนเรียน</h1>
        <p className="mt-2 text-navy/60 dark:text-slate-400">เพียง 3 ขั้นตอนง่ายๆ แล้วคุณก็พร้อมเรียน</p>

        {/* Progress */}
        <div className="mt-8 flex items-center">
          <StepDot n={1} label="ข้อมูลส่วนตัว" />
          <StepDot n={2} label="เลือกคอร์ส" />
          <StepDot n={3} label="ชำระเงิน" />
        </div>

        <div className="mt-8 rounded-3xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm">
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
                  {courses.map((c) => {
                    const live = c.enrolled + (enrolledByCourse[c.id] || 0);
                    const isFull = live >= c.slots;
                    return (
                      <option key={c.id} value={c.id} disabled={isFull}>
                        {c.title} — {fmtBaht(c.price)}{isFull ? ' (เต็มแล้ว)' : ''}
                      </option>
                    );
                  })}
                </select>
              </Field>

              {alreadyRegistered && (
                <div className="rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm font-semibold text-amber-800 dark:text-amber-300">
                  ⚠️ คุณลงทะเบียนคอร์สนี้ไปแล้ว กรุณาเลือกคอร์สอื่น
                </div>
              )}
              {selectedCourse && !alreadyRegistered && (
                <div className="rounded-xl border border-indigo/20 dark:border-indigo/30 bg-indigo/5 dark:bg-indigo/10 p-4 space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-navy dark:text-white">
                    <Calendar size={14} className="text-indigo" />
                    เวลาเรียน: <span className="font-mono">{selectedCourse.timeSlot}</span>
                  </div>
                  <div className="text-xs text-navy/60 dark:text-slate-400">
                    ผู้สอน: {selectedCourse.teacher} · {selectedCourse.hours} ชม. ·{' '}
                    <span className="font-mono font-bold text-gold">{fmtBaht(effectivePrice(selectedCourse))}</span>
                  </div>
                  {selectedBundleChildren.length > 0 && (
                    <div className="mt-2 rounded-lg border border-gold/30 bg-white/60 dark:bg-slate-700/40 p-2">
                      <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-1">
                        📦 รวม {selectedBundleChildren.length} วิชา
                      </div>
                      <ul className="space-y-0.5">
                        {selectedBundleChildren.map((c) => (
                          <li key={c.id} className="flex items-center gap-1 text-xs text-navy dark:text-white">
                            <CheckCircle2 size={11} className="text-emerald-600 flex-shrink-0" />
                            {c.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              {/* Course summary */}
              <div className="rounded-xl border border-navy/10 dark:border-slate-700 bg-navy/[0.02] dark:bg-slate-700/30 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/50 dark:text-slate-500 mb-2">
                  สรุปการลงทะเบียน
                </div>
                <div className="font-semibold text-navy dark:text-white">{selectedCourse?.title}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-navy/60 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} className="text-indigo" />
                    <span className="font-mono">{selectedCourse?.timeSlot}</span>
                  </span>
                  <span>·</span>
                  <span>{form.firstName} {form.lastName}</span>
                  <span>·</span>
                  <span className="font-mono font-bold text-gold">{fmtBaht(effectivePrice(selectedCourse))}</span>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-navy/60 dark:text-slate-400">
                  วิธีชำระเงิน
                </div>
                {errors.paymentMethod && (
                  <div className="mb-2 text-xs font-semibold text-rose-600">{errors.paymentMethod}</div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'transfer', label: '💳 โอนเงิน',  desc: 'โอนเงินผ่านธนาคาร' },
                    { key: 'cash',     label: '💵 จ่ายสด',   desc: 'ชำระ ณ วันเรียนครั้งแรก' },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => update('paymentMethod', m.key)}
                      className={`rounded-xl border p-4 text-left transition ${
                        form.paymentMethod === m.key
                          ? 'border-indigo bg-indigo/5 dark:bg-indigo/10 ring-2 ring-indigo/30'
                          : 'border-navy/10 dark:border-slate-600 hover:border-indigo'
                      }`}
                    >
                      <div className="font-semibold text-navy dark:text-white">{m.label}</div>
                      <div className="mt-0.5 text-xs text-navy/60 dark:text-slate-400">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transfer: bank account + slip upload */}
              {form.paymentMethod === 'transfer' && (
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-4 space-y-3">
                  <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300">ข้อมูลบัญชีธนาคาร</div>
                  <div className="space-y-1 text-sm text-navy dark:text-white">
                    <div>🏦 ธนาคารกสิกรไทย (KBANK)</div>
                    <div className="font-mono font-bold">เลขที่บัญชี: 123-4-56789-0</div>
                    <div>ชื่อบัญชี: นางสาว ทราย ใจดี</div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400">
                      กรุณาโอนเงิน{' '}
                      <span className="font-mono font-bold">{fmtBaht(effectivePrice(selectedCourse))}</span>{' '}
                      แล้วอัปโหลดสลิป
                    </div>
                  </div>
                  <input ref={slipRef} type="file" accept="image/*" className="hidden" onChange={handleSlipUpload} />
                  {form.paymentSlip ? (
                    <div className="flex items-center gap-3">
                      <img src={form.paymentSlip} alt="slip" className="h-20 w-20 rounded-lg object-cover border border-emerald-300" />
                      <div>
                        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">อัปโหลดสลิปแล้ว ✓</div>
                        <button
                          type="button"
                          onClick={() => slipRef.current?.click()}
                          className="mt-1 text-xs text-indigo underline"
                        >
                          เปลี่ยนสลิป
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => slipRef.current?.click()}
                      className="flex items-center gap-2 rounded-lg border border-dashed border-emerald-400 dark:border-emerald-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition"
                    >
                      📎 อัปโหลดสลิปการโอนเงิน
                      <span className="text-xs text-navy/40 dark:text-slate-500">(ไม่จำเป็น)</span>
                    </button>
                  )}
                </div>
              )}

              {/* Cash: confirmation message */}
              {form.paymentMethod === 'cash' && (
                <div className="rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4">
                  <div className="text-sm font-bold text-amber-800 dark:text-amber-300">💵 ชำระเงินสด</div>
                  <div className="mt-1 text-sm text-navy/70 dark:text-slate-300">
                    กรุณาเตรียมเงินสด{' '}
                    <span className="font-mono font-bold">{fmtBaht(effectivePrice(selectedCourse))}</span>{' '}
                    มาชำระ ณ วันเรียนครั้งแรก
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 1}
              className="flex items-center gap-1.5 rounded-xl border border-navy/10 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-navy/70 dark:text-slate-300 transition hover:border-navy hover:text-navy dark:hover:border-slate-400 dark:hover:text-white disabled:opacity-40"
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
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 p-8 text-center shadow-2xl">
            <Confetti />
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-display text-3xl font-bold text-navy dark:text-white">สำเร็จแล้ว! 🎉</h3>
            <p className="mt-2 text-navy/60 dark:text-slate-400">
              การลงทะเบียนสำหรับ <span className="font-semibold text-navy dark:text-white">{selectedCourse?.title}</span> ได้รับการบันทึกแล้ว
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
      <span className="text-xs font-semibold uppercase tracking-wider text-navy/60 dark:text-slate-400">{label}</span>
      {error && <span className="text-xs font-semibold text-rose-600">{error}</span>}
    </div>
    {children}
  </label>
);

const Summary = ({ label, value, mono, highlight }) => (
  <div className="rounded-xl border border-navy/10 dark:border-slate-700 bg-navy/[0.02] dark:bg-slate-700/30 p-4">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/50 dark:text-slate-500">{label}</div>
    <div
      className={`mt-1 font-semibold ${mono ? 'font-mono' : ''} ${
        highlight ? 'text-gold text-xl' : 'text-navy dark:text-white'
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

  // Expand bundle registrations to include all sub-course IDs
  const myCourseIds = new Set();
  myRegs.forEach((r) => {
    const c = courses.find((cc) => cc.id === r.courseId);
    if (isBundleCourse(c)) {
      c.bundleCourseIds.forEach((id) => myCourseIds.add(id));
    } else {
      myCourseIds.add(r.courseId);
    }
  });

  const studentEvents = days.map((d) => {
    return schedule
      .filter((s) => s.day === d)
      .filter((s) => myCourseIds.has(s.courseId))
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
          <h1 className="font-display text-4xl font-bold text-navy dark:text-white">
            {isAdmin ? 'ตารางสอนรวม' : 'ตารางเรียนรายสัปดาห์'}
          </h1>
          <p className="mt-1 text-navy/60 dark:text-slate-400">
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
        <div className="mt-10 rounded-2xl border border-dashed border-navy/15 dark:border-slate-700 bg-white dark:bg-slate-800 p-16 text-center">
          <div className="font-mono text-5xl text-navy/30 dark:text-slate-600">∅</div>
          <div className="mt-3 font-display text-2xl text-navy dark:text-white">ยังไม่มีคลาสเรียน</div>
          <div className="text-sm text-navy/50 dark:text-slate-500">ลงทะเบียนคอร์สเพื่อดูตารางเรียนที่นี่</div>
        </div>
      ) : (
        <div className="mt-8 grid gap-3 md:grid-cols-7">
          {days.map((d, i) => (
            <div
              key={d}
              className="rounded-2xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="font-display text-lg font-bold text-navy dark:text-white">{d}</div>
                <div className="flex items-center gap-1">
                  <Badge color="indigo">{events[i].length}</Badge>
                  {isAdmin && (
                    <button
                      onClick={() => setEditing({ courseId: '', day: d, time: '', room: '' })}
                      className="grid h-6 w-6 place-items-center rounded-full border border-navy/10 dark:border-slate-600 text-navy/60 dark:text-slate-400 transition hover:border-indigo hover:text-indigo"
                      title="เพิ่มรายการ"
                    >
                      <Plus size={12} />
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {events[i].length === 0 && (
                  <div className="rounded-lg border border-dashed border-navy/10 dark:border-slate-700 py-6 text-center text-xs text-navy/40 dark:text-slate-600">
                    ว่าง
                  </div>
                )}
                {events[i].map((ev) => (
                  <div
                    key={ev.id}
                    className={`group relative rounded-xl border border-indigo/20 dark:border-indigo/30 bg-indigo/5 dark:bg-indigo/10 p-3 ${
                      isAdmin ? 'cursor-pointer transition hover:border-indigo' : ''
                    }`}
                    onClick={() => isAdmin && setEditing(ev)}
                  >
                    <div className="text-[11px] font-mono text-indigo">{ev.time || '—'}</div>
                    <div className="mt-0.5 line-clamp-2 text-sm font-semibold text-navy dark:text-white">
                      {ev.course?.title || '⚠ ไม่พบคอร์ส'}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-navy/60 dark:text-slate-400">
                      <span>{ev.course?.teacher}</span>
                      <span className="font-mono">📍 {ev.room}</span>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEntry(ev.id);
                        }}
                        className="absolute right-1.5 top-1.5 hidden rounded-md border border-rose-200 bg-white dark:bg-slate-800 p-1 text-rose-600 hover:bg-rose-50 group-hover:block"
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

      {/* Student: my registrations status panel */}
      {!isAdmin && myRegs.length > 0 && (
        <div className="mt-8 rounded-2xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-navy dark:text-white">การลงทะเบียนของฉัน</h2>
          <p className="mt-0.5 text-sm text-navy/60 dark:text-slate-400">สถานะและการชำระเงินของแต่ละคอร์ส</p>
          <div className="mt-4 space-y-3">
            {myRegs.map((r) => {
              const course = courses.find((c) => c.id === r.courseId);
              const statusClr = r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'gold';
              const statusTh = { approved: 'อนุมัติแล้ว', rejected: 'ปฏิเสธ', pending: 'รอดำเนินการ' }[r.status] || 'รอดำเนินการ';
              const payTh = r.paymentMethod === 'transfer' ? '💳 โอนเงิน' : r.paymentMethod === 'cash' ? '💵 จ่ายสด' : '⏳ ยังไม่ชำระ';
              const payClr = r.paymentMethod === 'transfer' ? 'text-emerald-600 dark:text-emerald-400' : r.paymentMethod === 'cash' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-500 dark:text-rose-400';
              return (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/10 dark:border-slate-700 bg-navy/[0.02] dark:bg-slate-700/30 px-4 py-3">
                  <div>
                    <div className="font-semibold text-navy dark:text-white">{course?.title || r.courseTitle}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-navy/50 dark:text-slate-400">
                      {course?.timeSlot && <><Calendar size={10} className="text-indigo" /><span className="font-mono">{course.timeSlot}</span><span className="mx-1">·</span></>}
                      <span className="font-mono">{fmtThaiDate(r.submittedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${payClr}`}>{payTh}</span>
                    <Badge color={statusClr}>{statusTh}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
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
        <div className="mt-10 rounded-2xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-navy dark:text-white">ภาพรวมการลงทะเบียน</h2>
          <p className="text-sm text-navy/60 dark:text-slate-400">จำนวนผู้ลงทะเบียนในแต่ละคอร์ส</p>
          <div className="mt-5 space-y-4">
            {courses.map((c) => {
              const liveEnrolled =
                c.enrolled + registrations.filter((r) => r.courseId === c.id).length;
              const pct = Math.min(100, Math.round((liveEnrolled / c.slots) * 100));
              return (
                <div key={c.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div className="font-semibold text-navy dark:text-white">{c.title}</div>
                    <div className="font-mono text-navy/70 dark:text-slate-400">
                      {liveEnrolled}/{c.slots}
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-navy/5 dark:bg-slate-700">
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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/40 backdrop-blur-sm p-4 pt-16">
      <div className="w-full max-w-lg flex flex-col rounded-3xl bg-white dark:bg-slate-800 shadow-2xl">
        {/* sticky header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 pt-6 pb-4 border-b border-navy/10 dark:border-slate-700">
          <h3 className="font-display text-2xl font-bold text-navy dark:text-white">
            {isNew ? 'เพิ่มรายการตารางสอน' : 'แก้ไขรายการตารางสอน'}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-navy/60 dark:text-slate-400 hover:bg-navy/5 dark:hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>

        {/* scrollable body */}
        <div className="max-h-[55vh] overflow-y-auto px-6 py-4 space-y-4">
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

        {/* sticky footer */}
        <div className="flex-shrink-0 flex justify-end gap-2 px-6 pb-6 pt-4 border-t border-navy/10 dark:border-slate-700">
          <button
            onClick={onClose}
            className="rounded-xl border border-navy/10 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-navy/70 dark:text-slate-300 hover:border-navy hover:text-navy dark:hover:border-slate-400 dark:hover:text-white"
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
  timeSlot: '',
  bundleCourseIds: [],
  startDate: '',
  endDate: '',
  earlyBirdPrice: '',
  earlyBirdUntil: '',
};

const isBundleCourse = (course) =>
  Array.isArray(course?.bundleCourseIds) && course.bundleCourseIds.length > 0;

const AdminDashboard = ({ courses, setCourses, registrations, users = [] }) => {
  const [editing, setEditing] = useState(null);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const getNickname = (email) => users.find((u) => u.email === email)?.nickname || '';

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
      bundleCourseIds: Array.isArray(draft.bundleCourseIds)
        ? draft.bundleCourseIds.map(Number).filter((n) => !Number.isNaN(n))
        : [],
      startDate: draft.startDate || '',
      endDate: draft.endDate || '',
      earlyBirdPrice: draft.earlyBirdPrice === '' || draft.earlyBirdPrice == null
        ? ''
        : Number(draft.earlyBirdPrice),
      earlyBirdUntil: draft.earlyBirdUntil || '',
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
          <h1 className="font-display text-4xl font-bold text-navy dark:text-white">แผงควบคุมผู้ดูแล</h1>
          <p className="mt-1 text-navy/60 dark:text-slate-400">จัดการรายการคอร์สของสถาบัน</p>
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

      <div className="mt-8 overflow-hidden rounded-2xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy/[0.03] dark:bg-slate-700/50 text-navy/60 dark:text-slate-400">
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
            <tbody className="divide-y divide-navy/5 dark:divide-slate-700">
              {courses.map((c) => {
                const courseRegs = registrations.filter((r) => r.courseId === c.id);
                const live = c.enrolled + courseRegs.length;
                const isExpanded = expandedCourseId === c.id;
                return (
                  <React.Fragment key={c.id}>
                    <tr className="hover:bg-indigo/[0.03] dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-navy dark:text-white">{c.title}</span>
                          {isBundleCourse(c) && (
                            <span className="rounded-md bg-gold/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                              📦 รวม {c.bundleCourseIds.length} วิชา
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          {c.tags.map((t) => (
                            <span key={t} className="text-[10px] font-medium text-indigo">#{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge>{c.level}</Badge></td>
                      <td className="px-4 py-3 text-navy/80 dark:text-slate-300">{c.teacher}</td>
                      <td className="px-4 py-3 font-mono text-navy/70 dark:text-slate-400">{c.hours} ชม.</td>
                      <td className="px-4 py-3 font-mono font-semibold text-navy dark:text-white">{fmtBaht(c.price)}</td>
                      <td className="px-4 py-3 font-mono">
                        <button
                          onClick={() => setExpandedCourseId(isExpanded ? null : c.id)}
                          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition ${
                            live > 0
                              ? live >= c.slots
                                ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:bg-rose-100'
                                : 'bg-indigo/10 dark:bg-indigo/20 text-indigo hover:bg-indigo/20'
                              : 'text-navy/50 dark:text-slate-500 cursor-default'
                          }`}
                          disabled={live === 0}
                        >
                          <Users size={11} />
                          {live}/{c.slots}
                          {live > 0 && (
                            <ChevronRight size={11} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setEditing({ ...c, tags: c.tags.join(', ') })}
                            className="rounded-lg border border-navy/10 dark:border-slate-600 p-1.5 text-navy/70 dark:text-slate-400 hover:border-indigo hover:text-indigo"
                            title="แก้ไข"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => remove(c.id)}
                            className="rounded-lg border border-navy/10 dark:border-slate-600 p-1.5 text-navy/70 dark:text-slate-400 hover:border-rose-300 hover:text-rose-600"
                            title="ลบ"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && courseRegs.length > 0 && (
                      <tr className="bg-indigo/[0.02] dark:bg-slate-700/20">
                        <td colSpan={7} className="px-4 py-3">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50 dark:text-slate-400 mb-2">
                            นักเรียนที่ลงทะเบียน ({courseRegs.length} คน)
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {courseRegs.map((r) => (
                              <div
                                key={r.id}
                                className="flex items-center gap-1.5 rounded-lg border border-navy/10 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs"
                              >
                                <div>
                                  <div className="font-semibold text-navy dark:text-white">
                                    {r.firstName} {r.lastName}
                                    {getNickname(r.studentEmail) && (
                                      <span className="ml-1 rounded-full bg-indigo/10 dark:bg-indigo/20 px-1.5 py-0.5 text-[10px] font-medium text-indigo">
                                        {getNickname(r.studentEmail)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-navy/50 dark:text-slate-400 font-mono">{r.phone}</div>
                                </div>
                                <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                                  r.status === 'approved'
                                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                    : r.status === 'rejected'
                                    ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300'
                                    : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                                }`}>
                                  {r.status === 'approved' ? 'อนุมัติ' : r.status === 'rejected' ? 'ปฏิเสธ' : 'รอ'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <CourseEditor
          draft={editing}
          allCourses={courses}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={saveDraft}
        />
      )}
    </div>
  );
};

const Stat = ({ label, value, icon: Icon, mono }) => (
  <div className="rounded-2xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="text-xs font-semibold uppercase tracking-wider text-navy/50 dark:text-slate-400">{label}</div>
      <Icon size={16} className="text-indigo" />
    </div>
    <div className={`mt-2 text-2xl font-bold text-navy dark:text-white ${mono ? 'font-mono' : 'font-display'}`}>
      {value}
    </div>
  </div>
);

const CourseEditor = ({ draft, allCourses = [], onChange, onClose, onSave }) => {
  const upd = (k, v) => onChange({ ...draft, [k]: v });
  const isNew = !draft.id;
  const bundleIds = Array.isArray(draft.bundleCourseIds) ? draft.bundleCourseIds.map(Number) : [];
  const [showBundle, setShowBundle] = useState(bundleIds.length > 0);
  const toggleBundleCourse = (id) => {
    const has = bundleIds.includes(id);
    upd('bundleCourseIds', has ? bundleIds.filter((x) => x !== id) : [...bundleIds, id]);
  };
  const handleBundleToggle = (on) => {
    setShowBundle(on);
    if (!on) upd('bundleCourseIds', []);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/40 backdrop-blur-sm p-4 pt-16">
      <div className="w-full max-w-2xl flex flex-col rounded-3xl bg-white dark:bg-slate-800 shadow-2xl">
        {/* sticky header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 pt-6 pb-4 border-b border-navy/10 dark:border-slate-700">
          <h3 className="font-display text-2xl font-bold text-navy dark:text-white">
            {isNew ? 'เพิ่มคอร์สใหม่' : 'แก้ไขคอร์ส'}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-navy/60 dark:text-slate-400 hover:bg-navy/5 dark:hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>
        {/* scrollable body */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
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
          <Field label="เวลาเรียน (timeSlot)">
            <input className="input font-mono" placeholder="เช่น ส. 09:00–12:00" value={draft.timeSlot || ''} onChange={(e) => upd('timeSlot', e.target.value)} />
          </Field>
        </div>

        {/* Date range + early bird (optional) */}
        <div className="mt-6 rounded-2xl border border-navy/10 dark:border-slate-700 bg-navy/[0.02] dark:bg-slate-700/30 p-4">
          <div className="mb-3 text-sm font-bold text-navy dark:text-white">
            🗓️ ช่วงวันที่ + Early Bird <span className="text-xs font-normal text-navy/50 dark:text-slate-400">(ไม่จำเป็นต้องกรอก)</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="วันเริ่มคอร์ส">
              <input type="date" className="input font-mono" value={draft.startDate || ''} onChange={(e) => upd('startDate', e.target.value)} />
            </Field>
            <Field label="วันจบคอร์ส">
              <input type="date" className="input font-mono" value={draft.endDate || ''} onChange={(e) => upd('endDate', e.target.value)} />
            </Field>
            <Field label="ราคา Early Bird (฿)">
              <input type="number" className="input font-mono" placeholder="ปล่อยว่างถ้าไม่มี" value={draft.earlyBirdPrice ?? ''} onChange={(e) => upd('earlyBirdPrice', e.target.value)} />
            </Field>
            <Field label="Early Bird สิ้นสุดวันที่">
              <input type="date" className="input font-mono" value={draft.earlyBirdUntil || ''} onChange={(e) => upd('earlyBirdUntil', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Bundle (package) selection */}
        <div className="mt-6 rounded-2xl border border-indigo/20 dark:border-indigo/30 bg-indigo/5 dark:bg-indigo/10 p-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={showBundle}
              onChange={(e) => handleBundleToggle(e.target.checked)}
              className="accent-indigo"
            />
            <div>
              <div className="text-sm font-bold text-navy dark:text-white flex items-center gap-1.5">
                📦 ทำเป็นคอร์สรวม (Bundle)
                {showBundle && bundleIds.length > 0 && <Badge color="indigo">{bundleIds.length} วิชา</Badge>}
              </div>
              <div className="text-xs text-navy/60 dark:text-slate-400">
                นักเรียนจ่ายราคาเดียว เรียนได้หลายวิชาตามที่เลือก
              </div>
            </div>
          </label>

          {showBundle && (
            <div className="mt-3">
              {allCourses.filter((c) => c.id !== draft.id && !isBundleCourse(c)).length === 0 ? (
                <div className="rounded-lg border border-dashed border-navy/15 dark:border-slate-600 p-3 text-center text-xs text-navy/50 dark:text-slate-500">
                  ยังไม่มีคอร์สปกติในระบบ ลองเพิ่มคอร์สอื่นก่อน
                </div>
              ) : (
                <div className="grid gap-1.5 md:grid-cols-2">
                  {allCourses
                    .filter((c) => c.id !== draft.id && !isBundleCourse(c))
                    .map((c) => {
                      const checked = bundleIds.includes(c.id);
                      return (
                        <label
                          key={c.id}
                          className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2 text-xs transition ${
                            checked
                              ? 'border-indigo bg-indigo/10 dark:bg-indigo/20'
                              : 'border-navy/10 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-indigo'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleBundleCourse(c.id)}
                            className="mt-0.5 accent-indigo"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-navy dark:text-white">{c.title}</div>
                            <div className="font-mono text-[10px] text-navy/50 dark:text-slate-400">
                              {c.teacher} · {fmtBaht(c.price)}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>

        </div>{/* end scrollable body */}
        {/* sticky footer */}
        <div className="flex-shrink-0 flex justify-end gap-2 px-6 pb-6 pt-4 border-t border-navy/10 dark:border-slate-700">
          <button onClick={onClose} className="rounded-xl border border-navy/10 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-navy/70 dark:text-slate-300 hover:border-navy hover:text-navy dark:hover:text-white">
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
 * Profile Page (student)
 * ───────────────────────────────────────────────────────────────────── */
const GRADE_LEVELS = [
  'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6',
  'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6',
  'ปวช.', 'ปวส.', 'ปริญญาตรี', 'อื่นๆ',
];

// Compress an image file to a base64 data URL (max 256px, JPEG quality 0.85)
async function fileToCompressedDataURL(file, maxSize = 256) {
  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
  const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.85);
}

const ProfilePage = ({ currentUser, setCurrentUser, users, setUsers }) => {
  const initial = users.find((u) => u.email === currentUser.email) || currentUser;
  const [name, setName] = useState(initial.name || '');
  const [nickname, setNickname] = useState(initial.nickname || '');
  const [gradeLevel, setGradeLevel] = useState(initial.gradeLevel || '');
  const [avatar, setAvatar] = useState(initial.avatar || '');
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const isDemoAccount = !users.find((u) => u.email === currentUser.email);

  const handleFile = async (e) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('กรุณาเลือกไฟล์รูปภาพ');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('ไฟล์ใหญ่เกิน 5 MB');
      return;
    }
    setUploading(true);
    try {
      const compressed = await fileToCompressedDataURL(file, 256);
      setAvatar(compressed);
    } catch {
      setError('ไม่สามารถประมวลผลรูปได้');
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = () => setAvatar('');

  const save = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('กรุณากรอกชื่อ-นามสกุล');
      return;
    }

    const updates = {
      name: name.trim(),
      nickname: nickname.trim(),
      gradeLevel,
      avatar,
    };

    if (!isDemoAccount) {
      setUsers((us) =>
        us.map((u) => (u.email === currentUser.email ? { ...u, ...updates } : u)),
      );
    }
    setCurrentUser((u) => ({ ...u, ...updates }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-3xl animate-fade-in px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-navy dark:text-white">โปรไฟล์ของฉัน</h1>
      <p className="mt-1 text-navy/60 dark:text-slate-400">จัดการข้อมูลส่วนตัวและรูปโปรไฟล์</p>

      <form onSubmit={save} className="mt-8 rounded-3xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm">
        {/* Avatar uploader */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt="avatar"
                className="h-32 w-32 rounded-full border-4 border-indigo/20 object-cover shadow-lg"
              />
            ) : (
              <div className="grid h-32 w-32 place-items-center rounded-full border-4 border-dashed border-navy/15 dark:border-slate-600 bg-navy/[0.02] dark:bg-slate-700/30 text-navy/30 dark:text-slate-600">
                <User size={48} />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-full bg-navy text-white shadow-lg ring-4 ring-white dark:ring-slate-800 transition hover:bg-indigo disabled:opacity-60"
              title="อัปโหลดรูป"
            >
              <Camera size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg border border-navy/10 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-navy/70 dark:text-slate-300 hover:border-indigo hover:text-indigo disabled:opacity-60"
            >
              {uploading ? 'กำลังประมวลผล...' : avatar ? 'เปลี่ยนรูป' : 'อัปโหลดรูป'}
            </button>
            {avatar && (
              <button
                type="button"
                onClick={removeAvatar}
                className="rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-900/30 dark:border-rose-700 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100"
              >
                ลบรูป
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <p className="text-xs text-navy/40 dark:text-slate-500">รองรับ JPG, PNG, WebP ไม่เกิน 5 MB</p>
        </div>

        {/* Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="ชื่อ-นามสกุล">
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="สมชาย ใจดี"
              required
            />
          </Field>
          <Field label="ชื่อเล่น">
            <input
              className="input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="ชาย"
            />
          </Field>
          <Field label="ระดับชั้น">
            <select
              className="input"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
            >
              <option value="">เลือกระดับชั้น...</option>
              {GRADE_LEVELS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="อีเมล">
            <input
              className="input font-mono"
              value={currentUser.email}
              disabled
            />
          </Field>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-200 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/30 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {saved && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 size={16} /> บันทึกข้อมูลเรียบร้อย
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-navy px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
 * Admin → Manage Accounts
 * ───────────────────────────────────────────────────────────────────── */
const AdminAccountsPage = ({ users, setUsers, currentUser, setCurrentUser }) => {
  const adminCount = users.filter((u) => u.role === 'admin').length;

  const promote = (email) => {
    setUsers((us) => us.map((u) => u.email === email ? { ...u, role: 'admin' } : u));
    if (currentUser.email === email) setCurrentUser((u) => ({ ...u, role: 'admin' }));
  };

  const demote = (email) => {
    if (adminCount <= 1 && users.find((u) => u.email === email)?.role === 'admin') {
      alert('ไม่สามารถลดตำแหน่งได้ — ต้องมีผู้ดูแลอย่างน้อย 1 คน');
      return;
    }
    setUsers((us) => us.map((u) => u.email === email ? { ...u, role: 'student' } : u));
    if (currentUser.email === email) setCurrentUser((u) => ({ ...u, role: 'student' }));
  };

  return (
    <div className="mx-auto max-w-5xl animate-fade-in px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-navy dark:text-white">จัดการบัญชีผู้ใช้</h1>
      <p className="mt-1 text-navy/60 dark:text-slate-400">เลื่อนตำแหน่งหรือลดตำแหน่งบัญชีสมาชิกในระบบ</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        {users.length === 0 ? (
          <div className="p-16 text-center">
            <div className="font-mono text-5xl text-navy/30 dark:text-slate-600">∅</div>
            <div className="mt-3 font-display text-2xl text-navy dark:text-white">ยังไม่มีสมาชิกในระบบ</div>
            <div className="mt-1 text-sm text-navy/50 dark:text-slate-500">เมื่อมีผู้สมัครสมาชิกจะปรากฏที่นี่</div>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-navy/[0.03] dark:bg-slate-700/50 text-navy/60 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">ชื่อ-นามสกุล</th>
                <th className="px-4 py-3 font-semibold">อีเมล</th>
                <th className="px-4 py-3 font-semibold">บทบาท</th>
                <th className="px-4 py-3 font-semibold">วันที่สมัคร</th>
                <th className="px-4 py-3 font-semibold text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5 dark:divide-slate-700">
              {users.map((u) => {
                const isMe = u.email === currentUser.email;
                const isAdmin = u.role === 'admin';
                return (
                  <tr key={u.email} className="hover:bg-indigo/[0.03] dark:hover:bg-slate-700/30">
                    <td className="px-4 py-3 font-semibold text-navy dark:text-white">
                      {u.name}
                      {isMe && (
                        <span className="ml-2 text-[11px] font-normal text-navy/40 dark:text-slate-500">(คุณ)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-navy/70 dark:text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge color={isAdmin ? 'gold' : 'indigo'}>
                        {isAdmin ? '🛡 ผู้ดูแล' : '🎓 นักเรียน'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-navy/50 dark:text-slate-500">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString('th-TH', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isAdmin ? (
                        <button
                          onClick={() => demote(u.email)}
                          className="rounded-lg border border-navy/10 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1 text-xs font-semibold text-navy/70 dark:text-slate-300 hover:border-rose-300 hover:text-rose-600"
                        >
                          ลดเป็นนักเรียน
                        </button>
                      ) : (
                        <button
                          onClick={() => promote(u.email)}
                          className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-gold/20"
                        >
                          🛡 เลื่อนเป็น Admin
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-indigo/20 bg-indigo/5 dark:bg-indigo/10 dark:border-indigo/20 px-4 py-3 text-sm text-navy/70 dark:text-slate-300">
        💡 บัญชีทดสอบ <span className="font-mono">admin@math.com</span> และ <span className="font-mono">student@math.com</span> ไม่ปรากฏในรายการนี้ — จัดการได้เฉพาะบัญชีที่สมัครผ่านหน้าเว็บ
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
 * Admin → Registered Users
 * ───────────────────────────────────────────────────────────────────── */
const statusLabel = { pending: 'รอดำเนินการ', approved: 'อนุมัติแล้ว', rejected: 'ปฏิเสธ' };

const AdminUsersPage = ({ registrations, courses, setRegistrations, users = [] }) => {
  const [viewMode, setViewMode] = useState('by-student');
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [slipModal, setSlipModal] = useState(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());

  const getNickname = (email) => users.find((u) => u.email === email)?.nickname || '';

  const approve = (id) =>
    setRegistrations((rs) => rs.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)));
  const reject = (id) =>
    setRegistrations((rs) => rs.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)));

  const byCourse = useMemo(() => {
    const map = {};
    for (const r of registrations) {
      if (!map[r.courseId]) map[r.courseId] = [];
      map[r.courseId].push(r);
    }
    return map;
  }, [registrations]);

  const coursesWithRegs = useMemo(
    () =>
      courses
        .filter((c) => byCourse[c.id]?.length > 0)
        .sort((a, b) => (byCourse[b.id]?.length || 0) - (byCourse[a.id]?.length || 0)),
    [courses, byCourse],
  );

  const matchesPayment = (r) => {
    if (paymentFilter === 'all') return true;
    if (paymentFilter === 'transfer') return r.paymentMethod === 'transfer';
    if (paymentFilter === 'cash') return r.paymentMethod === 'cash';
    if (paymentFilter === 'none') return !r.paymentMethod;
    return true;
  };

  const filteredRegsFor = (courseId) => {
    const regs = byCourse[courseId] || [];
    return regs.filter((r) => {
      const statusOk = statusFilter === 'all' || r.status === statusFilter;
      return statusOk && matchesPayment(r);
    });
  };

  const statusColor = { pending: 'gold', approved: 'green', rejected: 'red' };

  const PaymentBadge = ({ r }) => {
    if (!r.paymentMethod) {
      return <Badge color="red">ยังไม่ชำระ</Badge>;
    }
    return (
      <div className="flex items-center gap-1.5">
        <Badge color={r.paymentMethod === 'transfer' ? 'green' : 'gold'}>
          {r.paymentMethod === 'transfer' ? 'โอนเงิน' : 'จ่ายสด'}
        </Badge>
        {r.paymentSlip && (
          <button
            onClick={() => setSlipModal(r.paymentSlip)}
            className="rounded-md bg-indigo/10 px-2 py-0.5 text-xs font-semibold text-indigo hover:bg-indigo/20 transition"
          >
            ดูสลิป
          </button>
        )}
      </div>
    );
  };

  const ActionBtns = ({ r }) => (
    <div className="flex justify-end gap-1">
      <button
        onClick={() => approve(r.id)}
        className="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-700 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
      >
        อนุมัติ
      </button>
      <button
        onClick={() => reject(r.id)}
        className="rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-900/30 dark:border-rose-700 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100"
      >
        ปฏิเสธ
      </button>
    </div>
  );

  const filteredFlat = registrations.filter((r) => {
    const statusOk = statusFilter === 'all' || r.status === statusFilter;
    const searchOk = search.trim() === '' ||
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search) ||
      r.studentEmail?.toLowerCase().includes(search.toLowerCase());
    return statusOk && matchesPayment(r) && searchOk;
  });

  const bulkApprove = () => {
    setRegistrations((rs) => rs.map((r) => selected.has(r.id) ? { ...r, status: 'approved' } : r));
    setSelected(new Set());
  };
  const bulkReject = () => {
    setRegistrations((rs) => rs.map((r) => selected.has(r.id) ? { ...r, status: 'rejected' } : r));
    setSelected(new Set());
  };
  const toggleSelect = (id) => setSelected((s) => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const toggleSelectAll = () => {
    if (selected.size === filteredFlat.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredFlat.map((r) => r.id)));
    }
  };

  return (
    <div className="mx-auto max-w-7xl animate-fade-in px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-navy dark:text-white">ผู้ลงทะเบียน</h1>
      <p className="mt-1 text-navy/60 dark:text-slate-400">ตรวจสอบและอนุมัติการลงทะเบียน</p>

      {/* Search bar */}
      <div className="mt-6 relative w-full max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40 dark:text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อ, เบอร์, อีเมล..."
          className="w-full rounded-xl border border-navy/10 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-indigo focus:ring-2 focus:ring-indigo/30"
        />
      </div>

      {/* View tabs */}
      <div className="mt-4 flex w-fit gap-1 rounded-xl border border-navy/10 dark:border-slate-700 bg-navy/5 dark:bg-slate-800 p-1">
        {[
          { key: 'by-student', label: 'รายบุคคล' },
          { key: 'by-course',  label: 'รายคอร์ส' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setViewMode(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              viewMode === tab.key
                ? 'bg-navy text-white shadow dark:bg-indigo'
                : 'text-navy/60 hover:text-navy dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Shared filter chips */}
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-navy/50 dark:text-slate-500">สถานะ:</span>
          {[
            { key: 'all',      label: 'ทั้งหมด' },
            { key: 'approved', label: 'อนุมัติแล้ว' },
            { key: 'pending',  label: 'รอดำเนินการ' },
            { key: 'rejected', label: 'ปฏิเสธ' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                statusFilter === f.key
                  ? 'border-indigo bg-indigo text-white'
                  : 'border-navy/10 dark:border-slate-600 text-navy/60 dark:text-slate-400 hover:bg-navy/5 dark:hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-navy/50 dark:text-slate-500">การชำระ:</span>
          {[
            { key: 'all',      label: 'ทั้งหมด' },
            { key: 'transfer', label: 'โอนเงิน' },
            { key: 'cash',     label: 'จ่ายสด' },
            { key: 'none',     label: 'ยังไม่ชำระ' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setPaymentFilter(f.key)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                paymentFilter === f.key
                  ? 'border-indigo bg-indigo text-white'
                  : 'border-navy/10 dark:border-slate-600 text-navy/60 dark:text-slate-400 hover:bg-navy/5 dark:hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── รายบุคคล ── */}
      {viewMode === 'by-student' && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          {/* Bulk action toolbar */}
          {selected.size > 0 && (
            <div className="flex items-center gap-3 border-b border-navy/10 dark:border-slate-700 bg-indigo/5 dark:bg-indigo/10 px-4 py-2.5">
              <span className="text-sm font-semibold text-indigo">เลือก {selected.size} รายการ</span>
              <button
                onClick={bulkApprove}
                className="rounded-lg border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
              >
                อนุมัติทั้งหมด
              </button>
              <button
                onClick={bulkReject}
                className="rounded-lg border border-rose-200 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/30 px-3 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100"
              >
                ปฏิเสธทั้งหมด
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="ml-auto text-xs text-navy/50 dark:text-slate-500 hover:text-navy dark:hover:text-white"
              >
                ล้างการเลือก
              </button>
            </div>
          )}
          {filteredFlat.length === 0 ? (
            <div className="p-16 text-center">
              <div className="font-mono text-5xl text-navy/30 dark:text-slate-600">∅</div>
              <div className="mt-3 font-display text-2xl text-navy dark:text-white">ยังไม่มีการลงทะเบียน</div>
            </div>
          ) : (
            <div className="thin-scroll overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy/[0.03] dark:bg-slate-700/50 text-navy/60 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.size === filteredFlat.length && filteredFlat.length > 0}
                        onChange={toggleSelectAll}
                        className="accent-indigo"
                      />
                    </th>
                    <th className="px-4 py-3 font-semibold">นักเรียน</th>
                    <th className="px-4 py-3 font-semibold">เบอร์โทร</th>
                    <th className="px-4 py-3 font-semibold">ระดับ</th>
                    <th className="px-4 py-3 font-semibold">คอร์ส</th>
                    <th className="px-4 py-3 font-semibold">การชำระ</th>
                    <th className="px-4 py-3 font-semibold">สถานะ</th>
                    <th className="px-4 py-3 font-semibold text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/5 dark:divide-slate-700">
                  {filteredFlat.map((r) => {
                    const course = courses.find((c) => c.id === r.courseId);
                    return (
                      <tr key={r.id} className={`hover:bg-indigo/[0.03] dark:hover:bg-slate-700/30 ${selected.has(r.id) ? 'bg-indigo/5 dark:bg-indigo/10' : ''}`}>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected.has(r.id)}
                            onChange={() => toggleSelect(r.id)}
                            className="accent-indigo"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-navy dark:text-white">
                            {r.firstName} {r.lastName}
                            {getNickname(r.studentEmail) && (
                              <span className="ml-1.5 rounded-full bg-indigo/10 dark:bg-indigo/20 px-2 py-0.5 text-xs font-medium text-indigo">
                                {getNickname(r.studentEmail)}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-navy/40 dark:text-slate-500">{r.studentEmail}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-navy/70 dark:text-slate-400">{r.phone}</td>
                        <td className="px-4 py-3"><Badge>{r.level}</Badge></td>
                        <td className="px-4 py-3 text-navy/80 dark:text-slate-300">{course?.title || '—'}</td>
                        <td className="px-4 py-3"><PaymentBadge r={r} /></td>
                        <td className="px-4 py-3">
                          <Badge color={r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'gold'}>
                            {statusLabel[r.status] || statusLabel.pending}
                          </Badge>
                        </td>
                        <td className="px-4 py-3"><ActionBtns r={r} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── รายคอร์ส ── */}
      {viewMode === 'by-course' && (
        <div className="mt-6 space-y-3">
          {coursesWithRegs.length === 0 ? (
            <div className="rounded-2xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 p-16 text-center shadow-sm">
              <div className="font-mono text-5xl text-navy/30 dark:text-slate-600">∅</div>
              <div className="mt-3 font-display text-2xl text-navy dark:text-white">ยังไม่มีการลงทะเบียน</div>
            </div>
          ) : (
            coursesWithRegs.map((course) => {
              const allRegs = byCourse[course.id] || [];
              const filtered = filteredRegsFor(course.id);
              const approvedCount = allRegs.filter((r) => r.status === 'approved').length;
              const pendingCount  = allRegs.filter((r) => r.status === 'pending').length;
              const isExpanded = expandedCourseId === course.id;

              if ((statusFilter !== 'all' || paymentFilter !== 'all') && filtered.length === 0) return null;

              return (
                <div key={course.id} className="overflow-hidden rounded-2xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                  {/* Course header — click to expand */}
                  <button
                    onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                    className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-indigo/[0.03] dark:hover:bg-slate-700/30"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy/5 dark:bg-slate-700">
                        <GraduationCap size={20} className="text-indigo" />
                      </div>
                      <div>
                        <div className="font-semibold text-navy dark:text-white">{course.title}</div>
                        <div className="mt-0.5 text-xs text-navy/50 dark:text-slate-400">
                          {course.level} · {course.teacher}
                          {course.timeSlot && <span className="ml-2 font-mono">{course.timeSlot}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Badge color="green">{approvedCount} อนุมัติ</Badge>
                        {pendingCount > 0 && <Badge color="gold">{pendingCount} รอ</Badge>}
                        <Badge color="navy">{allRegs.length} คน</Badge>
                      </div>
                      <ChevronRight
                        size={18}
                        className={`text-navy/40 dark:text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </button>

                  {/* Expanded student list */}
                  {isExpanded && (
                    <div className="border-t border-navy/5 dark:border-slate-700">
                      {filtered.length === 0 ? (
                        <div className="px-6 py-4 text-sm text-navy/40 dark:text-slate-500">
                          ไม่มีข้อมูลตามตัวกรองที่เลือก
                        </div>
                      ) : (
                        <div className="thin-scroll overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-navy/[0.03] dark:bg-slate-700/50 text-xs text-navy/60 dark:text-slate-400">
                              <tr>
                                <th className="px-6 py-2.5 font-semibold">นักเรียน</th>
                                <th className="px-4 py-2.5 font-semibold">เบอร์โทร</th>
                                <th className="px-4 py-2.5 font-semibold">ระดับ</th>
                                <th className="px-4 py-2.5 font-semibold">วันที่สมัคร</th>
                                <th className="px-4 py-2.5 font-semibold">การชำระ</th>
                                <th className="px-4 py-2.5 font-semibold">สถานะ</th>
                                <th className="px-4 py-2.5 font-semibold text-right">จัดการ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-navy/5 dark:divide-slate-700">
                              {filtered.map((r) => (
                                <tr key={r.id} className="hover:bg-indigo/[0.03] dark:hover:bg-slate-700/30">
                                  <td className="px-6 py-3">
                                    <div className="font-semibold text-navy dark:text-white">
                                      {r.firstName} {r.lastName}
                                      {getNickname(r.studentEmail) && (
                                        <span className="ml-1.5 rounded-full bg-indigo/10 dark:bg-indigo/20 px-2 py-0.5 text-xs font-medium text-indigo">
                                          {getNickname(r.studentEmail)}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-navy/50 dark:text-slate-400">{r.studentEmail}</div>
                                  </td>
                                  <td className="px-4 py-3 font-mono text-navy/70 dark:text-slate-400">{r.phone}</td>
                                  <td className="px-4 py-3"><Badge>{r.level}</Badge></td>
                                  <td className="px-4 py-3 text-navy/60 dark:text-slate-400">{fmtThaiDate(r.submittedAt)}</td>
                                  <td className="px-4 py-3"><PaymentBadge r={r} /></td>
                                  <td className="px-4 py-3">
                                    <Badge color={statusColor[r.status] || 'gold'}>
                                      {statusLabel[r.status] || statusLabel.pending}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3"><ActionBtns r={r} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Slip preview modal */}
      {slipModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-navy/60 backdrop-blur-sm"
          onClick={() => setSlipModal(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-sm rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold text-navy dark:text-white">สลิปการโอนเงิน</div>
              <button
                onClick={() => setSlipModal(null)}
                className="rounded-lg p-1.5 text-navy/60 hover:bg-navy/5 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <X size={18} />
              </button>
            </div>
            <img src={slipModal} alt="payment slip" className="w-full rounded-xl object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
 * SemesterEditor modal
 * ───────────────────────────────────────────────────────────────────── */
const SemesterEditor = ({ draft, courses, onChange, onClose, onSave }) => {
  const upd = (k, v) => onChange({ ...draft, [k]: v });
  const isNew = !draft.id;
  const courseIds = Array.isArray(draft.courseIds) ? draft.courseIds.map(Number) : [];
  const toggleCourse = (id) => {
    const has = courseIds.includes(id);
    upd('courseIds', has ? courseIds.filter((x) => x !== id) : [...courseIds, id]);
  };
  const valid = draft.name && draft.name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/40 backdrop-blur-sm p-4 pt-16">
      <div className="w-full max-w-2xl flex flex-col rounded-3xl bg-white dark:bg-slate-800 shadow-2xl">
        {/* sticky header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 pt-6 pb-4 border-b border-navy/10 dark:border-slate-700">
          <h3 className="font-display text-2xl font-bold text-navy dark:text-white">
            {isNew ? 'เพิ่มภาคเรียนใหม่' : 'แก้ไขภาคเรียน'}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-navy/60 dark:text-slate-400 hover:bg-navy/5 dark:hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>

        {/* scrollable body */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4">
          <Field label="ชื่อภาคเรียน">
            <input
              className="input"
              value={draft.name || ''}
              onChange={(e) => upd('name', e.target.value)}
              placeholder="เช่น ภาคเรียนที่ 1/2567"
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="วันเริ่มต้น">
              <input
                type="date"
                className="input font-mono"
                value={draft.startDate || ''}
                onChange={(e) => upd('startDate', e.target.value)}
              />
            </Field>
            <Field label="วันสิ้นสุด">
              <input
                type="date"
                className="input font-mono"
                value={draft.endDate || ''}
                onChange={(e) => upd('endDate', e.target.value)}
              />
            </Field>
          </div>

          {/* Course checkboxes */}
          <div>
            <div className="mb-2 text-sm font-semibold text-navy dark:text-white flex items-center gap-2">
              คอร์สในภาคเรียน
              {courseIds.length > 0 && (
                <Badge color="indigo">{courseIds.length} คอร์ส</Badge>
              )}
            </div>
            {courses.length === 0 ? (
              <div className="rounded-lg border border-dashed border-navy/15 dark:border-slate-600 p-3 text-center text-xs text-navy/50 dark:text-slate-500">
                ยังไม่มีคอร์สในระบบ
              </div>
            ) : (
              <div className="grid gap-1.5 md:grid-cols-2">
                {courses.map((c) => {
                  const checked = courseIds.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2 text-xs transition ${
                        checked
                          ? 'border-indigo bg-indigo/10 dark:bg-indigo/20'
                          : 'border-navy/10 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-indigo'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCourse(c.id)}
                        className="mt-0.5 accent-indigo"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-navy dark:text-white">{c.title}</div>
                        <div className="font-mono text-[10px] text-navy/50 dark:text-slate-400">
                          {c.teacher} · {fmtBaht(c.price)}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* sticky footer */}
        <div className="flex-shrink-0 flex justify-end gap-2 px-6 pb-6 pt-4 border-t border-navy/10 dark:border-slate-700">
          <button
            onClick={onClose}
            className="rounded-xl border border-navy/10 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-navy/70 dark:text-slate-300 hover:border-navy hover:text-navy dark:hover:text-white"
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
 * AdminSemestersPage
 * ───────────────────────────────────────────────────────────────────── */
const AdminSemestersPage = ({ semesters, setSemesters, registrations, setRegistrations, courses, schedule, setSchedule, users }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [movingEntry, setMovingEntry] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);

  const getNickname = (email) => users.find((u) => u.email === email)?.nickname || '';

  const saveSemester = (draft) => {
    const normalized = {
      ...draft,
      courseIds: Array.isArray(draft.courseIds) ? draft.courseIds.map(Number) : [],
    };
    setSemesters((ss) => {
      if (normalized.id) return ss.map((s) => (s.id === normalized.id ? normalized : s));
      return [...ss, { ...normalized, id: Date.now() }];
    });
    setEditing(null);
  };

  const deleteSemester = (id) => {
    if (!confirm('ต้องการลบภาคเรียนนี้ใช่ไหม?')) return;
    setSemesters((ss) => ss.filter((s) => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const removeStudent = (regId) => {
    setRegistrations((rs) => rs.filter((r) => r.id !== regId));
    setConfirmRemove(null);
  };

  const saveScheduleEntry = (entry) => {
    setSchedule((sch) => sch.map((e) => (e.id === entry.id ? entry : e)));
    setMovingEntry(null);
  };

  const statusLabel = { approved: 'อนุมัติแล้ว', pending: 'รออนุมัติ', rejected: 'ปฏิเสธ' };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap size={32} className="text-indigo" />
          <h1 className="font-display text-3xl font-bold text-navy dark:text-white">ภาคเรียน</h1>
        </div>
        <button
          onClick={() => setEditing({ name: '', startDate: '', endDate: '', courseIds: [] })}
          className="rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-indigo"
        >
          + เพิ่มภาคเรียน
        </button>
      </div>

      {/* Empty state */}
      {semesters.length === 0 && (
        <div className="rounded-2xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-16 text-center">
          <GraduationCap size={48} className="mx-auto text-navy/20 dark:text-slate-600 mb-4" />
          <div className="font-display text-xl text-navy/50 dark:text-slate-500">ยังไม่มีภาคเรียน</div>
        </div>
      )}

      {/* Semester cards */}
      <div className="space-y-4">
        {semesters.map((sem) => {
          const isExpanded = expandedId === sem.id;
          const semCourses = courses.filter((c) => sem.courseIds?.includes(c.id));
          const semRegs = registrations.filter((r) => sem.courseIds?.includes(r.courseId) && r.status !== 'rejected');

          return (
            <div
              key={sem.id}
              className="rounded-2xl border border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
            >
              {/* Card header */}
              <div className="flex items-center gap-3 px-5 py-4">
                <button
                  className="flex flex-1 items-center gap-3 text-left min-w-0"
                  onClick={() => setExpandedId(isExpanded ? null : sem.id)}
                >
                  <GraduationCap size={20} className="flex-shrink-0 text-indigo" />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg font-bold text-navy dark:text-white truncate">
                      {sem.name}
                    </div>
                    {(sem.startDate || sem.endDate) && (
                      <div className="text-xs text-navy/50 dark:text-slate-400 font-mono">
                        {sem.startDate || '—'} → {sem.endDate || '—'}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge color="indigo">{semCourses.length} คอร์ส</Badge>
                    <Badge color="green">{semRegs.length} นักเรียน</Badge>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`flex-shrink-0 text-navy/40 dark:text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </button>
                <button
                  onClick={() => setEditing({ ...sem })}
                  className="rounded-lg p-1.5 text-navy/60 dark:text-slate-400 hover:bg-navy/5 dark:hover:bg-slate-700"
                  title="แก้ไข"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteSemester(sem.id)}
                  className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                  title="ลบ"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Expanded section */}
              {isExpanded && (
                <div className="border-t border-navy/10 dark:border-slate-700 px-5 py-4">
                  {semCourses.length === 0 ? (
                    <div className="text-sm text-navy/50 dark:text-slate-500">ไม่มีคอร์สในภาคเรียนนี้</div>
                  ) : (
                    <div className="space-y-5">
                      {semCourses.map((course) => {
                        const scheduleEntries = schedule.filter((e) => e.courseId === course.id);
                        const courseRegs = semRegs.filter((r) => r.courseId === course.id);

                        return (
                          <div
                            key={course.id}
                            className="rounded-xl border border-navy/10 dark:border-slate-700 bg-navy/[0.02] dark:bg-slate-700/20 p-4"
                          >
                            {/* Course header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-navy dark:text-white">{course.title}</span>
                                {course.timeSlot && (
                                  <span className="text-xs bg-navy/5 dark:bg-slate-700 px-2 py-0.5 rounded-full font-mono text-navy/60 dark:text-slate-400">
                                    {course.timeSlot}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Schedule entries */}
                            {scheduleEntries.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {scheduleEntries.map((entry) => (
                                  <div
                                    key={entry.id}
                                    className="flex items-center gap-1.5 rounded-lg border border-navy/10 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs"
                                  >
                                    <span className="font-mono text-navy/70 dark:text-slate-300">
                                      {entry.day} {entry.time}
                                    </span>
                                    {entry.room && (
                                      <span className="text-navy/40 dark:text-slate-500">· {entry.room}</span>
                                    )}
                                    <button
                                      onClick={() => setMovingEntry({ ...entry })}
                                      className="ml-1 flex items-center gap-1 rounded-lg border border-indigo/30 px-2 py-1 text-xs text-indigo hover:bg-indigo/5"
                                    >
                                      <ArrowLeftRight size={13} />
                                      ย้าย
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Student list */}
                            {courseRegs.length === 0 ? (
                              <div className="text-xs text-navy/40 dark:text-slate-500">ยังไม่มีนักเรียนลงทะเบียน</div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {courseRegs.map((r) => {
                                  const nick = getNickname(r.studentEmail);
                                  return (
                                    <div
                                      key={r.id}
                                      className="flex items-center gap-2 rounded-lg border border-navy/10 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs"
                                    >
                                      <div className="font-semibold text-navy dark:text-white">
                                        {r.firstName} {r.lastName}
                                        {nick && (
                                          <span className="ml-1 rounded-full bg-indigo/10 dark:bg-indigo/20 px-1.5 py-0.5 text-[10px] font-medium text-indigo">
                                            {nick}
                                          </span>
                                        )}
                                      </div>
                                      <Badge color={r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'gold'}>
                                        {statusLabel[r.status] || statusLabel.pending}
                                      </Badge>
                                      <button
                                        onClick={() => setConfirmRemove({ reg: r, courseName: course.title })}
                                        className="rounded p-1 text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30 ml-1"
                                        title="ลบออกจากคอร์ส"
                                      >
                                        <UserMinus size={13} />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SemesterEditor modal */}
      {editing && (
        <SemesterEditor
          draft={editing}
          courses={courses}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={saveSemester}
        />
      )}

      {/* ScheduleEntryEditor modal (move schedule) */}
      {movingEntry && (
        <ScheduleEntryEditor
          draft={movingEntry}
          courses={courses}
          onChange={setMovingEntry}
          onClose={() => setMovingEntry(null)}
          onSave={saveScheduleEntry}
        />
      )}

      {/* Confirm remove student dialog */}
      {confirmRemove && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 shadow-2xl p-6">
            <div className="mb-4">
              <div className="font-display text-lg font-bold text-navy dark:text-white mb-1">
                ลบนักเรียนออกจากคอร์ส?
              </div>
              <div className="font-semibold text-navy dark:text-slate-200">
                {confirmRemove.reg.firstName} {confirmRemove.reg.lastName}
              </div>
              <div className="text-xs text-navy/50 dark:text-slate-400 mt-1">{confirmRemove.courseName}</div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmRemove(null)}
                className="rounded-xl border border-navy/10 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-navy/70 dark:text-slate-300 hover:border-navy hover:text-navy dark:hover:text-white"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => removeStudent(confirmRemove.reg.id)}
                className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
              >
                ลบออก
              </button>
            </div>
          </div>
        </div>
      )}
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
  const [registrations, setRegistrations] = useState(() => loadLS(LS_KEYS.regs, mockRegistrations));
  const [schedule, setSchedule] = useState(() => loadLS(LS_KEYS.schedule, defaultSchedule));
  const [users, setUsers] = useState(() => loadLS(LS_KEYS.users, []));
  const [preselectCourse, setPreselectCourse] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [darkMode, setDarkMode] = useState(() => loadLS(LS_KEYS.theme, false));
  const [semesters, setSemesters] = useState(() => loadLS(LS_KEYS.semesters, defaultSemesters));

  useEffect(() => saveLS(LS_KEYS.user, currentUser), [currentUser]);
  useEffect(() => saveLS(LS_KEYS.regs, registrations), [registrations]);
  useEffect(() => saveLS(LS_KEYS.courses, courses), [courses]);
  useEffect(() => saveLS(LS_KEYS.schedule, schedule), [schedule]);
  useEffect(() => saveLS(LS_KEYS.users, users), [users]);
  useEffect(() => saveLS(LS_KEYS.theme, darkMode), [darkMode]);
  useEffect(() => saveLS(LS_KEYS.semesters, semesters), [semesters]);

  useEffect(() => {
    if (!currentUser && activePage !== 'login') setActivePage('login');
  }, [currentUser, activePage]);

  const toggleDark = () => setDarkMode((d) => !d);

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

  return (
    <div className={darkMode ? 'dark' : ''}>
      {!currentUser ? (
        <LoginPage onLogin={handleLogin} darkMode={darkMode} toggleDark={toggleDark} />
      ) : (
        <div className="min-h-screen bg-offwhite dark:bg-slate-900">
          <Navbar
            currentUser={currentUser}
            activePage={activePage}
            setActivePage={changePage}
            onLogout={handleLogout}
            darkMode={darkMode}
            toggleDark={toggleDark}
          />

          {transitioning ? (
            <div className="grid place-items-center py-32">
              <div className="text-center">
                <Dots />
                <div className="mt-3 font-mono text-sm text-navy/50 dark:text-slate-500">กำลังแก้สมการ x...</div>
              </div>
            </div>
          ) : (
            <main>
              {activePage === 'courses' && (
                <CoursesPage courses={courses} onRegister={handleRegisterClick} registrations={registrations} />
              )}
              {activePage === 'register' && (
                <RegisterPage
                  courses={courses}
                  preselectCourse={preselectCourse}
                  onSubmit={submitRegistration}
                  setActivePage={changePage}
                  currentUser={currentUser}
                  registrations={registrations}
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
                  users={users}
                />
              )}
              {activePage === 'admin-users' && currentUser.role === 'admin' && (
                <AdminUsersPage
                  registrations={registrations}
                  courses={courses}
                  setRegistrations={setRegistrations}
                  users={users}
                />
              )}
              {activePage === 'admin-accounts' && currentUser.role === 'admin' && (
                <AdminAccountsPage
                  users={users}
                  setUsers={setUsers}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              )}
              {activePage === 'profile' && (
                <ProfilePage
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  users={users}
                  setUsers={setUsers}
                />
              )}
              {activePage === 'admin-semesters' && currentUser.role === 'admin' && (
                <AdminSemestersPage
                  semesters={semesters}
                  setSemesters={setSemesters}
                  registrations={registrations}
                  setRegistrations={setRegistrations}
                  courses={courses}
                  schedule={schedule}
                  setSchedule={setSchedule}
                  users={users}
                />
              )}
            </main>
          )}

          <footer className="mt-16 border-t border-navy/10 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-xs text-navy/50 dark:text-slate-500">
              <div className="flex items-center gap-2">
                <Sigma size={14} className="text-indigo" />
                <span className="font-display text-sm font-bold text-navy dark:text-white">บ้านครูทราย</span>
              </div>
              <div className="font-mono">© {new Date().getFullYear()} — แก้สมการสู่ความชัดเจน</div>
            </div>
          </footer>
        </div>
      )}
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
.dark .input {
  background: #1e293b;
  border-color: rgba(148,163,184,0.2);
  color: #f1f5f9;
}
.dark .input:focus {
  border-color: #818CF8;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.3);
}
.dark .input option {
  background: #1e293b;
  color: #f1f5f9;
}
`;

if (typeof document !== 'undefined' && !document.getElementById('mm-input-styles')) {
  const s = document.createElement('style');
  s.id = 'mm-input-styles';
  s.innerHTML = InputStyles;
  document.head.appendChild(s);
}
