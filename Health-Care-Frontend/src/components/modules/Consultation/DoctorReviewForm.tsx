"use client";

import { createReviewAction, updateReviewAction } from "@/app/_actions/review.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ICreateReviewPayload, type IUpdateReviewPayload } from "@/types/review.types";
import { LoaderCircle, Send, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DoctorReviewFormProps {
  initialAppointmentId?: string;
  showAppointmentId?: boolean;
  reviewId?: string;
  initialRating?: number;
  initialComment?: string | null;
  compact?: boolean;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

export default function DoctorReviewForm({
  initialAppointmentId = "",
  showAppointmentId = true,
  reviewId,
  initialRating = 0,
  initialComment = "",
  compact = false,
  onSubmitted,
  onCancel,
}: DoctorReviewFormProps) {
  const router = useRouter();
  const [appointmentId, setAppointmentId] = useState(initialAppointmentId);
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(reviewId);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rating) {
      toast.error("Choose a rating from 1 to 5 stars");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = isEditing
        ? await updateReviewAction(reviewId!, { rating, comment } satisfies IUpdateReviewPayload)
        : await createReviewAction({ appointmentId, rating, comment } satisfies ICreateReviewPayload);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(isEditing ? "Your review has been updated" : "Your review has been submitted");
      setRating(0);
      setComment("");
      onSubmitted?.();
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-5 ${compact ? "" : "mt-5 border-t border-[#e5ebe7] pt-5"}`}
    >
      {!compact && (
        <div>
          <h3 className="text-sm font-semibold text-[#333333]">
            {isEditing ? "Update your review" : "Write a review"}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Reviews are available to patients with a completed payment for this appointment.
          </p>
        </div>
      )}

      {showAppointmentId && (
        <div className="space-y-2">
          <label htmlFor="review-appointment-id" className="text-sm font-medium text-[#47484b]">
            Appointment ID
          </label>
          <Input
            id="review-appointment-id"
            value={appointmentId}
            onChange={(event) => setAppointmentId(event.target.value)}
            placeholder="01a0ede3-b0ce-769d-b94f-41e4783b7e93"
            autoComplete="off"
            required
          />
        </div>
      )}

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-[#47484b]">Rating</legend>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Rating from 1 to 5 stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
              aria-pressed={rating === value}
              className={`flex size-10 cursor-pointer items-center justify-center rounded-md text-amber-500 transition hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${rating === value ? "bg-amber-50" : ""}`}
            >
              <Star className="size-6" fill={rating >= value ? "currentColor" : "none"} />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating ? `${rating} / 5` : "Select a rating"}
          </span>
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="review-comment" className="text-sm font-medium text-[#47484b]">
          Comment
        </label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share your experience with this doctor"
          maxLength={2000}
          rows={compact ? 5 : 4}
          required
        />
      </div>

      <div className={`flex flex-wrap items-center gap-3 ${compact ? "justify-end border-t pt-4" : "justify-between"}`}>
        <span className="text-xs text-muted-foreground">{comment.length} / 2000</span>
        <div className="ml-auto flex items-center gap-2">
          {compact && onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
              className="cursor-pointer hover:bg-[#e6f3eb] hover:text-[#184b3d]"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="cursor-pointer bg-[#1f5c4b] text-white hover:bg-[#184b3d] active:bg-[#123d32]"
            disabled={isSubmitting || !appointmentId.trim() || !comment.trim() || !rating}
          >
          {isSubmitting ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {isSubmitting ? (isEditing ? "Saving..." : "Submitting...") : (isEditing ? "Save changes" : "Submit review")}
          </Button>
        </div>
      </div>
    </form>
  );
}