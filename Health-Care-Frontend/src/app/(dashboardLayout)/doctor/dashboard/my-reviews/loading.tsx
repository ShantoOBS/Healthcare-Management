import { MessageSquareText } from "lucide-react";

export default function DoctorMyReviewsLoading() {
  return (
    <main className="doctor-management doctor-activity-page" aria-busy="true" aria-label="Loading reviews">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true"><MessageSquareText /></div>
        <div>
          <p className="doctor-management-eyebrow">Patient feedback</p>
          <h1>My reviews</h1>
          <p className="doctor-management-description">Read feedback patients have left after their visits.</p>
        </div>
      </header>
      <div className="doctor-review-list">
        {Array.from({ length: 4 }, (_, index) => <div className="doctor-activity-skeleton" key={index} />)}
      </div>
    </main>
  );
}
