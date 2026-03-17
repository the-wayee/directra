"use client"

import { LandingNavbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { SocialProof } from "@/components/landing/social-proof"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { DualMode } from "@/components/landing/dual-mode"
import { Skills } from "@/components/landing/skills"
import { DemoShowcase } from "@/components/landing/demo-showcase"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <DualMode />
      <Skills />
      <DemoShowcase />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  )
}
