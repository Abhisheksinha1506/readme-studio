"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { siteConfig } from "@/config/site"

import { Button } from "../ui/button"

const CallToAction = () => {
  return (
    <motion.div
      className="relative my-20 flex flex-col items-center gap-6 rounded-sm border border-ink/15 bg-ink px-8 py-16 text-center text-paper"
      initial={{ y: 16, opacity: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <span className="register-mark absolute left-6 top-6 text-paper/30" aria-hidden />
      <span className="register-mark absolute bottom-6 right-6 text-paper/30" aria-hidden />
      <h2 className="max-w-xl font-display text-3xl font-semibold leading-tight md:text-4xl">
        {siteConfig.homePage.callToAction.title}
      </h2>
      <Link href={siteConfig.homePage.callToAction.url.href}>
        {/* On the ink ground, the stamp shadow must read in paper, not ink. */}
        <Button
          size="lg"
          className="shadow-[3px_3px_0_0_hsl(var(--paper))] hover:shadow-[2px_2px_0_0_hsl(var(--paper))]"
        >
          {siteConfig.homePage.callToAction.url.title}
        </Button>
      </Link>
    </motion.div>
  )
}

export default CallToAction
