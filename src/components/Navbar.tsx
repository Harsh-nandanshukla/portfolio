"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { Menu, X } from "lucide-react";
import { content, type NavItem } from "@/data/content";
import { cn } from "@/lib/utils";

/*
 * Floating glass navbar (DESIGN.md §1).
 * - Hides while scrolling down, shows while scrolling up, always shown near the top.
 * - Links come from content.nav; "resume" entries render as the gradient button.
 * - Mobile (< md = 768px): name + menu icon; the menu is a small glass panel.
 */

/** Always show the navbar within this many px of the top of the page. */
const TOP_ZONE_PX = 64;
/** Ignore scroll movements smaller than this (stops flicker on tiny trackpad moves). */
const SCROLL_DELTA_PX = 6;
/** Fallback for browsers without the `scrollend` event. */
const NAV_SCROLL_LOCK_MS = 1200;
/** How far the navbar slides up when hidden (its height + top gap, with room to spare). */
const HIDE_OFFSET_PX = -96;

const PANEL_ID = "mobile-nav-panel";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-1";

const linkClass = cn(
  "rounded-full px-4 py-2 text-sm text-text-muted transition-colors hover:text-text",
  focusRing,
);

const resumeClass = cn(
  "rounded-full bg-gradient px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90",
  focusRing,
);

export function Navbar() {
  const { nav, identity, sections, ui } = content;
  const sectionLinks = nav.filter((item) => item.kind === "section");
  const resumeLinks = nav.filter((item) => item.kind === "resume");

  const reduce = useReducedMotion() ?? false;
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  /** True while a nav click is scrolling the page, so the navbar doesn't hide mid-jump. */
  const navScrollLock = useRef(false);

  // Scroll direction: compare the new scroll position with the previous one.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const delta = latest - previous;

    if (latest < TOP_ZONE_PX) {
      setHidden(false);
    } else if (navScrollLock.current || open) {
      setHidden(false);
    } else if (delta > SCROLL_DELTA_PX) {
      setHidden(true);
    } else if (delta < -SCROLL_DELTA_PX) {
      setHidden(false);
    }
  });

  // Mobile menu: close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function lockWhileScrolling() {
    navScrollLock.current = true;
    const release = () => {
      navScrollLock.current = false;
    };
    window.addEventListener("scrollend", release, { once: true });
    window.setTimeout(release, NAV_SCROLL_LOCK_MS);
  }

  /** Smooth-scroll to an on-page section (instant under reduced motion). */
  function handleLinkClick(event: MouseEvent<HTMLAnchorElement>, item: NavItem) {
    setOpen(false);
    if (item.kind !== "section" || !item.href.startsWith("#")) return;

    const target = document.getElementById(item.href.slice(1));
    if (!target) return;

    event.preventDefault();
    setHidden(false);
    lockWhileScrolling();
    target.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" });
    // Move keyboard focus to the section without a second jump, and update the URL hash.
    target.focus({ preventScroll: true });
    window.history.pushState(null, "", item.href);
  }

  const transition = reduce ? { duration: 0 } : { duration: 0.25, ease: "easeOut" as const };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <motion.div
        ref={rootRef}
        className="pointer-events-auto relative w-full md:w-auto"
        initial={false}
        animate={hidden ? { y: HIDE_OFFSET_PX, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={transition}
        // Keyboard users tabbing into a hidden navbar bring it back.
        onFocusCapture={() => setHidden(false)}
      >
        <nav aria-label={ui.navAriaLabel}>
          <div className="flex items-center justify-between gap-1 rounded-full border border-border bg-surface/70 p-1.5 backdrop-blur-md">
            {/* Mobile: name */}
            <a
              href={`#${sections.hero.id}`}
              onClick={(event) =>
                handleLinkClick(event, { kind: "section", label: identity.name, href: `#${sections.hero.id}` })
              }
              className={cn("px-3 py-2 text-sm font-semibold text-text md:hidden", "rounded-full", focusRing)}
            >
              {identity.name}
            </a>

            {/* Desktop: links + resume */}
            <ul className="hidden items-center gap-1 md:flex">
              {sectionLinks.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={(event) => handleLinkClick(event, item)} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            {resumeLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(resumeClass, "ml-1 hidden md:inline-flex")}
              >
                {item.label}
              </a>
            ))}

            {/* Mobile: menu button */}
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={open ? ui.closeMenu : ui.openMenu}
              aria-expanded={open}
              aria-controls={PANEL_ID}
              onClick={() => setOpen((value) => !value)}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full text-text transition-colors hover:bg-surface-hover md:hidden",
                focusRing,
              )}
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>

          {/* Mobile: glass panel */}
          <AnimatePresence>
            {open && (
              <motion.div
                id={PANEL_ID}
                className="absolute inset-x-0 top-full mt-2 rounded-[20px] border border-border bg-surface/90 p-2 backdrop-blur-md md:hidden"
                initial={reduce ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
                transition={transition}
              >
                <ul className="flex flex-col gap-1">
                  {sectionLinks.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(event) => handleLinkClick(event, item)}
                        className={cn(linkClass, "block rounded-xl px-4 py-3 text-base")}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                  {resumeLinks.map((item) => (
                    <li key={item.href} className="pt-1">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className={cn(resumeClass, "block rounded-xl px-4 py-3 text-center text-base")}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.div>
    </div>
  );
}
