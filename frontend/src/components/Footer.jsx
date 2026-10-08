import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaPinterestP,
  FaLinkedinIn,
} from "react-icons/fa";
const sections = [
  {
    key: "categories",
    title: "TOP CATEGORIES",
    links: [
      ["/salwar-suit-sets", "Salwar Suit Sets"],
      ["/sarees", "Sarees"],
      ["/kurta-sets", "Women Kurta Sets"],
      ["/lehengas", "Lehengas"],
      ["/dresses", "Dresses"],
      ["/mens-shirts", "Men's Shirts"],
      ["/mens-kurta", "Men's Kurta"],
      ["/juttis", "Juttis"],
      ["/jewellery", "Jewellery"],
      ["/footwear", "Footwear"],
    ],
  },
  {
    key: "discover",
    title: "DISCOVER",
    links: [
      ["/about", "About Us"],
      ["/stores", "Stores"],
      ["/careers", "Careers"],
      ["/reviews", "Customer Reviews"],
      ["/media", "Media"],
      ["/business-query", "Business Query"],
      ["/blog", "Blog"],
      ["/celeb-closet", "Celeb Closet"],
    ],
  },
  {
    key: "support",
    title: "SUPPORT",
    links: [
      ["/fraud-alert", "Fraud Alert"],
      ["/track-order", "Track Order"],
      ["/exchange", "Exchange Request"],
      ["/sitemap", "Sitemap"],
      ["/contact", "Contact Us"],
    ],
  },
  {
    key: "policies",
    title: "POLICIES",
    links: [
      ["/shipping-policy", "Shipping Policy"],
      ["/privacy-policy", "Privacy Policy"],
      ["/return-policy", "Cancellation, Return & Exchange Policy"],
      ["/terms", "Terms of Services"],
    ],
  },
];

const socials = [
  ["https://instagram.com", "Instagram", FaInstagram],
  ["https://facebook.com", "Facebook", FaFacebookF],
  ["https://youtube.com", "YouTube", FaYoutube],
  ["https://pinterest.com", "Pinterest", FaPinterestP],
  ["https://linkedin.com", "LinkedIn", FaLinkedinIn],
];

const FLAG_COLORS = ["#2f6fb5", "#ffffff", "#d94b4b", "#3f9a5a", "#f2c230"];

// Flags hanging along a sagging string
const flagStrings = [
  { top: 58, sag: 34, from: 0, to: 46, count: 16 },
  { top: 52, sag: 28, from: 54, to: 100, count: 16 },
];

const snowflakes = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${-(i % 9) * 0.9}s`,
  duration: `${7 + (i % 5) * 1.3}s`,
  size: 3 + (i % 3),
}));

const leaves = Array.from({ length: 9 }, (_, i) => ({
  left: `${8 + i * 10.5}%`,
  delay: `${-i * 1.7}s`,
  duration: `${9 + (i % 4) * 2}s`,
  color: ["#d9822b", "#c25a1e", "#e9a23b"][i % 3],
}));

const houses = [150, 255, 520, 610, 930, 1030, 1230];

function Deodar({ className = "", fill = "#2f5d3a", delay = "0s" }) {
  return (
    <svg
      viewBox="0 0 60 140"
      className={`hb-sway absolute bottom-0 ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden="true"
    >
      <rect x="27" y="112" width="6" height="28" fill="#5a3e2b" />
      <polygon points="30,55 58,118 2,118" fill={fill} />
      <polygon points="30,25 54,78 6,78" fill={fill} opacity="0.92" />
      <polygon points="30,0 48,42 12,42" fill={fill} opacity="0.85" />
    </svg>
  );
}

