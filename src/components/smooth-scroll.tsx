"use client";

import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";

export default function SmoothScroll() {
  useEffect(() => {
    // Memulai Locomotive Scroll v5 yang menggunakan Native Lenis
    const scroll = new LocomotiveScroll();

    return () => {
      // Hapus instances ketika unmount
      if (scroll && scroll.destroy) {
        scroll.destroy();
      }
    };
  }, []);

  return null;
}
