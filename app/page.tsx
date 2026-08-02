'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

/* Single source of truth for destinations. Re-point a route here and both the
   badge and its footer menu entry follow — they can never drift apart. */
const ROUTES = {
  /* The badge constellation itself — this landing page. */
  gateway: '/',
  /* The main Holy Nation site home (was HOLYNATION/index.html), opened by
     the crest badge. Served from public/holy-nation.html via a rewrite. */
  holyNation: '/holy-nation',
  /* All live pages, served from public/ via the rewrites in next.config.mjs. */
  apostolicHouse: '/apostolic-house',
  globalCollege: '/global-college',
  give: '/give',
  prayers: '/prayers-mission',
  networks: '/networks',
  operations: '/kingdom-operations',
  compassion: '/compassion',
  nationBuilding: '/country-development',
  thyKingdomCome: '/thykingdomcome',
  connect: '/connect'
} as const;

interface LogoItem {
  id: number;
  /** Full formal name — used for aria-label and image alt text. */
  label: string;
  /** Short name as printed on the badge artwork; also the footer menu text. */
  short: string;
  href: string;
  /** Whether this item gets a slot in the footer menu. */
  inNav: boolean;
  topPercent: number;
  leftPercent: number;
  widthPercent: number;
  heightPercent: number;
  delay: number;
  /** Parallax depth in px — larger badges read as "nearer" and travel further. */
  depth: number;
  src: string;
}

const logoItems: LogoItem[] = [
{
  id: 0,
  label: 'The Apostolic House & Ecclesia',
  short: 'Apostolic House',
  href: ROUTES.apostolicHouse,
  inNav: true,
  topPercent: 56.1,
  leftPercent: -1.1,
  widthPercent: 19.2,
  heightPercent: 37.0,
  delay: 0,
  depth: 30,
  src: '/asset/image/Apostolic House.png'
},
{
  id: 1,
  label: 'Global College of Apostolic Studies',
  short: 'Global College',
  href: ROUTES.globalCollege,
  inNav: true,
  topPercent: 37.3,
  leftPercent: 13.1,
  widthPercent: 14.4,
  heightPercent: 27.8,
  delay: 0.3,
  depth: 20,
  src: '/asset/image/Global College.png'
},
{
  id: 2,
  label: 'Apostolic Prayers & Mission',
  short: 'Prayers & Mission',
  href: ROUTES.prayers,
  inNav: true,
  topPercent: 22.5,
  leftPercent: -0.8,
  widthPercent: 16.7,
  heightPercent: 32.5,
  delay: 0.6,
  depth: 25,
  src: '/asset/image/Prayers & Mission.png'
},
{
  id: 3,
  label: 'Apostolic Networks',
  short: 'Networks',
  href: ROUTES.networks,
  inNav: true,
  topPercent: 0.5,
  leftPercent: 10.4,
  widthPercent: 15.1,
  heightPercent: 30.8,
  delay: 0.9,
  depth: 21,
  src: '/asset/image/Networks.png'
},
{
  id: 4,
  label: 'Kingdom Operations',
  short: 'Operations',
  href: ROUTES.operations,
  inNav: true,
  topPercent: 61.9,
  leftPercent: 84.6,
  widthPercent: 16.3,
  heightPercent: 31.1,
  delay: 1.2,
  depth: 24,
  src: '/asset/image/Operations.png'
},
{
  id: 5,
  label: 'Kingdom Compassion & Social Security',
  short: 'Compassion',
  href: ROUTES.compassion,
  inNav: true,
  topPercent: 0.5,
  leftPercent: 61.6,
  widthPercent: 15.0,
  heightPercent: 28.7,
  delay: 0.4,
  depth: 21,
  src: '/asset/image/Compassion.png'
},
{
  id: 6,
  label: 'Kingdom Country Development',
  short: 'Nation Building',
  href: ROUTES.nationBuilding,
  inNav: true,
  topPercent: 28.1,
  leftPercent: 65.2,
  widthPercent: 18.7,
  heightPercent: 38.0,
  delay: 0.7,
  depth: 29,
  src: '/asset/image/Nation Building.png'
},
{
  id: 7,
  label: 'ThyKingdomCome Movement',
  short: 'ThyKingdomCome',
  href: ROUTES.thyKingdomCome,
  inNav: true,
  topPercent: 0.5,
  leftPercent: 78.6,
  widthPercent: 22.6,
  heightPercent: 44.2,
  delay: 1.0,
  depth: 34,
  src: '/asset/image/ThyKingdomCome.png'
},
{
  id: 8,
  label: 'The Holy Nation',
  short: 'Holy Nation',
  href: ROUTES.holyNation,
  inNav: false,
  topPercent: 0.5,
  leftPercent: 23.8,
  widthPercent: 19.2,
  heightPercent: 36.3,
  delay: 1.3,
  depth: 32,
  src: '/asset/image/HOME.png'
},
{
  id: 9,
  label: 'Give',
  short: 'Give',
  href: ROUTES.give,
  inNav: true,
  topPercent: 65.5,
  leftPercent: 16.1,
  widthPercent: 14.3,
  heightPercent: 27.5,
  delay: 1.6,
  depth: 19,
  src: '/asset/image/Give.png'
},
{
  id: 10,
  label: 'Connect',
  short: 'Connect',
  href: ROUTES.connect,
  inNav: true,
  topPercent: 65.5,
  leftPercent: 72.1,
  widthPercent: 14.3,
  heightPercent: 27.5,
  delay: 1.9,
  depth: 19,
  src: '/asset/image/Connect.png'
}];


