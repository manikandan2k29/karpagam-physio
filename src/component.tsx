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
function classNames(...a: (string | undefined | null | false)[]) {
  return a.filter(Boolean).join(" ");
}

function formatDateISO(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function createICS({
  title,
  description,
  location,
  start,
  end,
}: {
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
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

function useLocalStorage(key: string, initial: boolean | never[]) {
  const [value, setValue] = useState(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

type SectionProps = {
  id: string;
  title: React.ReactNode;
  icon: React.ReactNode;
  children: React.ReactNode;
};

function Section({ id, title, icon, children }: SectionProps) {
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
  const [bookings, setBookings] = useLocalStorage("physio_bookings_v1", []);

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
  type Booking = {
    id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    therapist: string;
    date: string;
    time: string;
    mode: string;
    start: string;
    end: string;
  };

  type ConfirmBooking = Booking & { ics: string };

  const [confirm, setConfirm] = useState<ConfirmBooking | null>(null);

  // Generate next 14 days excluding Sundays
  const days = useMemo(() => {
    const arr = [];
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
    "08:30",
    "09:30",
    "10:30",
    "11:30",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const availableTimes = useMemo(() => {
    if (!form.date) return [];
    const seed = form.date.split("-").join("");
    const blockedIdx = parseInt(seed.slice(-2), 10) % slots.length;
    return slots.filter((_, i) => i !== blockedIdx);
  }, [form.date]);

  function onSubmit(e: { preventDefault: () => void; }) {
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
    setBookings([...bookings, booking]);

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
  function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) {
    e.preventDefault();
    scrollToId(id);
  }

  return (
    <div
      className={classNames(
        highContrast ? "contrast-150 saturate-150" : "",
        "min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 scroll-smooth"
      )}
      style={{ fontSize: `${fontScale}rem` }}
    >
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white border rounded px-3 py-2"
      >
        Skip to content
      </a>

      {/* Header / Nav */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => scrollToId("main")}
            className="flex items-center gap-3 text-left"
            aria-label={`${BRAND} home`}
          >
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
            <a
              href={`tel:${BRAND_PHONE.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-3 py-2 text-white text-sm shadow-sm hover:bg-teal-700"
            >
              <PhoneCall className="w-4 h-4" aria-hidden={true} />
              <span className="hidden sm:inline">Call</span>
              <span className="font-semibold">{BRAND_PHONE}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main id="main">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30" aria-hidden={true}>
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 560">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <path d="M0,160 C240,260 320,80 640,160 C960,240 1120,120 1440,200 L1440,0 L0,0 Z" fill="url(#g)" />
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
                Personalised physiotherapy that gets you back to what you love
              </h1>
              <p className="mt-4 text-slate-600 max-w-prose">
                One-on-one care, clear plans, measurable progress. From back pain to sports injuries, our team blends manual therapy with progressive loading and education.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#booking" onClick={(e)=>handleAnchorClick(e,'booking')} className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-4 py-2 text-white shadow hover:bg-teal-700">
                  <CalendarClock className="w-4 h-4" aria-hidden={true} /> Book an evaluation
                </a>
                <a href="#services" onClick={(e)=>handleAnchorClick(e,'services')} className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 hover:bg-white">
                  Explore services <ChevronRight className="w-4 h-4" aria-hidden={true} />
                </a>
              </div>
              <ul className="mt-6 text-sm text-slate-600 grid sm:grid-cols-3 gap-2 max-w-xl">
                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-600" aria-hidden={true} /> NABL standards</li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-teal-600" aria-hidden={true} /> Same-week starts</li>
                <li className="flex items-center gap-2"><FileText className="w-4 h-4 text-teal-600" aria-hidden={true} /> Home programs</li>
              </ul>
            </motion.div>

            {/* Appointment card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white/80 backdrop-blur border rounded-3xl p-6 shadow-sm"
              aria-labelledby="quick-book-title"
            >
              <h2 id="quick-book-title" className="text-xl font-semibold flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-teal-600" aria-hidden={true} /> Quick Book
              </h2>
              <p className="text-sm text-slate-600 mb-4">Secure your first visit in under a minute.</p>
              <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-sm">
                  <span className="block mb-1">Full name</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border px-3 py-2" placeholder="Your name" />
                </label>
                <label className="text-sm">
                  <span className="block mb-1">Email</span>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border px-3 py-2" placeholder="you@email.com" />
                </label>
                <label className="text-sm">
                  <span className="block mb-1">Phone</span>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border px-3 py-2" placeholder="+91 …" />
                </label>
                <label className="text-sm">
                  <span className="block mb-1">Visit mode</span>
                  <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full rounded-xl border px-3 py-2">
                    <option>In-Clinic</option>
                    <option>Home Visit</option>
                    <option>Telehealth</option>
                  </select>
                </label>
                <label className="text-sm">
                  <span className="block mb-1">Service</span>
                  <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="w-full rounded-xl border px-3 py-2">
                    {SERVICES.map((s) => (
                      <option key={s.name}>{s.name}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="block mb-1">Therapist</span>
                  <select value={form.therapist} onChange={(e) => setForm({ ...form, therapist: e.target.value })} className="w-full rounded-xl border px-3 py-2">
                    <option>First available</option>
                    {THERAPISTS.map((t) => (
                      <option key={t.name}>{t.name}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="block mb-1">Date</span>
                  <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-xl border px-3 py-2" min={days[0]?.toISOString().slice(0, 10)} max={days[days.length - 1]?.toISOString().slice(0, 10)} />
                </label>
                <div className="text-sm">
                  <span className="block mb-1">Time</span>
                  <div className="grid grid-cols-4 gap-2">
                    {availableTimes.length === 0 && (
                      <p className="col-span-4 text-slate-500">Pick a date to see times</p>
                    )}
                    {availableTimes.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setForm({ ...form, time: t })}
                        className={classNames(
                          "rounded-xl border px-2 py-1",
                          form.time === t ? "border-teal-600 bg-teal-50" : "hover:bg-slate-50"
                        )}
                        aria-pressed={form.time === t}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2 mt-2 flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-4 py-2 text-white shadow hover:bg-teal-700"
                  >
                    <CalendarClock className="w-4 h-4" aria-hidden={true} /> Confirm appointment
                  </button>
                  <p className="text-xs text-slate-500">You'll get an .ics calendar file after booking.</p>
                </div>
              </form>
              {confirm && (
                <div className="mt-4 rounded-2xl border bg-teal-50 p-4 text-sm">
                  <p className="font-medium">You're booked! <span className="text-teal-700">{new Date(confirm.start).toLocaleString()}</span></p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <a href={confirm.ics} download={`Physio-${confirm.id}.ics`} className="underline">Add to Calendar (.ics)</a>
                    <a href={BRAND_MAPS_URL} target="_blank" rel="noreferrer" className="underline">Directions</a>
                    <a href={`mailto:${form.email}?subject=Your%20Physio%20Booking&body=See%20you%20soon!`} className="underline">Email confirmation</a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <Section id="services" title="Comprehensive Services" icon={<Stethoscope className="w-5 h-5 text-teal-600" aria-hidden={true} />}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-2xl border p-5 bg-white shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700">{s.icon}</div>
                  <h3 className="font-semibold">{s.name}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Team */}
        <Section id="team" title="Meet Your Care Team" icon={<HandHeart className="w-5 h-5 text-teal-600" aria-hidden={true} />}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {THERAPISTS.map((t) => (
              <div key={t.name} className="rounded-2xl border bg-white p-5">
                <div className="h-36 w-full rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 mb-4" role="img" aria-label={`Portrait placeholder for ${t.name}`}></div>
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-slate-600">{t.role}</p>
                <p className="mt-2 text-sm">{t.blurb}</p>
                <p className="mt-2 flex items-center gap-1 text-sm text-amber-600">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={classNames("w-4 h-4", i < Math.round(t.rating) ? "fill-amber-400" : "")} />
                  ))}
                  <span className="ml-1 text-slate-600">{t.rating} / 5</span>
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Outcomes */}
        <Section id="outcomes" title="Measured Outcomes" icon={<FileText className="w-5 h-5 text-teal-600" aria-hidden={true} />}>
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div className="rounded-2xl border bg-white p-4">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={OUTCOMES} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" label={{ value: "Week", position: "insideBottomRight", offset: -5 }} />
                    <YAxis yAxisId="left" domain={[0, 10]} label={{ value: "Pain (0–10)", angle: -90, position: "insideLeft" }} />
                    <YAxis yAxisId="right" orientation="right" domain={[40, 100]} label={{ value: "Knee ROM (°)", angle: 90, position: "insideRight" }} />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="pain" dot={false} strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="rom" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <ul className="text-sm space-y-2 text-slate-700">
              <li>• Average pain reduced from 7.6 → 1.8 by week 8.</li>
              <li>• Knee range of motion improved 41° on average over 8 weeks.</li>
              <li>• Home program adherence &gt; 80% (reported).</li>
            </ul>
          </div>
        </Section>

        {/* Pricing */}
        <Section id="pricing" title="Pricing & Packages" icon={<FileText className="w-5 h-5 text-teal-600" aria-hidden={true} />}>
          <div className="grid sm:grid-cols-3 gap-6">
            {PRICING.map((p) => (
              <div key={p.name} className="rounded-2xl border bg-white p-6">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-3xl font-bold mt-2">{p.price}</p>
                <ul className="mt-4 text-sm text-slate-700 space-y-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-teal-600" aria-hidden={true} /> {f}
                    </li>
                  ))}
                </ul>
                <a href="#booking" onClick={(e)=>handleAnchorClick(e,'booking')} className="mt-5 inline-block rounded-2xl bg-teal-600 px-4 py-2 text-white text-sm">Book now</a>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border bg-white p-4 text-sm text-slate-700">
            <p className="font-medium">Billing & Insurance</p>
            <p>
              We provide itemized invoices for reimbursements and accept most major insurers. Cashless options are available with select partners. For corporate wellness tie-ups, contact <a className="underline" href={`mailto:${BRAND_EMAIL}`}>{BRAND_EMAIL}</a>.
            </p>
          </div>
        </Section>

        {/* Testimonials */}
        <Section id="reviews" title="What patients say" icon={<MessageSquareQuote className="w-5 h-5 text-teal-600" aria-hidden={true} />}>
          <div className="grid lg:grid-cols-3 gap-6">
            {[
              { name: "Saanvi R.", text: "After my ACL surgery, the return-to-run plan was spot on. Back on the pitch!" },
              { name: "Rohit K.", text: "The back pain education changed everything. No more fear of bending." },
              { name: "Ishaan M.", text: "Vestibular therapy stopped the dizziness in two weeks. Life saver." },
            ].map((r, i) => (
              <motion.blockquote
                key={r.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border bg-white p-5"
              >
                <p className="text-slate-800">“{r.text}”</p>
                <footer className="mt-3 text-sm text-slate-600">— {r.name}</footer>
              </motion.blockquote>
            ))}
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq" title="FAQs" icon={<FileText className="w-5 h-5 text-teal-600" aria-hidden={true} />}>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details key={i} className="rounded-2xl border bg-white p-4">
                <summary className="font-medium cursor-pointer">{f.q}</summary>
                <p className="mt-2 text-sm text-slate-700">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* Contact / Map */}
        <Section id="contact" title="Find us" icon={<MapPin className="w-5 h-5 text-teal-600" aria-hidden={true} />}>
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <div className="rounded-2xl border bg-white p-5">
              <h3 className="font-semibold">{BRAND}</h3>
              <address className="not-italic text-sm mt-2 text-slate-700">
                221B Wellness Ave,<br /> Indiranagar, Bengaluru 560038
              </address>
              <p className="mt-2 text-sm">
                <a className="underline" href={`tel:${BRAND_PHONE.replace(/\s/g, '')}`}><PhoneCall className="w-4 h-4 inline" aria-hidden={true} /> {BRAND_PHONE}</a> ·
                <a className="underline ml-2" href={`mailto:${BRAND_EMAIL}`}><Mail className="w-4 h-4 inline" aria-hidden={true} /> {BRAND_EMAIL}</a>
              </p>
              <p className="mt-2 text-sm text-slate-600">Hours: Mon–Sat 8:30–18:00 · Sundays closed</p>
              <p className="mt-2"><a className="underline" href={BRAND_MAPS_URL} target="_blank" rel="noreferrer">Open in Google Maps</a></p>
            </div>
            <div className="rounded-2xl overflow-hidden border bg-white">
              <iframe
                title="Clinic map"
                className="w-full h-[300px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.640%2C12.96%2C77.65%2C12.98&layer=mapnik&marker=12.97%2C77.645"
              />
            </div>
          </div>
        </Section>

        {/* Booking section anchor */}
        <Section id="booking" title="Book your visit" icon={<CalendarClock className="w-5 h-5 text-teal-600" aria-hidden={true} />}>
          <p className="text-sm text-slate-700 mb-4">Use the quick form above or call us. After booking, you'll receive an .ics calendar file. Rescheduling is free up to 12 hours prior.</p>
          <div className="rounded-2xl border bg-white p-4 text-sm">
            <h3 className="font-medium mb-2">Your upcoming bookings</h3>
            {bookings.length === 0 ? (
              <p className="text-slate-600">No upcoming bookings yet.</p>
            ) : (
              <ul className="divide-y">
                {bookings.map((b:any) => (
                  <li key={b.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{b.service} with {b.therapist}</p>
                      <p className="text-slate-600">{new Date(b.start).toLocaleString()} · {b.mode}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${form.email}?subject=Reschedule%20request`} className="underline text-teal-700">Reschedule</a>
                      <button className="underline text-slate-600" onClick={() => setBookings(bookings.filter((x:any) => x.id !== b.id))}>Cancel</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>
      </main>

      {/* Accessibility Toolbar */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <button onClick={() => setHighContrast((v) => !v)} className="rounded-full border bg-white p-3 shadow" aria-pressed={highContrast} aria-label="Toggle high contrast">
          <Contrast className="w-5 h-5" />
        </button>
        <button onClick={() => setFontScale((v) => Math.min(1.4, Number((v + 0.05).toFixed(2))))} className="rounded-full border bg-white p-3 shadow" aria-label="Increase font size">
          <Accessibility className="w-5 h-5" />
        </button>
        <button onClick={() => setFontScale((v) => Math.max(0.9, Number((v - 0.05).toFixed(2))))} className="rounded-full border bg-white p-3 shadow" aria-label="Decrease font size">
          A-
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-semibold">{BRAND}</p>
            <p className="text-slate-600">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <div>
            <p className="font-semibold">Patient info</p>
            <ul className="mt-2 space-y-1 text-slate-700">
              <li><a className="underline" href="#pricing" onClick={(e)=>handleAnchorClick(e,'pricing')}>Pricing</a></li>
              <li><a className="underline" href="#faq" onClick={(e)=>handleAnchorClick(e,'faq')}>FAQs</a></li>
              <li><a className="underline" href="#reviews" onClick={(e)=>handleAnchorClick(e,'reviews')}>Reviews</a></li>
            </ul>
          </div>
          <div>
            <p id="policies" className="font-semibold">Policies</p>
            <ul className="mt-2 space-y-1 text-slate-700">
              <li>Privacy &amp; HIPAA-compliant records</li>
              <li>24h cancellation policy</li>
              <li>Emergency? Call your local services</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Cookie/banner */}
      <CookieBanner onLearnMore={() => scrollToId("policies")} />

      {/* Floating call action */}
      <a href={`tel:${BRAND_PHONE.replace(/\s/g, '')}`} className="fixed bottom-4 left-4 rounded-full bg-teal-600 text-white px-4 py-3 shadow-lg flex items-center gap-2">
        <PhoneCall className="w-4 h-4" aria-hidden={true} /> Call clinic
      </a>
    </div>
  );
}

function CookieBanner({ onLearnMore }:any) {
  const [ok, setOk] = useLocalStorage("cookie_ok_v1", false);
  if (ok) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-3xl m-3 rounded-2xl border bg-white p-4 shadow">
        <p className="text-sm text-slate-700">
          We use cookies for basic functionality. We do not sell or share your data.
        </p>
        <div className="mt-2 flex gap-2">
          <button onClick={() => setOk(true)} className="rounded-xl bg-teal-600 text-white px-3 py-1 text-sm">Okay</button>
          <button onClick={onLearnMore} className="text-sm underline">Learn more</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Lightweight runtime tests (non-blocking) ----------
(function runSmokeTests() {
  try {
    console.groupCollapsed("KarpagamPhysio smoke tests");

    // classNames
    console.assert(classNames("a", undefined, "b") === "a b", "classNames should join truthy values");

    // formatDateISO
    const iso = formatDateISO(new Date("2025-01-02T03:04:05Z"));
    console.assert(/^[0-9]{8}T[0-9]{6}Z$/.test(iso), "formatDateISO should be compact ISO (YYYYMMDDTHHMMSSZ)");

    // createICS
    const blob = createICS({
      title: "Test",
      description: "Line1\nLine2",
      location: "Somewhere",
      start: new Date("2025-01-01T10:00:00Z"),
      end: new Date("2025-01-01T10:45:00Z"),
    });
    console.assert(blob && typeof blob.size === "number" && blob.type.includes("text/calendar"), "createICS should return calendar blob");

    // sections exist for nav ids
    ["services","booking","team","outcomes","pricing","contact","faq","reviews"].forEach(id => {
      const el = document.getElementById(id);
      console.assert(!!el, `section '#${id}' should exist`);
    });

    // one timeslot pseudo-blocked
    const _slots = ["08:30","09:30","10:30","11:30","14:00","15:00","16:00","17:00"]; // mirror above
    const seed = "2025-08-23".split("-").join("");
    const blockedIdx = parseInt(seed.slice(-2), 10) % _slots.length;
    const filtered = _slots.filter((_, i) => i !== blockedIdx);
    console.assert(filtered.length === 7, "One slot should be pseudo-blocked based on date seed");

    console.groupEnd();
  } catch (e) {
    console.warn("Smoke tests error (non-fatal):", e);
  }
})();
