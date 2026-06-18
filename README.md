# NOVA — Marketing Site

A single-page, dark-mode, motion-heavy marketing site for the fictional deep-tech
company **NOVA**. Every section is a full-viewport WebGL scene with its own
particle animation, tied together with scroll-driven entrances and smooth scrolling.

## Stack

- **React + Vite + TypeScript**
- **Tailwind CSS** for styling (glassmorphism, brand gradient, dark mode)
- **Three.js** via **@react-three/fiber** + **@react-three/drei**
- **@react-three/postprocessing** for bloom/glow
- **GSAP + ScrollTrigger** for scroll-driven reveals
- **Lenis** for smooth scrolling

All motion respects `prefers-reduced-motion`: scenes fall back to static
gradients and smooth scroll / scroll animations are disabled.

## Scenes

| # | Section      | Animation                                                            |
|---|--------------|----------------------------------------------------------------------|
| 1 | Navbar       | Floating glass pill, blur/scale-in on load                           |
| 2 | Hero         | Starfield + morphing ribbon "river" of particles, cursor parallax    |
| 3 | Orb          | Torus + core point shells with plasma filament rings, bloom          |
| 4 | Performance  | Vertical particle vortex/fountain + glass stat cards                 |
| 5 | Terrain      | Rippling dot-wave dune grid, drifting camera                         |
| 6 | CTA / Footer | Particles converging into an hourglass + email capture + footer      |

## Performance

- All visuals use a single `THREE.Points` buffer per cloud (no per-particle meshes).
- Particle counts and DPR scale down by device tier (mobile / tablet / desktop).
- Each scene's WebGL canvas is mounted only when scrolled near the viewport
  (`IntersectionObserver`), so at most a couple of contexts are live at once.

## Develop

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

## Structure

```
src/
  components/   Navbar, ProgressBar, Reveal, Eyebrow, SceneSection, icons
  scenes/       HeroScene, OrbScene, PerformanceScene, TerrainScene, CtaScene, Starfield
  sections/     Section overlays composing copy + the matching scene
  hooks/        useLenis, useReducedMotion, useDeviceTier, useInView
  lib/          palette (brand gradient helpers)
```
