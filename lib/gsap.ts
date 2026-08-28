export async function loadGsap() {
  const [gsapMod, scrollTriggerMod] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger")
  ]);

  const gsap = gsapMod.default;
  gsap.registerPlugin(scrollTriggerMod.ScrollTrigger);

  return { gsap, ScrollTrigger: scrollTriggerMod.ScrollTrigger };
}
