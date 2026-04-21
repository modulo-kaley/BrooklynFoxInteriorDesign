"use client";

import Image from "next/image";
import Link from "next/link";
// motion/react is the animation library (what used to be called framer-motion).
// It gives us special <motion.div>, <motion.span>, etc — they're normal
// elements with extra props for animation built in.
import { motion } from "motion/react";
import Vinyl from "./Vinyl";

// The little record-out-of-sleeve hover on the home screen. The vinyl sits
// behind the thumbnail (the "album cover") and slides up + tilts when you
// hover, so it looks like the record is being pulled out of its sleeve.
// pointer-events-none on the vinyl wrapper makes sure the whole tile still
// counts as one click target — you can't accidentally click the vinyl
// instead of the link.
//
// ? Eyeball in the browser: tune peek distance (y: -58%), tilt angle (8°),
// and the spring feel (stiffness 160 / damping 20). These numbers were
// picked blind — may want more peek, less tilt, or a snappier spring.
//
// TODO: Respect prefers-reduced-motion. If the viewer has reduced motion
// turned on, skip the slide/tilt (or snap to it without animation).
// Easiest way: import useReducedMotion from "motion/react" and swap the
// hover variant's y/rotate to 0 when it's true.
export default function HomeProjectTile({ slug, project }) {
  return (
    // ↓ OUTER motion wrapper: this is the thing you hover over.
    //   `initial` = which named state we start in
    //   `animate` = which state we sit at when idle
    //   `whileHover` = which state we pop into while the mouse is over us
    // The magic here: motion watches these state names and automatically
    // tells any child motion.div with matching `variants` to switch states
    // too. So hovering this wrapper drives the vinyl underneath without
    // us needing to manage hover state manually.
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative w-[clamp(160px,22vw,350px)] aspect-square"
    >
      {/*
        ↓ INNER motion div: the vinyl sitting behind the thumbnail.
        `variants` defines the two named poses:
          - rest:  no movement, no tilt (vinyl tucked inside the sleeve)
          - hover: slide up 58% of its own height + tilt 8° (record peeking out)
        We don't tell this div WHEN to switch — the outer wrapper does that.
        This div just says "here's what each state looks like."

        `transition` controls HOW it animates between states. Instead of a
        plain duration+easing curve, we use spring physics — the animation
        actually simulates a little spring pulling toward the target.
          stiffness: 160 → how strong the spring pulls (higher = snappier)
          damping:   20  → how much it resists bouncing (higher = calmer stop)
        Together these give a natural pop without a wobble.
      */}
      <motion.div
        variants={{
          rest: { y: "0%", rotate: 0 },
          hover: { y: "-58%", rotate: 8 },
        }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
      >
        <Vinyl color={project.vinylColor} size="100%" />
      </motion.div>

      <Link
        href={`/${slug}`}
        aria-label={`Enter ${project.title}`}
        className="absolute inset-0 z-10 block shadow-[0_12px_22px_rgba(0,0,0,0.55)] tile-hover overflow-hidden"
      >
        <Image
          src={project.thumb}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 50vw, 350px"
          className="object-cover"
          priority
        />
      </Link>
    </motion.div>
  );
}
