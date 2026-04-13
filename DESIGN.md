# Design Brief

## Tone & Purpose
Cinematic ultra-premium 3D portfolio showcasing creative web developer talent. Every interaction demands animation, visual feedback, and sound. AAA game/movie aesthetic.

## Color Palette
| Name | OKLCH | Purpose |
|------|-------|---------|
| Background | 0.06 0 0 | Near-black deep space foundation |
| Primary (Cyan) | 0.75 0.31 262 | Neon electric accent, CTAs, glows |
| Secondary (Purple) | 0.68 0.25 303 | Supporting accent, hover states |
| Accent (Magenta) | 0.72 0.27 247 | Interactive highlights, emphasis |
| Foreground | 0.95 0 0 | White text, high contrast |
| Muted | 0.18 0 0 | Dark overlays, subtle backgrounds |
| Border | 0.2 0 0 | Subtle dividers with alpha blend |
| Chart-1 to 5 | Cyan/Purple/Magenta spectrum | Data visualization accent colors |

## Typography
| Layer | Family | Usage |
|-------|--------|-------|
| Display | General Sans | Bold headings, logo text, interactive labels (700–900 weight) |
| Body | General Sans | Paragraphs, card content, section text (400–600 weight) |
| Mono | Geist Mono | Glitch effects, code snippets, technical accents |

Hierarchy: H1 (3.5rem bold), H2 (2.5rem bold), H3 (1.75rem semi-bold), Body (1rem regular), Caption (0.875rem muted).

## Structural Zones
| Zone | Treatment | Pattern |
|------|-----------|---------|
| Header/Nav | Glassmorphic overlay | `backdrop-blur-md bg-black/20 border-white/10` with cyan glow on hover |
| Hero | Full viewport section | Centered large heading, floating 3D object, animated TR logo |
| Content Section | Dark card-based grid | Alternating left/right layout, card with `bg-card border-border/20` |
| Footer | Minimal dark overlay | `bg-background/80 border-t border-border/10` with social icons |

## Component Patterns
- **Buttons**: Magnetic glowing effect, `border-primary/40 hover:border-primary/80 hover:shadow-glow-cyan`, text-white uppercase tracking-wider
- **Cards**: `bg-card border border-white/10 rounded-lg shadow-glow-cyan hover:shadow-glow-purple transition-all`
- **Glassmorphic UI**: `backdrop-blur-md bg-black/20 border border-white/10 rounded-lg`
- **Text Glows**: `text-glow-cyan`, `text-glow-purple` utilities for emphasis
- **Custom Cursor**: Glowing dot + outer ring in cyan, visible on interactive elements

## Motion
Timeline-based sequences via GSAP: scroll-driven camera parallax, section fade-in on scroll, staggered text reveals, glitch letter animations. UI transitions via Framer Motion (300ms cubic-bezier). Button interactions: scale (1.02–1.05), glow pulse. Sounds synchronized: ambient loop, click/hover effects, transition whoosh.

## Elevation & Depth
Layered z-index strategy: background stars (z-10) → 3D scene (z-20) → floating cards (z-30) → modals/overlays (z-40) → cursor (z-50). Parallax depth on scroll for 3D immersion. Subtle inner shadows on cards for depression effect.

## Constraints
- Dark mode only (no light mode); pure black background for OLED efficiency
- Mobile: 3D simplified, sound muted by default, touch targets ≥48px
- Accessibility: all glows and animations respect `prefers-reduced-motion`
- Performance: 60 FPS target, lazy-load 3D assets, throttle particle effects on lower-end devices

## Signature Detail
Holographic edge-glow effect on cards: dual-layer box-shadow (outer cyan, inner purple alpha glow) creates premium, floating impression. Combined with smooth transitions and always-listening sound cues, every click feels intentional and luxurious.
