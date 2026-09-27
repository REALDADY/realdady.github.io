"use client";

import { useEffect, useRef, type RefObject } from "react";
import { setScrollLock } from "./use-motion-system";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/** The page chrome that becomes inert while a modal surface is open. */
export const SITE_CONTENT_ID = "site-content";

/**
 * Modal behaviour shared by the case-study dialog and the command palette:
 * focus moves in and is trapped, Escape closes, the page behind is inert and
 * does not scroll, and focus returns to the trigger on close.
 */
export function useModal(
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const siteContent = document.getElementById(SITE_CONTENT_ID);
    siteContent?.setAttribute("inert", "");
    setScrollLock(true);
    (initialFocusRef?.current ?? container.querySelector<HTMLElement>(FOCUSABLE) ?? container).focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((element) => element.offsetParent !== null || element === document.activeElement);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      siteContent?.removeAttribute("inert");
      setScrollLock(false);
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [containerRef, initialFocusRef]);
}
