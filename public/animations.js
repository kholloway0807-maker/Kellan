gsap.registerPlugin(ScrollTrigger, SplitText);

document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Hero headline reveal — characters stagger up, slow luxury pace
  const heroHeadline = document.querySelector('.hero-headline');
  if (heroHeadline) {
    const split = new SplitText(heroHeadline, { type: 'chars' });
    gsap.from(split.chars, {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.04,
    });
  }

  // Scroll-triggered .reveal elements — fade and slide up once
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      },
    });
  });

  // Staggered children of .stagger-group
  gsap.utils.toArray('.stagger-group').forEach((group) => {
    gsap.from(group.children, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: group,
        start: 'top 80%',
        once: true,
      },
    });
  });

  // Hover lift — subtle scale and lift, no bounce
  document.querySelectorAll('.hover-lift').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, { scale: 1.02, y: -4, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    });
  });
});
