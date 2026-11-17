import {
  DM_Sans as FontSans,
  Fraunces as FontDisplay,
  IBM_Plex_Mono as FontMono,
} from "next/font/google"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontDisplay = FontDisplay({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
})

export const fontMono = FontMono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
})
