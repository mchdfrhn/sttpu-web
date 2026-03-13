"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HomeAnimations({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Force scroll to top on refresh
    window.scrollTo(0, 0);

    // Refresh ScrollTrigger after initial mount/hydration
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
    });

    // Reveal sections on scroll
    const sections = gsap.utils.toArray("section") as HTMLElement[];
    
    sections.forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        }
      });
    });

    // Specific staggering for Faculty Cards
    gsap.from(".faculty-card", {
      opacity: 0,
      y: 40,
      stagger: 0.2,
      duration: 0.8,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: ".faculty-grid",
        start: "top 80%",
      }
    });

    // Stagger News Cards
    gsap.from(".news-card", {
      opacity: 0,
      scale: 0.95,
      y: 30,
      stagger: 0.15,
      duration: 0.8,
      scrollTrigger: {
        trigger: ".news-grid",
        start: "top 80%",
      }
    });

    // Stats counter animation (simple version)
    gsap.from(".stat-item", {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      scrollTrigger: {
        trigger: ".stats-section",
        start: "top 90%",
      }
    });

  }, { scope: container });

  return <div ref={container}>{children}</div>;
}