/* Footer menu mirrors the badges. Home is omitted (the crest carries it) and
   Give is forced last because it renders as the highlighted button. */
const navItems: LogoItem[] = [
...logoItems.filter((l) => l.inNav && l.short !== 'Give'),
...logoItems.filter((l) => l.inNav && l.short === 'Give')];


interface SocialItem {
  label: string;
  href: string;
  path: string;
}

/* TODO: swap the '#' placeholders for The Holy Nation's real profile URLs. */
const socialItems: SocialItem[] = [
{
  label: 'Facebook',
  href: '#',
  path: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z'
},
{
  label: 'Instagram',
  href: '#',
  path: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0z'
},
{
  label: 'YouTube',
  href: '#',
  path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
},
{
  label: 'X',
  href: '#',
  path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'
}];



export default function HomePage() {
  const [hoveredLogo, setHoveredLogo] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const heroRef = useRef<HTMLElement | null>(null);
  const pastorRef = useRef<HTMLDivElement | null>(null);
  const auraRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  /* Pointer target (-1..1) and the eased value that actually drives the DOM. */
  const targetRef = useRef({ x: 0, y: 0 });
  const easedRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const setItemRef = useCallback((el: HTMLDivElement | null, i: number) => {
    itemRefs.current[i] = el;
  }, []);

  /* Close the mobile menu on Escape, and stop the page scrolling behind it. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  /* ===== CURSOR PARALLAX =====
     A single rAF loop lerps toward the pointer and writes CSS custom properties
     straight onto the nodes — no React re-render per mousemove. Each badge has
     its own depth, so the constellation separates into layers as you move. */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (prefersReduced || !finePointer) return;

    const hero = heroRef.current;
    if (!hero) return;

    const handleMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // Normalise to -1..1 with the hero centre as origin.
      targetRef.current.x = (e.clientX - rect.left) / rect.width * 2 - 1;
      targetRef.current.y = (e.clientY - rect.top) / rect.height * 2 - 1;
    };

    const handleLeave = () => {
      targetRef.current.x = 0;
      targetRef.current.y = 0;
    };

    const EASE = 0.06;

    const tick = () => {
      const t = targetRef.current;
      const eased = easedRef.current;

      eased.x += (t.x - eased.x) * EASE;
      eased.y += (t.y - eased.y) * EASE;

      const cx = eased.x;
      const cy = eased.y;

      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const d = logoItems[i].depth;
        // Badges counter-move against the cursor — the classic depth cue.
        el.style.setProperty('--px', `${(-cx * d).toFixed(2)}px`);
        el.style.setProperty('--py', `${(-cy * d * 0.62).toFixed(2)}px`);
        el.style.setProperty('--rx', `${(cy * d * 0.1).toFixed(3)}deg`);
        el.style.setProperty('--ry', `${(-cx * d * 0.1).toFixed(3)}deg`);
      }

      // Foreground subject drifts *with* the cursor, slower — reinforces depth.
      if (pastorRef.current) {
        pastorRef.current.style.setProperty('--px', `${(cx * 12).toFixed(2)}px`);
        pastorRef.current.style.setProperty('--py', `${(cy * 6).toFixed(2)}px`);
      }

      // Ambient light follows the pointer so the scene feels lit by it.
      if (auraRef.current) {
        auraRef.current.style.setProperty('--ax', `${(50 + cx * 14).toFixed(2)}%`);
        auraRef.current.style.setProperty('--ay', `${(38 + cy * 12).toFixed(2)}%`);
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
    hero.addEventListener('mousemove', handleMove, { passive: true });
    hero.addEventListener('mouseleave', handleLeave);

    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      hero.removeEventListener('mousemove', handleMove);
      hero.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        :root {
          --hn-gold: #f0c000;
          --hn-gold-soft: #ffd75e;
          --hn-gold-pale: #ffe9a0;
          --hn-azure: #0090d8;
          --hn-azure-lit: #35b6ef;
          --hn-crest-red: #b81d2a;

          /* Deep royal blue — pulled from the badge azure and darkened into a
             regal base, so the icons sit inside their own colour family. */
          --hn-blue-900: #03121f;
          --hn-blue-800: #04182b;
          --hn-blue-700: #072742;
          --hn-blue-600: #0a3a5e;
          --hn-blue-500: #0e4c78;

          --hn-cream: #eef6fc;

          /* Nav height drives the gold rule and the badge field's bottom edge,
             so all three stay locked together when the bar wraps. */
          --nav-h: 56px;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          background: var(--hn-blue-900);
          overflow-x: hidden;
        }

        .hn-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(ellipse 120% 85% at 50% 32%,
              var(--hn-blue-600) 0%,
              var(--hn-blue-700) 38%,
              var(--hn-blue-800) 68%,
              var(--hn-blue-900) 100%);
        }

        /* ===== AMBIENT AURA =====
           Pointer-tracked light bloom. Azure core, gold rim, sapphire falloff —
           this is what makes the field read as lit rather than flat. */
        .aura {
          position: fixed;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          --ax: 50%;
          --ay: 38%;
          background:
            radial-gradient(ellipse 70% 55% at var(--ax) var(--ay),
              rgba(53, 182, 239, 0.16) 0%,
              rgba(0, 144, 216, 0.09) 32%,
              transparent 66%),
            radial-gradient(ellipse 55% 42% at var(--ax) calc(var(--ay) + 8%),
              rgba(240, 192, 0, 0.10) 0%,
              rgba(240, 192, 0, 0.04) 38%,
              transparent 68%);
          mix-blend-mode: screen;
        }

        /* Slow-breathing nebula so the field is never completely static. */
        .nebula {
          position: fixed;
          inset: -10%;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(circle 38vw at 18% 22%, rgba(14, 76, 120, 0.55) 0%, transparent 62%),
            radial-gradient(circle 34vw at 84% 30%, rgba(10, 58, 94, 0.5) 0%, transparent 62%),
            radial-gradient(circle 46vw at 50% 92%, rgba(4, 24, 43, 0.75) 0%, transparent 70%);
          animation: nebula-drift 34s ease-in-out infinite alternate;
          filter: blur(6px);
        }

        @keyframes nebula-drift {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(-1.5%, 1.2%, 0) scale(1.05); }
          100% { transform: translate3d(1.5%, -1%, 0) scale(1.02); }
        }

        /* ===== VIDEO BG ===== */
        .video-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 1;
          overflow: hidden;
        }

        /* Blue-tinted scrim instead of the old near-black wash. */
        .video-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(4, 24, 43, 0.80) 0%,
            rgba(7, 39, 66, 0.58) 40%,
            rgba(4, 24, 43, 0.74) 70%,
            rgba(3, 18, 31, 0.95) 100%
          );
          z-index: 1;
        }

        .video-bg video {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 100%;
          min-height: 100%;
          width: auto;
          height: auto;
          transform: translate(-50%, -50%);
          object-fit: cover;
          filter: brightness(0.42) saturate(0.7) hue-rotate(-8deg);
        }

        .video-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 50% 42%, rgba(240, 192, 0, 0.08) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 100%, rgba(0, 144, 216, 0.14) 0%, transparent 60%);
          z-index: 2;
          pointer-events: none;
        }

        /* ===== MAIN CONTENT ===== */
        .main-content {
          position: relative;
          z-index: 10;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
        }

        /* ===== PASTOR IMAGE ===== */
        .pastor-container {
          position: absolute;
          bottom: 20px;
          left: 50%;
          z-index: 20;
          pointer-events: none;
          width: 42%;
          max-width: 560px;
          min-width: 320px;
          --px: 0px;
          --py: 0px;
          transform: translateX(-50%) translate3d(var(--px), var(--py), 0);
          will-change: transform;
        }

        .pastor-container img {
          width: 100%;
          height: auto;
          display: block;
          filter:
            drop-shadow(0 0 26px rgba(255, 215, 94, 0.28))
            drop-shadow(0 0 54px rgba(0, 144, 216, 0.30))
            drop-shadow(0 18px 48px rgba(2, 12, 22, 0.9));
          transform: scale(1.08);
          transform-origin: center bottom;
        }

        /* ===== FLOATING BADGES ===== */
        /* Sits ABOVE .pastor-container (z-index 20) so no badge is ever
           swallowed by the portrait on narrower viewports. */
        /* Inset from the viewport edges so the outermost lenses (and their
           glow) never clip against the window. All badge %s resolve against
           this box, so one inset fixes every edge at once. */
        .logos-section {
          position: absolute;
          top: 3%;
          left: 2%;
          right: 2%;
          bottom: calc(var(--nav-h) + 8px);
          z-index: 22;
          perspective: 1100px;
        }

        /* Layer 1 — parallax translation (driven by rAF via CSS vars). */
        .logo-item {
          position: absolute;
          cursor: pointer;
          --px: 0px;
          --py: 0px;
          --rx: 0deg;
          --ry: 0deg;
          transform: translate3d(var(--px), var(--py), 0);
          will-change: transform;
          transform-style: preserve-3d;
        }

        /* Layer 2 — idle float keyframes, kept separate so parallax and float
           never fight over the same transform property. */
        .logo-float {
          width: 100%;
          height: 100%;
          /* Needed so the .logos-section perspective reaches the tilt on
             .logo-link — without it the rotate renders as a flat skew. */
          transform-style: preserve-3d;
        }

        /* Layer 3 — hover scale + pointer-driven tilt. */
        .logo-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          text-decoration: none;
          position: relative;
          transform: rotateX(var(--rx)) rotateY(var(--ry));
          scale: 1;
          transition: scale 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          transform-style: preserve-3d;
        }

        .logo-item:hover .logo-link,
        .logo-item:focus-within .logo-link {
          scale: 1.11;
        }

        .logo-link:focus-visible {
          outline: 2px solid var(--hn-gold-soft);
          outline-offset: 6px;
          border-radius: 50%;
        }

        /* Square stage inside the (non-square) slot. container-type: size lets
           the lens size itself off min(width, height) via cq units, so it stays
           a true circle at every viewport instead of stretching to an ellipse. */
        .logo-stage {
          position: absolute;
          inset: 0;
          container-type: size;
        }

        /* ===== GLASS LENS =====
           A real lens: backdrop-filter refracts the background behind it, a
           specular highlight sits upper-left where the light is, and the lower
           rim falls into shadow. */
        .logo-lens {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(100cqw, 100cqh);
          aspect-ratio: 1 / 1;
          translate: -50% -50%;
          border-radius: 50%;
          backdrop-filter: blur(4px) saturate(1.3) brightness(1.05);
          -webkit-backdrop-filter: blur(4px) saturate(1.3) brightness(1.05);
          background:
            radial-gradient(circle at 34% 26%,
              rgba(200, 236, 255, 0.26) 0%,
              rgba(120, 200, 240, 0.09) 30%,
              transparent 56%),
            radial-gradient(circle at 50% 58%,
              rgba(14, 76, 120, 0.24) 0%,
              rgba(5, 30, 52, 0.38) 68%,
              rgba(3, 18, 31, 0.50) 100%);
          box-shadow:
            inset 0 2px 2px rgba(226, 244, 255, 0.30),
            inset 0 -14px 30px rgba(3, 18, 31, 0.48),
            inset 0 0 0 1px rgba(120, 200, 240, 0.20),
            0 14px 36px rgba(2, 10, 20, 0.42),
            0 0 46px rgba(0, 144, 216, 0.13);
          transition: box-shadow 0.55s ease, background 0.55s ease,
                      backdrop-filter 0.55s ease, -webkit-backdrop-filter 0.55s ease;
          pointer-events: none;
        }

        .logo-item:hover .logo-lens,
        .logo-item:focus-within .logo-lens {
          backdrop-filter: blur(2px) saturate(1.5) brightness(1.16);
          -webkit-backdrop-filter: blur(2px) saturate(1.5) brightness(1.16);
          box-shadow:
            inset 0 2px 3px rgba(232, 248, 255, 0.45),
            inset 0 -14px 30px rgba(3, 18, 31, 0.40),
            inset 0 0 0 1px rgba(150, 214, 248, 0.38),
            0 18px 44px rgba(2, 10, 20, 0.48),
            0 0 72px rgba(53, 182, 239, 0.28);
        }

        /* Broken arc ring riding the lens rim, drifting slowly. */
        .logo-arc {
          position: absolute;
          top: 50%;
          left: 50%;
          width: calc(min(100cqw, 100cqh) * 1.07);
          aspect-ratio: 1 / 1;
          translate: -50% -50%;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            transparent 0 6%,
            rgba(53, 182, 239, 0.55) 6% 21%,
            transparent 21% 47%,
            rgba(53, 182, 239, 0.32) 47% 57%,
            transparent 57% 77%,
            rgba(53, 182, 239, 0.48) 77% 87%,
            transparent 87% 100%
          );
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px));
          animation: arc-spin 34s linear infinite;
          opacity: 0.5;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .logo-item:hover .logo-arc,
        .logo-item:focus-within .logo-arc {
          opacity: 0.95;
        }

        @keyframes arc-spin {
          to { rotate: 360deg; }
        }

        .badge-img {
          position: absolute;
          top: 50%;
          left: 50%;
          translate: -50% -50%;
          width: 94%;
          height: 94%;
          object-fit: contain;
          filter: drop-shadow(0 3px 12px rgba(2, 12, 22, 0.6));
          transition: filter 0.5s ease;
        }

        /* Hover lift — the badge itself brightens and throws a clean azure
           bloom. No ring: the artwork already has its own gold rim. */
        .logo-item:hover .badge-img,
        .logo-item:focus-within .badge-img {
          filter:
            brightness(1.1)
            drop-shadow(0 0 22px rgba(53, 182, 239, 0.5))
            drop-shadow(0 0 46px rgba(0, 144, 216, 0.32));
        }

        /* ===== NAV ===== */
        .hn-nav {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--nav-h);
          z-index: 104;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          padding: 0 6px;
          background: linear-gradient(to bottom, rgba(7, 39, 66, 0.86), rgba(4, 24, 43, 0.92));
          border-top: 1px solid rgba(240, 192, 0, 0.28);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .hn-nav::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(0, 144, 216, 0.55) 12%,
            rgba(240, 192, 0, 0.72) 35%,
            rgba(255, 215, 94, 0.98) 50%,
            rgba(240, 192, 0, 0.72) 65%,
            rgba(0, 144, 216, 0.55) 88%,
            transparent
          );
        }

        .nav-divider {
          flex: none;
          width: 1px;
          height: 18px;
          background: rgba(240, 192, 0, 0.3);
          margin: 0 clamp(1px, 0.16vw, 6px);
        }

        /* Type and padding scale with the viewport so all ten entries stay on
           one line without clipping, from 1280px up to ultrawide. */
        .hn-nav a {
          display: block;
          flex: none;
          color: rgba(238, 246, 252, 0.84);
          text-decoration: none;
          font-family: 'Cinzel', Baskerville, serif;
          font-size: clamp(8px, 0.62vw, 11px);
          font-weight: 500;
          letter-spacing: clamp(0.05em, 0.09vw, 0.16em);
          text-transform: uppercase;
          padding: 0 clamp(5px, 0.85vw, 20px);
          height: var(--nav-h);
          line-height: var(--nav-h);
          transition: color 0.3s ease, background 0.3s ease;
          white-space: nowrap;
          position: relative;
        }

        .hn-nav a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: linear-gradient(
            to right,
            rgba(0, 144, 216, 0.85),
            rgba(255, 215, 94, 1),
            rgba(0, 144, 216, 0.85)
          );
          transition: width 0.3s ease;
        }

        .hn-nav a:hover {
          color: var(--hn-gold-soft);
          background: rgba(0, 144, 216, 0.12);
        }

        .hn-nav a:hover::after {
          width: 60%;
        }

        /* Give — crest red with gold trim */
        .give-btn {
          background: linear-gradient(135deg, rgba(184, 29, 42, 0.88) 0%, rgba(140, 18, 30, 0.92) 100%) !important;
          border: 1px solid rgba(240, 192, 0, 0.68) !important;
          border-radius: 3px;
          margin: 0 8px;
          color: var(--hn-gold-pale) !important;
          letter-spacing: 0.22em !important;
          font-weight: 600 !important;
          padding: 0 24px !important;
          transition: background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease !important;
        }

        .give-btn:hover {
          background: linear-gradient(135deg, rgba(214, 38, 53, 0.96) 0%, rgba(168, 22, 36, 1) 100%) !important;
          box-shadow: 0 0 20px rgba(240, 192, 0, 0.45), 0 0 6px rgba(255, 215, 94, 0.3) !important;
          color: #fff3c4 !important;
        }

        .give-btn::after {
          display: none !important;
        }

        /* ===== FOOTER ===== */
        .hn-footer {
          position: relative;
          z-index: 20;
          width: 100%;
          height: 64px;
          background: var(--hn-blue-900);
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px solid rgba(240, 192, 0, 0.18);
        }

        .hn-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(0, 144, 216, 0.4) 30%,
            rgba(240, 192, 0, 0.45) 50%,
            rgba(0, 144, 216, 0.4) 70%,
            transparent
          );
        }

        /* ===== SOCIAL CHANNELS =====
           Small glass discs echoing the badge lens language. */
        .social-list {
          display: flex;
          align-items: center;
          gap: 16px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          color: rgba(238, 246, 252, 0.74);
          background:
            radial-gradient(circle at 34% 28%,
              rgba(200, 236, 255, 0.12) 0%,
              rgba(14, 76, 120, 0.18) 40%,
              rgba(5, 30, 52, 0.55) 100%);
          box-shadow:
            inset 0 1px 1px rgba(226, 244, 255, 0.18),
            inset 0 0 0 1px rgba(120, 200, 240, 0.22),
            0 3px 10px rgba(2, 10, 20, 0.45);
          transition: color 0.3s ease, box-shadow 0.4s ease,
                      background 0.4s ease, translate 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .social-link:hover {
          color: var(--hn-gold-soft);
          translate: 0 -3px;
          background:
            radial-gradient(circle at 34% 28%,
              rgba(232, 248, 255, 0.20) 0%,
              rgba(14, 76, 120, 0.26) 40%,
              rgba(5, 30, 52, 0.5) 100%);
          box-shadow:
            inset 0 1px 2px rgba(240, 248, 255, 0.30),
            inset 0 0 0 1px rgba(240, 192, 0, 0.5),
            0 0 20px rgba(240, 192, 0, 0.28),
            0 0 38px rgba(0, 144, 216, 0.22);
        }

        .social-link:focus-visible {
          outline: 2px solid var(--hn-gold-soft);
          outline-offset: 3px;
        }

        /* ===== FLOATING ANIMATION ===== */
        @keyframes float-0 {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          33% { transform: translate3d(-2px, -4px, 0px); }
          66% { transform: translate3d(2px, -2px, 0px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          33% { transform: translate3d(2px, -3px, 0px); }
          66% { transform: translate3d(-1px, 3px, 0px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          33% { transform: translate3d(1px, -5px, 0px); }
          66% { transform: translate3d(-3px, 2px, 0px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          33% { transform: translate3d(-3px, 2px, 0px); }
          66% { transform: translate3d(3px, -4px, 0px); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          33% { transform: translate3d(4px, -2px, 0px); }
          66% { transform: translate3d(-2px, 3px, 0px); }
        }
        @keyframes float-5 {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          33% { transform: translate3d(-1px, -4px, 0px); }
          66% { transform: translate3d(3px, 1px, 0px); }
        }
        @keyframes float-6 {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          33% { transform: translate3d(3px, -3px, 0px); }
          66% { transform: translate3d(-2px, -2px, 0px); }
        }
        @keyframes float-7 {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          33% { transform: translate3d(-4px, 2px, 0px); }
          66% { transform: translate3d(2px, -5px, 0px); }
        }
        @keyframes float-8 {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          33% { transform: translate3d(2px, -4px, 0px); }
          66% { transform: translate3d(-3px, 1px, 0px); }
        }
        @keyframes float-9 {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          33% { transform: translate3d(-2px, 3px, 0px); }
          66% { transform: translate3d(3px, -2px, 0px); }
        }
        @keyframes float-10 {
          0%, 100% { transform: translate3d(0px, 0px, 0px); }
          33% { transform: translate3d(3px, 2px, 0px); }
          66% { transform: translate3d(-2px, -4px, 0px); }
        }

        .logo-float-0 { animation: float-0 9s ease-in-out infinite; }
        .logo-float-1 { animation: float-1 11s ease-in-out infinite; }
        .logo-float-2 { animation: float-2 8s ease-in-out infinite; }
        .logo-float-3 { animation: float-3 10s ease-in-out infinite; }
        .logo-float-4 { animation: float-4 12s ease-in-out infinite; }
        .logo-float-5 { animation: float-5 9.5s ease-in-out infinite; }
        .logo-float-6 { animation: float-6 10.5s ease-in-out infinite; }
        .logo-float-7 { animation: float-7 8.5s ease-in-out infinite; }
        .logo-float-8 { animation: float-8 10s ease-in-out infinite; }
        .logo-float-9 { animation: float-9 9s ease-in-out infinite; }
        .logo-float-10 { animation: float-10 11.5s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .logo-float { animation: none !important; }
          .nebula { animation: none !important; }
          .logo-arc { animation: none !important; }
          .logo-item { transform: none !important; }
          .pastor-container { transform: translateX(-50%) !important; }
        }

        /* ===== CINEMATIC VIGNETTE ===== */
        .vignette {
          position: fixed;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          background: radial-gradient(
            ellipse at center,
            transparent 42%,
            rgba(3, 18, 31, 0.6) 100%
          );
        }

        /* ===== GOLD ACCENT LINE ===== */
        .gold-line {
          position: absolute;
          bottom: var(--nav-h);
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(240, 192, 0, 0.45) 20%,
            rgba(240, 192, 0, 0.45) 80%,
            transparent
          );
          z-index: 25;
        }

        /* ===== RESPONSIVE ===== */
        /* ===== MOBILE MENU (phones only) ===== */
        .nav-toggle {
          display: none;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 130;
          height: 56px;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(to bottom, rgba(7, 39, 66, 0.92), rgba(4, 24, 43, 0.96));
          border: none;
          border-top: 1px solid rgba(240, 192, 0, 0.3);
          color: var(--hn-gold-soft);
          font-family: 'Cinzel', Baskerville, serif;
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .burger {
          position: relative;
          width: 20px;
          height: 14px;
          display: inline-block;
        }

        .burger i {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: currentColor;
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.2s ease, top 0.3s ease;
        }

        .burger i:nth-child(1) { top: 0; }
        .burger i:nth-child(2) { top: 6px; }
        .burger i:nth-child(3) { top: 12px; }

        .burger.is-open i:nth-child(1) { top: 6px; transform: rotate(45deg); }
        .burger.is-open i:nth-child(2) { opacity: 0; }
        .burger.is-open i:nth-child(3) { top: 6px; transform: rotate(-45deg); }

        .mobile-menu {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 200;
          background:
            radial-gradient(ellipse 120% 80% at 50% 20%,
              var(--hn-blue-700) 0%, var(--hn-blue-800) 55%, var(--hn-blue-900) 100%);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 24px 20px 96px;
        }

        .mobile-menu nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-width: 460px;
          margin: 0 auto;
        }

        .mm-link {
          display: flex;
          align-items: center;
          min-height: 52px;
          padding: 0 18px;
          border-radius: 8px;
          color: var(--hn-cream);
          text-decoration: none;
          font-family: 'Cinzel', Baskerville, serif;
          font-size: 15px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.03);
          box-shadow: inset 0 0 0 1px rgba(120, 200, 240, 0.16);
        }

        .mm-link:active {
          background: rgba(0, 144, 216, 0.16);
        }

        .mm-home {
          color: var(--hn-gold-soft);
          box-shadow: inset 0 0 0 1px rgba(240, 192, 0, 0.4);
        }

        .mm-give {
          background: linear-gradient(135deg, rgba(184, 29, 42, 0.9), rgba(140, 18, 30, 0.94));
          color: var(--hn-gold-pale);
          box-shadow: inset 0 0 0 1px rgba(240, 192, 0, 0.6);
        }

        /* Below this, ten entries can't hold a single line — wrap to two rows
           rather than letting the ends clip off-screen. */
        @media (max-width: 1180px) {
          :root, .hn-page {
            --nav-h: 84px;
          }
          .hn-nav {
            flex-wrap: wrap;
            align-content: center;
            row-gap: 2px;
            padding: 6px 10px;
          }
          .hn-nav a {
            height: auto;
            line-height: 1.6;
            padding: 4px 10px;
            font-size: 10px;
            letter-spacing: 0.12em;
          }
          .hn-nav a::after {
            bottom: 2px;
          }
          .nav-divider {
            display: none;
          }
          .give-btn {
            padding: 4px 16px !important;
          }
        }

        /* ===== PHONES =====
           The scattered constellation is positioned in % of a 2.25:1 desktop
           canvas. On a ~0.5:1 phone those percentages collapse the badges to
           ~55px and pile 8 of 11 onto the portrait. So below 768px the whole
           field stops being absolutely positioned and becomes a normal grid. */
        @media (max-width: 768px) {
          .hero-section {
            height: auto;
            min-height: 0;
            padding-bottom: 56px;
          }

          /* Portrait becomes the hero, in normal flow. */
          .pastor-container {
            position: relative;
            bottom: auto;
            left: auto;
            transform: none !important;
            width: 78%;
            max-width: 340px;
            min-width: 0;
            margin: 8px auto 4px;
          }

          .pastor-container img {
            transform: none;
          }

          /* Field reflows: no absolute positioning, no perspective. */
          .logos-section {
            position: static;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
            padding: 4px 16px 24px;
            perspective: none;
          }

          .logo-item {
            position: static !important;
            width: auto !important;
            height: auto !important;
            aspect-ratio: 1 / 1;
            transform: none !important;
            z-index: auto !important;
          }

          /* The crest spans both columns as the lead item. */
          .logo-item:nth-child(9) {
            grid-column: 1 / -1;
            justify-self: center;
            width: 62% !important;
          }

          /* Idle float and 3D tilt are desktop affordances — off on touch. */
          .logo-float { animation: none !important; }
          .logo-link { transform: none !important; scale: 1 !important; }
          .logo-arc { animation: none !important; opacity: 0.6; }

          .gold-line { display: none; }

          /* Swap the cramped bar for the menu button. */
          .hn-nav { display: none; }
          .nav-toggle { display: flex; }
          .mobile-menu { display: none; }
          .mobile-menu.is-open { display: block; }

          .hn-footer {
            height: 64px;
          }
          .social-list {
            gap: 14px;
          }
          .social-link {
            width: 46px;
            height: 46px;
          }
        }

        @media (max-width: 480px) {
          :root, .hn-page {
            --nav-h: 56px;
          }
          .logos-section {
            gap: 12px;
            padding: 4px 12px 20px;
          }
          .pastor-container {
            width: 84%;
          }
          .mm-link {
            font-size: 14px;
            min-height: 50px;
          }
        }

        /* Very narrow phones — one badge per row so the wordmarks stay legible. */
        @media (max-width: 340px) {
          .logos-section {
            grid-template-columns: 1fr;
          }
          .logo-item:nth-child(9) {
            width: 100% !important;
          }
        }
      `}</style>

      <div className="hn-page">
        {/* Video Background */}
        <div className="video-bg">
          {/* TODO: replace with Pastor David Abraham's own hero background video */}
          <video autoPlay muted loop playsInline>
            <source
              src="/asset/video/hero-bg.mp4"
              type="video/mp4" />
          </video>
        </div>

        <div className="nebula" />
        <div className="aura" ref={auraRef} />
        <div className="vignette" />

        <main className="main-content">
          <section className="hero-section" ref={heroRef}>

            {/* Floating badges */}
            <div className="logos-section">
              {logoItems.map((logo, i) =>
              <div
                key={logo.id}
                className="logo-item"
                ref={(el) => setItemRef(el, i)}
                style={{
                  top: `${logo.topPercent}%`,
                  left: `${logo.leftPercent}%`,
                  width: `${logo.widthPercent}%`,
                  height: `${logo.heightPercent}%`,
                  zIndex: hoveredLogo === logo.id ? 50 : 15
                }}
                onMouseEnter={() => setHoveredLogo(logo.id)}
                onMouseLeave={() => setHoveredLogo(null)}>

                  <div
                  className={`logo-float logo-float-${logo.id}`}
                  style={{ animationDelay: `${logo.delay}s` }}>

                    <a className="logo-link" href={logo.href} aria-label={logo.label}>
                      <span className="logo-stage">
                        <span className="logo-arc" aria-hidden="true" />
                        <span className="logo-lens" aria-hidden="true" />
                        <img
                        className="badge-img"
                        src={encodeURI(logo.src)}
                        alt={logo.label}
                        loading={logo.id === 0 ? 'eager' : 'lazy'} />
                      </span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Pastor David Abraham */}
            <div className="pastor-container" ref={pastorRef}>
              <img
                src="/asset/image/no_image.png"
                alt="Pastor David Abraham"
                loading="eager" />
            </div>

            <div className="gold-line" />

            {/* Navigation */}
            {/* Phone-only trigger; the bar itself is hidden below 768px. */}
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="hn-mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}>

              <span className={`burger${menuOpen ? ' is-open' : ''}`} aria-hidden="true">
                <i /><i /><i />
              </span>
              <span className="nav-toggle-text">{menuOpen ? 'Close' : 'Menu'}</span>
            </button>

            <nav className="hn-nav" role="navigation" aria-label="Main navigation">
              {navItems.map((item, i) =>
              <React.Fragment key={item.id}>
                  {i > 0 && <span className="nav-divider" aria-hidden="true" />}
                  <a
                  href={item.href}
                  title={item.label}
                  className={item.short === 'Give' ? 'give-btn' : undefined}>

                    {item.short}
                  </a>
                </React.Fragment>
              )}
            </nav>

            {/* Full-screen menu panel — phones only */}
            <div
              className={`mobile-menu${menuOpen ? ' is-open' : ''}`}
              id="hn-mobile-menu"
              hidden={!menuOpen}>

              <nav aria-label="Site menu">
                <a
                  className="mm-link mm-home"
                  href={ROUTES.holyNation}
                  onClick={() => setMenuOpen(false)}>

                  The Holy Nation
                </a>
                {navItems.map((item) =>
                <a
                  key={item.id}
                  className={`mm-link${item.short === 'Give' ? ' mm-give' : ''}`}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}>

                    {item.short}
                  </a>
                )}
              </nav>
            </div>
          </section>

          {/* Footer — social channels */}
          <footer className="hn-footer">
            <ul className="social-list">
              {socialItems.map((s) =>
              <li key={s.label}>
                  <a
                  className="social-link"
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer">

                    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              )}
            </ul>
          </footer>
        </main>
      </div>
    </>);

}
