"use client"

import React from "react"
import { motion } from "framer-motion"

import { siteConfig } from "@/config/site"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const Testimonials = () => {
  return (
    <div className="my-20">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Testimonials
        </p>
        <h2 className="mt-2 font-display text-4xl font-semibold text-foreground md:text-5xl">
          What people compose
        </h2>
      </div>

      <motion.div
        className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ y: 16, opacity: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {siteConfig.homePage.testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            name={testimonial.name}
            imageURL={testimonial.imageURL}
            title={testimonial.title}
            testimony={testimonial.testimony}
          />
        ))}
      </motion.div>
    </div>
  )
}

interface ITestimonialCard {
  name: string
  imageURL: string
  title: string
  testimony: string
}

const TestimonialCard: React.FC<ITestimonialCard> = ({
  name,
  imageURL,
  title,
  testimony,
}) => {
  return (
    <div className="flex h-full flex-col rounded-sm border border-ink/15 bg-paper p-6 text-ink shadow-[4px_4px_0_0_hsl(var(--ink)/0.7)]">
      <p className="font-display text-lg leading-snug">
        &ldquo;{testimony.replace(/^"|"$/g, "")}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-ink/15 pt-4">
        <Avatar className="size-9 rounded-sm">
          <AvatarImage src={imageURL} alt={name} />
          <AvatarFallback className="rounded-sm">.ME</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-mono text-xs font-medium">{name}</p>
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink/50">
            {title}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Testimonials
