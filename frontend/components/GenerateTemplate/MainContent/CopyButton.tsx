import React, { useState } from "react"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

import { Button } from "@/components/ui/button"

const CopyButton: React.FC<{
  copiedText: string
  className?: string
  onClick?: () => void
}> = ({ copiedText, className, onClick }) => {
  const [isCopied, setIsCopied] = useState(false)

  return (
    <Button
      variant={"outline"}
      className={twMerge(className)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(copiedText)
          setIsCopied(true)
          setTimeout(() => {
            setIsCopied(false)
          }, 2000)
          if (onClick) onClick()
        } catch (error) {
          // Clipboard write failed (e.g., permission denied)
          console.error("Failed to copy to clipboard:", error)
        }
      }}
    >
      {isCopied ? (
        <CheckIcon className="mr-2 size-4" />
      ) : (
        <ClipboardIcon className="mr-2 size-4" />
      )}
      {isCopied ? "Copied!" : "Copy To Clipboard"}
    </Button>
  )
}

export default CopyButton
