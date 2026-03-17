"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  as?: "h1" | "h2" | "h3" | "p" | "span"
}

const container = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.04,
      delayChildren: delay,
    },
  }),
}

const child = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function AnimatedText({ text, className, delay = 0, as: Tag = "h2" }: AnimatedTextProps) {
  const words = text.split("")

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      className={cn("inline-block", className)}
    >
      {words.map((char, i) => (
        <motion.span key={i} variants={child} className="inline-block">
          <Tag className={className}>{char === " " ? "\u00A0" : char}</Tag>
        </motion.span>
      ))}
    </motion.div>
  )
}

// Simpler line-by-line version
export function AnimatedLines({
  lines,
  className,
  delay = 0,
}: {
  lines: string[]
  className?: string
  delay?: number
}) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {line}
        </motion.div>
      ))}
    </div>
  )
}
