"use client";

import { useState } from "react";
import Link from "next/link";
// motion/react
// Spinning vinyl trick: just `animate` pointing at a changing number.
import { motion } from "motion/react";
import Vinyl from "./Vinyl";

// The little corner "next / prev" button, shared by the intro screens and
// every section. Each hover bumps a spin counter by one, so the vinyl
// always rotates forward a full turn — it never unwinds backwards when
// your mouse leaves, which just looks nicer.
//
// ? Eyeball in the browser: 0.9s per spin may feel too slow or too snappy.
// The ease curve [0.22, 1, 0.36, 1] is tuned to feel like a record
// coasting to a stop — worth playing with if the vibe isn't right.
//
// TODO: **Possible Future Addition** Respect prefers-reduced-motion. For viewers with reduced motion
// turned on, skip incrementing spins (or render a plain <Vinyl /> without
// the motion wrapper). motion/react exports useReducedMotion() for this.
//
// ? framer-motion is still sitting in node_modules as a transitive dep,
// even though we only declared `motion` in package.json. Harmless for now,
// worth revisiting if the bundle ever feels heavier than it should.
export default function VinylNavLink({
  href,
  label,
  color,
  direction = "next",
  ariaLabel,
}) {
  const isPrev = direction === "prev";
  // Logic Breakdown: the `spins` state is just a number that counts how many times the vinyl has been hovered over. 
  // Each hover increments it by one, and we use that number to calculate the target rotation angle for the vinyl. 
  // The motion.div then animates the rotation to spins * 360 degrees, 
  // creating a smooth spinning effect that always moves forward, regardless of how many times you hover over it. 
  const [spins, setSpins] = useState(0);

  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? label}
      onMouseEnter={() => setSpins((n) => n + 1)}
      className={`fixed ${
        isPrev ? "left-6 items-start" : "right-6 items-end"
      } bottom-6 z-20 flex flex-col gap-2 text-white/90 hover:text-white transition`}
    >
      <span className="text-xs tracking-[0.2em] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
        {isPrev ? `← ${label}` : `${label} →`}
      </span>
      {/*
        motion.div with `animate` watching a value:
          animate={{ rotate: spins * 360 }}
            → whenever `spins` changes, motion interpolates the rotate
              property from wherever it currently is to the new target.
              spins=1 → rotate to 360°
              spins=2 → rotate to 720° (another full turn forward)
              ...and so on.

        transition controls how fast + with what curve:
          duration: 0.9     → nine-tenths of a second per spin
          ease: [0.22, 1, 0.36, 1]
            → a cubic-bezier curve. Those four numbers are the two control
              points of a bezier (x1, y1, x2, y2). This particular one
              starts fast and eases out smoothly at the end — think of a
              record spinning up and then coasting to a stop.
      */}
      <motion.div
        animate={{ rotate: spins * 360 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <Vinyl color={color} size={110} />
      </motion.div>
    </Link>
  );
}
