"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { siteConfig } from "@/config/site"

import { Button } from "../ui/button"

// Real content from the minimal-readme template's own defaults
// (backend/public/minimal-readme/blocks.ts) — the specimen a visitor sees
// is an actual block composition, not placeholder copy.
const SPECIMEN_TITLE = "Project Name"
const SPECIMEN_TAGLINE =
  "One line describing what this does and who it is for."
const SPECIMEN_INSTALL = "npm install your-package"

const Splashscreen = () => {
  return (
    <div className="relative my-8 flex w-full flex-col items-center gap-12 lg:my-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
      <motion.div
        className="w-full lg:w-1/2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {siteConfig.homePage.splashScreen.subtitle}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] text-foreground md:text-6xl">
          {siteConfig.homePage.splashScreen.title}
        </h1>
        <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
          {siteConfig.homePage.splashScreen.description}
        </p>
        <Link href={siteConfig.homePage.splashScreen.cta.href} className="mt-8 inline-block">
          <Button size="lg">{siteConfig.homePage.splashScreen.cta.title}</Button>
        </Link>
      </motion.div>

      {/* Type-specimen panel: an actual composed block, proofed on paper. */}
      <motion.div
        className="relative w-full max-w-md lg:w-1/2"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <div className="relative rounded-sm border border-ink/15 bg-paper bg-grain bg-repeat p-8 shadow-[6px_6px_0_0_hsl(var(--ink)/0.85)] dark:shadow-[6px_6px_0_0_hsl(var(--paper)/0.6)]">
          <span className="register-mark absolute right-4 top-4 text-ink/40" aria-hidden />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
            Proof — minimal-readme
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-ink">
            {SPECIMEN_TITLE}
          </h2>
          <p className="mt-2 text-sm text-ink/70">{SPECIMEN_TAGLINE}</p>
          <div className="mt-6 border-t border-ink/15 pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
              Installation
            </p>
            <pre className="mt-2 overflow-x-auto rounded-sm bg-ink/5 px-3 py-2 font-mono text-xs text-ink">
              $ {SPECIMEN_INSTALL}
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Splashscreen
