"use client"

import { Mail, Printer, Share2 } from "lucide-react"
import { toast } from "sonner"

type DoctorProfileActionsProps = {
  doctorName: string
  email?: string
}

const actionButtonClassName =
  "flex h-9 w-9 items-center justify-center rounded-full bg-[#4ca27a] cursor-pointer text-white transition hover:bg-[#3f8d68]"

const DoctorProfileActions = ({ doctorName, email }: DoctorProfileActionsProps) => {
  const handleShare = async () => {
    const shareData = {
      title: doctorName,
      text: `View profile of ${doctorName}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return
        }
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Profile link copied to clipboard")
    } catch {
      toast.error("Unable to share this profile")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        aria-label="Share doctor profile"
        className={actionButtonClassName}
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
      </button>

      {email ? (
        <a
          href={`mailto:${email}`}
          aria-label="Email doctor"
          className={actionButtonClassName}
        >
          <Mail className="h-4 w-4" />
        </a>
      ) : (
        <button
          type="button"
          aria-label="Email doctor"
          className={`${actionButtonClassName} cursor-not-allowed opacity-50`}
          disabled
        >
          <Mail className="h-4 w-4" />
        </button>
      )}

      <button
        type="button"
        aria-label="Print doctor profile"
        className={actionButtonClassName}
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4" />
      </button>
    </div>
  )
}

export default DoctorProfileActions
