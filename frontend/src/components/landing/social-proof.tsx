"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

const stats = [
  { value: 1200, suffix: "+", label: "视频创作者", icon: "🎬" },
  { value: 5, suffix: "万+", label: "视频已剪辑", icon: "✂️" },
  { value: 80, suffix: "%", label: "剪辑效率提升", icon: "⚡" },
  { value: 6, suffix: "大", label: "创作领域", icon: "🧩" },
]

function CountUp({ target, suffix, duration = 2 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current * 10) / 10)
      }
    }, (duration * 1000) / steps)
    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return (
    <span ref={ref}>
      {Number.isInteger(target) ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </span>
  )
}

export function SocialProof() {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <span className="text-2xl mb-3 block">{stat.icon}</span>
              <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
