import { useEffect, useState } from "react"
import Link from "next/link"
import { BugIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const FeedbackPopup = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    // Check sessionStorage to see if the popup was previously closed
    const isPopupShown = sessionStorage.getItem("isFeedbackPopupShown")
    if (isPopupShown === "false" || isPopupShown === null) {
      sessionStorage.setItem("isFeedbackPopupShown", "false")
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem("isFeedbackPopupShown", "true")
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-[300px] rounded-sm border border-ink/15 bg-paper p-4 text-ink shadow-[4px_4px_0_0_hsl(var(--ink)/0.7)]">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Have a complaint or want to help develop our app?
              </p>
              <p className="text-sm text-ink/70">
                Please raise a report on our GitHub repository.
              </p>
            </div>
            <button
              onClick={handleClose}
              aria-label="Dismiss"
              className="shrink-0 text-ink/50 hover:text-ink"
            >
              <XIcon className="size-4" />
            </button>
          </div>
          <div className="mt-4">
            <Link
              href="https://github.com/ShaanCoding/makeread.me/issues"
              target="_blank"
              className="text-sm font-medium hover:underline"
              prefetch={false}
            >
              <Button variant="secondary" size="sm">
                <BugIcon className="mr-2 size-4" />
                Report an Issue
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default FeedbackPopup
