"use client";

import { getMyReviews } from "@/services/review.services";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { MessageSquareText, Star, UserRound } from "lucide-react";

const DoctorReviewsList = () => {
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["doctor-my-reviews"],
    queryFn: getMyReviews,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });
  const reviews = response?.data ?? [];
  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : 0;

  return (
    <main className="doctor-management doctor-activity-page">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true"><MessageSquareText /></div>
        <div>
          <p className="doctor-management-eyebrow">Patient feedback</p>
          <h1>My reviews</h1>
          <p className="doctor-management-description">Read feedback patients have left after their visits.</p>
        </div>
        <div className="doctor-management-count" aria-live="polite">
          <strong>{isLoading ? "—" : reviews.length}</strong>
          <span>reviews</span>
        </div>
      </header>

      {!isLoading && !isError && reviews.length > 0 && (
        <section className="doctor-review-summary" aria-label="Review rating summary">
          <Star aria-hidden="true" />
          <strong>{averageRating.toFixed(1)}</strong>
          <span>Average rating from {reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
        </section>
      )}

      {isError && <p className="doctor-activity-error" role="alert">Reviews could not be loaded. Please refresh.</p>}
      {isLoading ? (
        <div className="doctor-review-list" aria-label="Loading reviews">
          {Array.from({ length: 4 }, (_, index) => <div className="doctor-activity-skeleton" key={index} />)}
        </div>
      ) : !isError && reviews.length === 0 ? (
        <div className="doctor-activity-empty">
          <MessageSquareText aria-hidden="true" />
          <h2>No reviews yet</h2>
          <p>Patient feedback will appear here after a visit is reviewed.</p>
        </div>
      ) : !isError && (
        <section className="doctor-review-list" aria-label="Patient reviews">
          {reviews.map((review) => (
            <article className="doctor-review-item" key={review.id}>
              <header className="doctor-review-header">
                <div className="doctor-review-patient">
                  <div className="doctor-review-avatar" aria-hidden="true">
                    {review.patient?.name
                      ? review.patient.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("")
                      : <UserRound />}
                  </div>
                  <div className="min-w-0">
                    <h2>{review.patient?.name || "Patient"}</h2>
                    <p>{review.patient?.email || "Verified patient"}</p>
                  </div>
                </div>
                <div className="doctor-review-rating" aria-label={`${review.rating} out of 5 stars`}>
                  <Star aria-hidden="true" />
                  <strong>{review.rating.toFixed(1)}</strong>
                </div>
              </header>
              <p className="doctor-review-comment">{review.comment || "No written comment."}</p>
              <footer className="doctor-review-footer">
                <span>Appointment · {review.appointment?.id?.slice(0, 8) || "—"}</span>
                <time dateTime={new Date(review.createdAt).toISOString()}>
                  {format(new Date(review.createdAt), "MMM dd, yyyy")}
                </time>
              </footer>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default DoctorReviewsList;