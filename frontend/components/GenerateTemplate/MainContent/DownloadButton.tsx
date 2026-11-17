import React from "react"
import { CheckIcon, DownloadIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

import { Button } from "@/components/ui/button"

const DownloadButton: React.FC<{
  downloadText: string
  fileName: string
  className?: string
  onClick?: () => void
}> = ({ downloadText, fileName, className, onClick }) => {
  const [isDownloaded, setIsDownloaded] = React.useState(false)

  return (
    <Button
      variant={"outline"}
      className={twMerge(className)}
      onClick={() => {
        const element = document.createElement("a")
        const file = new Blob([downloadText], { type: "text/plain" })
        const url = URL.createObjectURL(file)
        element.href = url
        element.download = `${fileName}`
        document.body.appendChild(element)
        element.click()

        setIsDownloaded(true)
        if (onClick) onClick()

        setTimeout(() => {
          setIsDownloaded(false)
        }, 2000)

        // Clean up
        document.body.removeChild(element)
        URL.revokeObjectURL(url)
      }}
    >
      {isDownloaded ? (
        <CheckIcon className="mr-2 size-4" />
      ) : (
        <DownloadIcon className="mr-2 size-4" />
      )}
      {isDownloaded ? "Downloaded!" : "Download ReadME"}
    </Button>
  )
}

export default DownloadButton
