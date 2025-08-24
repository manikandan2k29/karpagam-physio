import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  PhoneCall,
  CalendarClock,
  MapPin,
  Stethoscope,
  HeartPulse,
  HandHeart,
  Dumbbell,
  Baby,
  Briefcase,
  FileText,
  MessageSquareQuote,
  Clock,
  Mail,
  ShieldCheck,
  ChevronRight,
  Star,
  Accessibility,
  Contrast,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ---------- Brand ----------
const BRAND = "Karpagam Physiotherapy";
const BRAND_SHORT = "KP";
const BRAND_EMAIL = "hello@karpagam.physio"; // update if needed
const BRAND_PHONE = "+91 99990 00111";      // update if needed
const BRAND_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=12.9700,77.6450"; // replace with your exact location if you have one

// ---------- Data ----------
const SERVICES = [
  {
    icon: <HeartPulse className="w-6 h-6" aria-hidden={true} />,
    name: "Pain Management",
    desc: "Evidence-based treatment for back, neck, knee and shoulder pain.",
  },
  {
    icon: <Dumbbell className="w-6 h-6" aria-hidden={true} />,
    name: "Sports Rehab",
    desc: "Return-to-sport programs with strength & mobility testing.",
  },
  {
    icon: <HandHeart className="w-6 h-6" aria-hidden={true} />,
    name: "Post-Operative Care",
    desc: "Customized protocols after ACL, meniscus, rotator cuff & more.",
  },
  {
    icon: <Stethoscope className="w-6 h-6" aria-hidden={true} />,
    name: "Neurological Rehab",
    desc: "Stroke, Parkinson's, vestibular therapy & balance training.",
  },
  {
    icon: <Baby className="w-6 h-6" aria-hidden={true} />,
    name: "Pediatric Physio",
    desc: "Milestone support, torticollis, scoliosis & postural care.",
  },
  {
    icon: <Briefcase className="w-6 h-6" aria-hidden={true} />,
    name: "Ergonomics @ Work",
    desc: "Desk set-up audits and injury-prevention workshops.",
  },
];

const OUTCOMES = [
  { week: 0, pain: 7.6, rom: 52 },
  { week: 1, pain: 6.8, rom: 58 },
  { week: 2, pain: 5.9, rom: 64 },
  { week: 3, pain: 4.9, rom: 70 },
  { week: 4, pain: 4.1, rom: 76 },
  { week: 5, pain: 3.4, rom: 81 },
  { week: 6, pain: 2.7, rom: 86 },
  { week: 7, pain: 2.2, rom: 90 },
  { week: 8, pain: 1.8, rom: 93 },
];

const THERAPISTS = [
  {
    name: "Dr. Aisha Raman, PT, DPT",
    role: "Sports Rehab Lead",
    blurb:
      "Certified in return-to-play testing; loves marathon strength plans.",
    rating: 4.9,
  },
  {
    name: "Arjun Mehta, MPT",
    role: "Spine & Post-op",
    blurb: "Manual therapy + progressive loading for sustainable recovery.",
    rating: 4.8,
  },
  {
    name: "Meera Iyer, BPT",
    role: "Neuro & Vestibular",
    blurb: "Balance retraining and dizziness resolution specialist.",
    rating: 4.9,
  },
];

const FAQS = [
  {
    q: "Do I need a doctor's prescription?",
    a: "In most cases, no. We can evaluate you directly and coordinate with your physician as needed.",
  },
  {
    q: "How long is each session?",
    a: "Initial evaluations are 45–60 minutes; follow-ups are typically 30–45 minutes depending on your plan.",
  },
  {
    q: "Do you offer home visits or telehealth?",
    a: "Yes, we provide in-clinic, at-home, and secure video sessions.",
  },
  {
    q: "Which insurance providers do you accept?",
    a: "We support most major insurers and provide cash packages. See Billing & Insurance below.",
  },
];

const PRICING = [
  { name: "Evaluation", price: "₹1,200", features: ["45–60 min", "Movement screen", "Plan of care"] },
  { name: "Follow-up", price: "₹900", features: ["30–45 min", "Hands-on + exercise", "Progress tracking"] },
  { name: "Recovery Pack (6)", price: "₹4,800", features: ["Save 10%", "Flexible scheduling", "Home program"] },
];

// ---------- Helpers ----------
function classNames(...a: any[]) {
  return a.filter(Boolean).join(" ");
}

function formatDateISO(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function createICS({ title, description, location, start, end }:{
  title: string, description: string, location: string, start: Date, end: Date
}) {
  const dtStart = formatDateISO(start);
  const dtEnd = formatDateISO(end);
  const uid = `${Date.now()}@physio.local`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Physio Clinic//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStart}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return new Blob([ics], { type: "text/calendar;charset=utf-8" });
}

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) as T : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