function PrayerFlags() {
  return (
    <>
      {flagStrings.map((s, si) => (
        <div key={si} className="absolute inset-x-0 pointer-events-none" style={{ top: s.top }}>
          {/* string */}
          <svg
            className="absolute left-0 w-full"
            style={{ left: 0, top: 0, height: s.sag + 10 }}
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={`M${s.from} 2 Q${(s.from + s.to) / 2} ${s.sag + 4} ${s.to} 2`}
              fill="none"
              stroke="#6b4a3a"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* flags */}
          {Array.from({ length: s.count }, (_, i) => {
            const t = (i + 0.5) / s.count;
            const x = s.from + (s.to - s.from) * t;
            // point on the quadratic curve, converted from viewBox units to px
            const y = (2 + 2 * t * (1 - t) * (s.sag + 2)) * ((s.sag + 10) / 40);
            return (
              <span
                key={i}
                className="hb-wave absolute block"
                style={{
                  left: `${x}%`,
                  top: y,
                  width: 12,
                  height: 15,
                  background: FLAG_COLORS[i % 5],
                  animationDelay: `${-(i % 7) * 0.25}s`,
                  boxShadow: "0 1px 2px rgba(0,0,0,.15)",
                }}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

function VillageForeground() {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="xMidYMax slice"
      className="absolute bottom-0 left-0 w-full h-[46%] md:h-[48%]"
      aria-hidden="true"
    >
      {/* back hill */}
      <path
        d="M0 120 C200 70 400 110 640 90 C900 65 1100 110 1440 80 V200 H0Z"
        fill="#a6bf84"
      />

      {/* houses */}
      {houses.map((x, i) => (
        <g key={x}>
          <rect x={x + 24} y="94" width="6" height="16" fill="#7b4b3a" />
          <rect x={x} y="108" width="34" height="30" fill={i % 2 ? "#e7b38f" : "#d98a8a"} />
          <polygon points={`${x - 5},109 ${x + 17},90 ${x + 39},109`} fill="#2a8f8a" />
          <rect
            className="hb-window"
            x={x + 11}
            y="118"
            width="9"
            height="9"
            fill="#fff3c4"
            style={{ animationDelay: `${-i * 0.9}s` }}
          />
          {[0, 1, 2].map((k) => (
            <circle
              key={k}
              className="hb-smoke"
              cx={x + 27}
              cy="92"
              r="4"
              fill="#ffffff"
              style={{ animationDelay: `${-(i * 0.7 + k * 1.6)}s` }}
            />
          ))}
        </g>
      ))}

      {/* front hill (covers house bottoms) */}
      <path
        d="M0 150 C260 118 520 162 760 140 C1020 118 1220 162 1440 132 V200 H0Z"
        fill="#6f9a55"
      />
      <path
        d="M0 178 C300 156 600 190 900 170 C1150 154 1300 180 1440 168 V200 H0Z"
        fill="#547f45"
      />
    </svg>
  );
}

function HimachalBanner() {
  return (
    <div className="relative w-full h-[380px] md:h-[480px] overflow-hidden bg-[#fdf8f3]">
      <style>{`
        @keyframes hb-kenburns { from { transform: scale(1); } to { transform: scale(1.12) translateX(-2%); } }
        @keyframes hb-fade     { 0%,42% { opacity: 1 } 58%,92% { opacity: 0 } 100% { opacity: 1 } }
        @keyframes hb-fade-rev { 0%,42% { opacity: 0 } 58%,92% { opacity: 1 } 100% { opacity: 0 } }
        @keyframes hb-drift    { from { transform: translateX(-35vw); } to { transform: translateX(120vw); } }
        @keyframes hb-fly      { 0% { transform: translate(-10vw,0); } 50% { transform: translate(50vw,-28px); } 100% { transform: translate(112vw,12px); } }
        @keyframes hb-flap     { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(.45); } }
        @keyframes hb-sun      { 0%,100% { opacity:.55; transform: scale(1); } 50% { opacity:.95; transform: scale(1.18); } }
        @keyframes hb-sway     { 0%,100% { transform: rotate(-1.6deg); } 50% { transform: rotate(1.6deg); } }
        @keyframes hb-wave     { 0%,100% { transform: skewY(-7deg) scaleX(1); } 50% { transform: skewY(7deg) scaleX(.82); } }
        @keyframes hb-snow     { 0% { transform: translate(0,-10px); opacity:0; } 10% { opacity:1; } 100% { transform: translate(34px,420px); opacity:0; } }
        @keyframes hb-leaf     { 0% { transform: translate(0,-20px) rotate(0); opacity:0; } 10% { opacity:1; } 50% { transform: translate(45px,200px) rotate(180deg); } 100% { transform: translate(-20px,420px) rotate(360deg); opacity:0; } }
        @keyframes hb-smoke    { 0% { transform: translate(0,0) scale(.5); opacity:0; } 20% { opacity:.7; } 100% { transform: translate(14px,-46px) scale(2.2); opacity:0; } }
        @keyframes hb-window   { 0%,100% { fill:#fff3c4; } 50% { fill:#ffd36b; } }
        @keyframes hb-parallax { from { transform: translateX(-12px); } to { transform: translateX(12px); } }

        .hb-sway   { transform-origin: bottom center; animation: hb-sway 5s ease-in-out infinite; }
        .hb-wave   { transform-origin: left center;   animation: hb-wave 1.8s ease-in-out infinite; }
        .hb-smoke  { transform-box: fill-box; transform-origin: center; animation: hb-smoke 5s ease-out infinite; opacity: 0; }
        .hb-window { animation: hb-window 3s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .hb-anim, .hb-sway, .hb-wave, .hb-smoke, .hb-window { animation: none !important; }
        }
      `}</style>

      {/* Photos: slow zoom + crossfade (zoom on wrapper, fade on image) */}
      {[
        ["/images/himachal-1.jpg", "hb-fade"],
        ["/images/himachal-2.jpg", "hb-fade-rev"],
      ].map(([src, fade]) => (
        <div
          key={src}
          className="hb-anim absolute inset-0"
          style={{ animation: "hb-kenburns 22s ease-in-out infinite alternate" }}
        >
          <img
            src={src}
            alt=""
            className="hb-anim w-full h-full object-cover"
            style={{ animation: `${fade} 18s ease-in-out infinite` }}
          />
        </div>
      ))}

      {/* Blend into footer colour at the top + warm brand tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fdf8f3] via-[#fdf8f3]/35 to-transparent" />
      <div className="absolute inset-0 bg-[#fbe4dd]/25 mix-blend-multiply" />

      {/* Glowing sun */}
      <div
        className="hb-anim absolute top-16 right-[18%] w-28 h-28 rounded-full bg-yellow-100 blur-2xl"
        style={{ animation: "hb-sun 5s ease-in-out infinite" }}
      />

      {/* Drifting clouds */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="hb-anim absolute rounded-full bg-white/70 blur-xl"
          style={{
            top: 90 + i * 34,
            width: 170 + i * 50,
            height: 38 + i * 8,
            animation: `hb-drift ${55 + i * 22}s linear infinite`,
            animationDelay: `-${i * 17}s`,
          }}
        />
      ))}

      {/* Birds */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="hb-anim absolute left-0 w-6"
          style={{
            top: 120 + i * 26,
            animation: `hb-fly ${26 + i * 7}s linear infinite`,
            animationDelay: `-${i * 9}s`,
          }}
        >
          <svg
            viewBox="0 0 24 10"
            className="hb-anim w-full text-gray-800/70"
            style={{ animation: "hb-flap .7s ease-in-out infinite" }}
          >
            <path d="M0 8 Q6 0 12 6 Q18 0 24 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      ))}

      {/* Deodar trees – left and right, behind the village */}
      <div className="absolute inset-x-0 bottom-[18%] h-[55%] pointer-events-none">
        <Deodar className="left-[1%] w-20 md:w-28" fill="#2c5937" />
        <Deodar className="left-[7%] w-14 md:w-20" fill="#3a6d45" delay="-1.5s" />
        <Deodar className="left-[12%] w-10 md:w-14 hidden sm:block" fill="#2f6340" delay="-3s" />
        <Deodar className="right-[1%] w-20 md:w-28" fill="#2c5937" delay="-2s" />
        <Deodar className="right-[7%] w-14 md:w-20" fill="#3a6d45" delay="-0.7s" />
        <Deodar className="right-[12%] w-10 md:w-14 hidden sm:block" fill="#2f6340" delay="-2.6s" />
      </div>

      {/* Village + hills + chimney smoke */}
      <VillageForeground />

      {/* Prayer flags */}
      <PrayerFlags />

      {/* Falling snow */}
      {snowflakes.map((s, i) => (
        <span
          key={i}
          className="hb-anim absolute top-0 rounded-full bg-white/90 pointer-events-none"
          style={{
            left: s.left,
            width: s.size,
            height: s.size,
            animation: `hb-snow ${s.duration} linear infinite`,
            animationDelay: s.delay,
          }}
        />
      ))}

      {/* Autumn leaves */}
      {leaves.map((l, i) => (
        <span
          key={i}
          className="hb-anim absolute top-0 pointer-events-none"
          style={{
            left: l.left,
            width: 9,
            height: 6,
            background: l.color,
            borderRadius: "80% 0 80% 0",
            animation: `hb-leaf ${l.duration} linear infinite`,
            animationDelay: l.delay,
          }}
        />
      ))}

      {/* Copyright */}
      <div className="absolute inset-x-0 top-5 flex justify-center px-4">
        <p className="text-sm text-gray-800 bg-white/60 backdrop-blur px-3 py-1 rounded text-center">
          © 2026 Rivana Himachal Pvt. Ltd. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
function NewsletterAndSocials() {
  return (
    <>
      <form
        className="flex items-center border-b border-gray-500 pb-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full bg-transparent outline-none text-sm placeholder:text-gray-600"
        />
        <button type="submit" aria-label="Subscribe">
          <Mail size={18} />
        </button>
      </form>

      <div className="flex gap-4 mt-6 text-white">
        {socials.map(([href, label, Icon]) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="bg-[#d98a8a] p-2 rounded-full transition-transform duration-200 hover:-translate-y-1 hover:bg-[#c97575]"
            aria-label={label}
          >
            <Icon size={14} />
          </a>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                             */
/* ------------------------------------------------------------------ */
function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="w-full bg-[#fdf8f3] text-gray-700">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-10">
        {/* md or lg screen --visible */}
        <div className="hidden md:grid md:grid-cols-5 gap-10">
          {sections.map((section) => (
            <div key={section.key}>
              <h3 className="mb-5 text-sm font-semibold text-black">
                {section.title}
              </h3>
              <div className="flex flex-col gap-3 text-sm">
                {section.links.map(([to, label]) => (
                  <Link key={to} to={to}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <NewsletterAndSocials />
          </div>
        </div>

        <div className="md:hidden">
          {sections.map((section) => (
            <div key={section.key} className="border-b border-gray-300">
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full py-5 flex items-center justify-between text-sm font-semibold text-black"
              >
                <span>{section.title}</span>
                <span className="text-xl">
                  {openSection === section.key ? "−" : "+"}
                </span>
              </button>
              {openSection === section.key && (
                <div className="pb-5 flex flex-col gap-3 text-sm">
                  {section.links.map(([to, label]) => (
                    <Link key={to} to={to}>
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="py-5">
            <NewsletterAndSocials />
          </div>
        </div>
      </div>

      <HimachalBanner />
    </footer>
  );
}

export default Footer;