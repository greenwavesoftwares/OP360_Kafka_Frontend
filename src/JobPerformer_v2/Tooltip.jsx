import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "./Tooltip.css";

// ---------------------------------------------------------------
// Universal tooltip for the Job / Activity board.
//
//   <Tooltip content="Start activity">
//     <button aria-label="Start activity">…</button>
//   </Tooltip>
//
// Behaviour (follows the common Radix / MUI / Material conventions):
//   • Opens on hover after a short delay, and instantly on keyboard focus.
//   • Once one tooltip has been open, neighbours open with no delay
//     ("warm-up"), so sweeping across a toolbar feels snappy.
//   • Closes on mouse leave, blur, Escape, click, scroll and resize.
//   • Hovering the tooltip itself keeps it open (WCAG 1.4.13 "hoverable").
//   • Rendered in a portal with fixed positioning, so it is never
//     clipped by the `overflow: hidden / auto` containers used in
//     the panels, tables and popovers of this board.
//   • Auto-flips to the opposite side and is clamped to the viewport.
//   • Touch: no hover tooltips (they'd be sticky); focus still works.
//   • Wires up aria-describedby / role="tooltip".
//
// The child must be a single DOM element (button, span, a, div…).
// Wrap function components in a span, or spread props onto a DOM node.
// NOTE: disabled buttons don't fire mouse events in browsers — wrap
// them in a <span> and put the Tooltip around the span.
// ---------------------------------------------------------------

const GAP = 8; // distance between trigger and tooltip
const EDGE = 8; // minimum distance to viewport edge
const DEFAULT_DELAY = 400;
const WARM_WINDOW = 500; // ms during which a new tooltip opens instantly

// Module-level so all tooltips share it.
let lastClosedAt = 0;
let closeActive = null; // closes the currently open tooltip (only one at a time)

function computePosition(triggerRect, tipRect, placement) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const fits = {
    top: triggerRect.top - GAP - tipRect.height >= EDGE,
    bottom: triggerRect.bottom + GAP + tipRect.height <= vh - EDGE,
    left: triggerRect.left - GAP - tipRect.width >= EDGE,
    right: triggerRect.right + GAP + tipRect.width <= vw - EDGE,
  };
  const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" };
  const side = fits[placement] ? placement : fits[opposite[placement]] ? opposite[placement] : placement;

  let top;
  let left;
  if (side === "top" || side === "bottom") {
    top = side === "top" ? triggerRect.top - GAP - tipRect.height : triggerRect.bottom + GAP;
    left = triggerRect.left + triggerRect.width / 2 - tipRect.width / 2;
  } else {
    left = side === "left" ? triggerRect.left - GAP - tipRect.width : triggerRect.right + GAP;
    top = triggerRect.top + triggerRect.height / 2 - tipRect.height / 2;
  }

  // Clamp inside the viewport; the arrow is re-aimed at the trigger centre.
  left = Math.max(EDGE, Math.min(left, vw - EDGE - tipRect.width));
  top = Math.max(EDGE, Math.min(top, vh - EDGE - tipRect.height));

  let arrow;
  if (side === "top" || side === "bottom") {
    const centre = triggerRect.left + triggerRect.width / 2 - left;
    arrow = { left: Math.max(10, Math.min(centre, tipRect.width - 10)) };
  } else {
    const centre = triggerRect.top + triggerRect.height / 2 - top;
    arrow = { top: Math.max(10, Math.min(centre, tipRect.height - 10)) };
  }

  return { top, left, side, arrow };
}

export default function Tooltip({
  content,
  children,
  placement = "top",
  delay = DEFAULT_DELAY,
  disabled = false,
  maxWidth = 260,
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);

  const triggerRef = useRef(null); // the DOM node of the child
  const tipRef = useRef(null);
  const timerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const hasContent = content !== undefined && content !== null && content !== "" && content !== false;
  const enabled = hasContent && !disabled;

  const clearTimers = () => {
    clearTimeout(timerRef.current);
    clearTimeout(closeTimerRef.current);
  };

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(closeTimerRef.current);
    setOpen((wasOpen) => {
      if (wasOpen) lastClosedAt = Date.now();
      return false;
    });
    setPos(null);
    if (closeActive === hide) closeActive = null;
  }, []);

  const show = useCallback(
    (immediate) => {
      clearTimeout(closeTimerRef.current);
      clearTimeout(timerRef.current);
      const wait = immediate || Date.now() - lastClosedAt < WARM_WINDOW ? 0 : delay;
      timerRef.current = setTimeout(() => {
        if (closeActive && closeActive !== hide) closeActive();
        closeActive = hide;
        setOpen(true);
      }, wait);
    },
    [delay, hide],
  );

  // Small grace period so the pointer can travel onto the tooltip itself.
  const scheduleHide = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(hide, 80);
  }, [hide]);

  // Position after the tooltip has been painted once (so we can measure it).
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !tipRef.current) return;
    setPos(computePosition(triggerRef.current.getBoundingClientRect(), tipRef.current.getBoundingClientRect(), placement));
  }, [open, placement, content]);

  // Global dismissal.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && hide();
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", hide, true); // capture: catches inner scrollers
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [open, hide]);

  // Cleanup on unmount (e.g. the row/card disappears while hovered).
  useEffect(
    () => () => {
      clearTimers();
      if (closeActive === hide) closeActive = null;
    },
    [hide],
  );

  // Turned off while open (content emptied / disabled) → close.
  useEffect(() => {
    if (!enabled && open) hide();
  }, [enabled, open, hide]);

  if (children === undefined || children === null) return null;
  if (!enabled) return children;

  // Tooltips need exactly one DOM element to attach to. If we're given
  // text, several siblings or a fragment, wrap them in an inline-flex span.
  const isSingleDomElement = isValidElement(children) && typeof children.type === "string";
  const anchor = isSingleDomElement ? (
    children
  ) : (
    <span className="jab-tooltip-anchor">{children}</span>
  );

  const childProps = anchor.props;
  // Call the child's own handler first, then ours.
  const chain = (name, fn) => (e) => {
    childProps[name]?.(e);
    fn(e);
  };

  const trigger = cloneElement(anchor, {
    "aria-describedby": open ? [childProps["aria-describedby"], id].filter(Boolean).join(" ") : childProps["aria-describedby"],
    onPointerEnter: chain("onPointerEnter", (e) => {
      triggerRef.current = e.currentTarget;
      if (e.pointerType === "touch") return; // no sticky tooltips on touch
      show(false);
    }),
    onPointerLeave: chain("onPointerLeave", (e) => {
      if (e.pointerType !== "touch") scheduleHide();
    }),
    onFocus: chain("onFocus", (e) => {
      triggerRef.current = e.currentTarget;
      // Only keyboard focus (not the focus that follows a mouse click).
      if (e.currentTarget.matches?.(":focus-visible") !== false) show(true);
    }),
    onBlur: chain("onBlur", hide),
    onClick: chain("onClick", hide),
  });

  const tip =
    open &&
    createPortal(
      <div
        ref={tipRef}
        id={id}
        role="tooltip"
        className={`jab-tooltip${pos ? ` jab-tooltip--${pos.side} jab-tooltip--visible` : ""}`}
        style={{ top: pos?.top ?? 0, left: pos?.left ?? 0, maxWidth }}
        onPointerEnter={() => clearTimeout(closeTimerRef.current)}
        onPointerLeave={scheduleHide}
      >
        {content}
        <span className="jab-tooltip__arrow" style={pos?.arrow} />
      </div>,
      document.body,
    );

  return (
    <>
      {trigger}
      {tip}
    </>
  );
}
