"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  Download,
  Eye,
  type LucideIcon,
  LayoutTemplate,
  MousePointerClick,
  SlidersHorizontal,
  Users,
} from "lucide-react"

import { siteConfig } from "@/config/site"

// Thin-stroke line icons replace the old filled cyan illustrations, which
// only read against a dark ground. Mapped by feature order.
const FEATURE_ICONS = [
  LayoutTemplate,
  SlidersHorizontal,
  MousePointerClick,
  Eye,
  Download,
  Users,
]

const KeyFeatures = () => {
  return (
    <div className="relative my-20">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Features
        </p>
        <h2 className="mt-2 font-display text-4xl font-semibold text-foreground md:text-5xl">
          What&apos;s in the case
        </h2>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        whileInView="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.3,
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {siteConfig.homePage.keyFeatures.map(
          (
            feature: { image: string; title: string; description: string },
            index: number
          ) => (
            <motion.div
              key={index}
              variants={{
                hidden: { y: 16, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <FeatureGridElement
                Icon={FEATURE_ICONS[index] ?? LayoutTemplate}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          )
        )}
      </motion.div>
    </div>
  )
}

interface IFeatureGridElement {
  Icon: LucideIcon
  title: string
  description: string
}

const FeatureGridElement: React.FC<IFeatureGridElement> = ({
  Icon,
  title,
  description,
}) => {
  return (
    <div className="h-full rounded-sm border border-border bg-card p-6">
      <Icon className="mb-4 size-8 text-primary" strokeWidth={1.5} />
      <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export default KeyFeatures
