"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import { siteConfig } from "@/config/site"

const Demo = () => {
  return (
    <div className="relative my-24 w-full">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          How it works
        </p>
        <h2 className="mt-2 font-display text-4xl font-semibold text-foreground md:text-5xl">
          The proof
        </h2>
      </div>
      <motion.div
        className="relative flex w-full items-center justify-center"
        viewport={{ once: true, amount: 0.5 }}
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="relative rounded-sm border border-ink/15 bg-paper p-2 shadow-[8px_8px_0_0_hsl(var(--ink)/0.85)] dark:shadow-[8px_8px_0_0_hsl(var(--paper)/0.5)] lg:w-3/4">
          <span className="register-mark absolute left-3 top-3 text-ink/30" aria-hidden />
          <span className="register-mark absolute bottom-3 right-3 text-ink/30" aria-hidden />
          <Image
            className="rounded-[1px]"
            width={1920}
            height={1080}
            src={siteConfig.homePage.demo}
            alt="The makeread.me generator, showing the block editor and live proof side by side"
          />
        </div>
      </motion.div>
    </div>
  )
}

export default Demo
