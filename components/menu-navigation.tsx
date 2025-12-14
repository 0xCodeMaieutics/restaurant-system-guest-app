"use client";

import { useState, useRef } from "react";

interface MenuNavigationProps {
  sections: string[];
}

// Smooth scroll animation function using easing
function smoothScrollTo(targetY: number, duration: number = 800) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  // Easing function (ease-in-out-cubic)
  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

export function MenuNavigation({ sections }: MenuNavigationProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const isScrollingRef = useRef<boolean>(false);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate scroll position accounting for fixed nav height (~96px with padding)
      const rect = element.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const offsetTop = rect.top + scrollTop - 120; // Account for fixed nav height

      // Set scrolling flag to prevent observer from interfering
      isScrollingRef.current = true;

      // Smooth scroll with animation
      smoothScrollTo(offsetTop, 800);

      // Update active section immediately for better UX
      setActiveSection(sectionId);

      // Reset flag after animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 850);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        WebkitTransform: "translate3d(0, 0, 0)",
        transform: "translate3d(0, 0, 0)",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        willChange: "transform",
      }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-wrap gap-2 py-3 justify-center md:justify-center">
          {sections.map((sectionTitle) => {
            const sectionId = sectionTitle.toLowerCase().replace(/\s+/g, "-");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={sectionTitle}
                href={`#${sectionId}`}
                onClick={(e) => handleClick(e, sectionId)}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/80 hover:text-primary-foreground"
                }`}
              >
                {sectionTitle}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
