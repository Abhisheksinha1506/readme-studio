import Link from "next/link"

import { siteConfig } from "@/config/site"

const Footer = () => {
  return (
    <div className="mt-20 w-full border-t border-ink/15 bg-ink px-6 pb-6 pt-16 text-paper xl:px-20">
      <div className="flex flex-col items-start justify-start gap-10 lg:flex-row lg:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">
            {siteConfig.footer.title}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-paper/70">
            {siteConfig.footer.description}
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wide text-paper/50">
              Quick Links
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {siteConfig.footer.quickLinks.map((quickLink, index) => (
                <QuickLinks key={index} {...quickLink} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-wide text-paper/50">
              Social
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {siteConfig.footer.socialMedia.map((socialMedia, index) => (
                <SocialMedia key={index} {...socialMedia} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-12 border-t border-paper/15 pt-5 text-center font-mono text-xs text-paper/50">
        © ShaanCoding 2023 - {new Date().getFullYear()}. All rights reserved.
      </p>
    </div>
  )
}

interface IQuickLinks {
  title: string
  href: string
}

const QuickLinks: React.FC<IQuickLinks> = ({ title, href }) => {
  return (
    <Link href={href} className="text-sm text-paper/80 hover:text-paper">
      {title}
    </Link>
  )
}

interface ISocialMedia {
  icon: string
  name: string
  url: string
}

const SocialMedia: React.FC<ISocialMedia> = ({ icon, name, url }) => {
  return (
    <Link
      href={url}
      className="flex items-center gap-2 text-sm text-paper/80 hover:text-paper"
    >
      <img className="size-4 invert" src={icon} alt="" />
      {name}
    </Link>
  )
}

export default Footer
