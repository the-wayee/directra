"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GradientBlobProps {
  className?: string
  color?: "violet" | "blue" | "pink" | "amber"
  size?: "sm" | "md" | "lg"
}

const colorMap = {
  violet: "from-violet-200/60 to-violet-300/40",
  blue: "from-blue-200/60 to-indigo-200/40",
  pink: "from-pink-200/60 to-rose-200/40",
  amber: "from-amber-200/60 to-orange-100/40",
}

const sizeMap = {
  sm: "w-64 h-64",
  md: "w-96 h-96",
  lg: "w-[32rem] h-[32rem]",
}

export function GradientBlob({ className, color = "violet", size = "md" }: GradientBlobProps) {
  return (
    <motion.div
      className={cn(
        "absolute rounded-full bg-gradient-to-br blur-3xl pointer-events-none",
        colorMap[color],
        sizeMap[size],
        className
      )}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -40, 20, 0],
        scale: [1, 1.05, 0.95, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}