function Section({ id, title, icon, children }:{
  id: string, title: string, icon: React.ReactNode, children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="py-14 sm:py-20 scroll-mt-24 md:scroll-mt-28"
      aria-labelledby={`${id}-title`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-primary/10">{icon}</div>
          <h2 id={`${id}-title`} className="text-2xl sm:text-3xl font-semibold">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

// ---------- Main Component ----------
export default function PhysioClinic() {
  useEffect(() => {
    document.title = `${BRAND} | Feel Better, Move Better`;
  }, []);

  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [bookings, setBookings] = useLocalStorage<any[]>("physio_bookings_v1", []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Pain Management",
    therapist: "First available",
    date: "",
    time: "",
    mode: "In-Clinic",
  });
  const [confirm, setConfirm] = useState<any>(null);

  // Generate next 14 days excluding Sundays
  const days = useMemo(() => {
    const arr: Date[] = [];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      if (d.getDay() === 0) continue; // closed Sundays
      arr.push(d);
    }
    return arr;
  }, []);

  const slots = [
    "08:30","09:30","10:30","11:30","14:00","15:00","16:00","17:00",
  ];

  const availableTimes = useMemo(() => {
    if (!form.date) return [] as string[];
    const seed = form.date.split("-").join("");
    const blockedIdx = parseInt(seed.slice(-2), 10) % slots.length;
    return slots.filter((_, i) => i !== blockedIdx);
  }, [form.date]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.date || !form.time) return;

    const start = new Date(form.date + "T" + form.time + ":00");
    const end = new Date(start);
    end.setMinutes(start.getMinutes() + 45);

    const booking = {
      id: (window.crypto && window.crypto.randomUUID)
        ? window.crypto.randomUUID()
        : String(Date.now()),
      ...form,
      start: start.toISOString(),
      end: end.toISOString(),
    };
    setBookings([...(bookings as any[]), booking]);

    const blob = createICS({
      title: `Physiotherapy: ${form.service}`,
      description: `Therapist: ${form.therapist}\nMode: ${form.mode}\nBooked for ${form.name} (${form.phone})\nPlease arrive 10 minutes early.\nIf unwell, reschedule via email or phone.`,
      location: `${BRAND}, 221B Wellness Ave, Bengaluru`,
      start,
      end,
    });
    const url = URL.createObjectURL(blob);
    setConfirm({ ...booking, ics: url });
    setForm({ ...form, time: "" });
  }

  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function handleAnchorClick(e: React.MouseEvent, id: string) {
    e.preventDefault();
    scrollToId(id);
  }

  return (
    <div
      className={[
        highContrast ? "contrast-150 saturate-150" : "",
        "min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 scroll-smooth"
      ].join(" ")}
      style={{ fontSize: `${fontScale}rem` }}
    >
      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white border rounded px-3 py-2">
        Skip to content
      </a>

      {/* Header / Nav */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={() => scrollToId("main")} className="flex items-center gap-3 text-left" aria-label={`${BRAND} home`}>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 grid place-content-center text-white font-bold">
              {BRAND_SHORT}
            </div>
            <div className="leading-tight">
              <p className="font-semibold">{BRAND}</p>
              <p className="text-xs text-slate-500">Feel better. Move better.</p>
            </div>
          </button>
          <nav aria-label="Primary" className="hidden md:flex gap-6 text-sm">
            <a href="#services" onClick={(e)=>handleAnchorClick(e,'services')} className="hover:text-teal-600">Services</a>
            <a href="#booking" onClick={(e)=>handleAnchorClick(e,'booking')} className="hover:text-teal-600">Book</a>
            <a href="#team" onClick={(e)=>handleAnchorClick(e,'team')} className="hover:text-teal-600">Team</a>
            <a href="#outcomes" onClick={(e)=>handleAnchorClick(e,'outcomes')} className="hover:text-teal-600">Outcomes</a>
            <a href="#pricing" onClick={(e)=>handleAnchorClick(e,'pricing')} className="hover:text-teal-600">Pricing</a>
            <a href="#contact" onClick={(e)=>handleAnchorClick(e,'contact')} className="hover:text-teal-600">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href={`tel:${BRAND_PHONE.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-3 py-2 text-white text-sm shadow-sm hover:bg-teal-700">
              <PhoneCall className="w-4 h-4" aria-hidden={true} />
              <span className="hidden sm:inline">Call</span>
              <span className="font-semibold">{BRAND_PHONE}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main id="main">
        {/* ... (Hero and sections identical to the canvas code) ... */}
      </main>
    </div>
  );
}
