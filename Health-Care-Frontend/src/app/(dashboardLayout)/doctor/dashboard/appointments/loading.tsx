import { CalendarDays } from "lucide-react";

export default function DoctorAppointmentsLoading() {
  return (
    <main className="doctor-management doctor-activity-page" aria-busy="true" aria-label="Loading appointments">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true"><CalendarDays /></div>
        <div>
          <p className="doctor-management-eyebrow">Care practice</p>
          <h1>My appointments</h1>
          <p className="doctor-management-description">Review your scheduled visits and patient details.</p>
        </div>
      </header>
      <div className="doctor-activity-summary-skeleton">
        <span /><span /><span />
      </div>
      <div className="doctor-activity-panel">
        <div className="doctor-activity-toolbar-skeleton"><span /><span /><span /><span /></div>
        <div className="doctor-activity-list">
          {Array.from({ length: 5 }, (_, index) => <div className="doctor-activity-skeleton" key={index} />)}
        </div>
      </div>
    </main>
  );
}
