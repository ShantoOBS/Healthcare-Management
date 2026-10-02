import { CalendarRange } from "lucide-react";

export default function DoctorMySchedulesLoading() {
  return (
    <main className="doctor-management doctor-activity-page" aria-busy="true" aria-label="Loading doctor schedules">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true"><CalendarRange /></div>
        <div>
          <p className="doctor-management-eyebrow">Care practice</p>
          <h1>My schedules</h1>
          <p className="doctor-management-description">Track your assigned slots and availability.</p>
        </div>
      </header>
      <div className="doctor-activity-summary-skeleton"><span /><span /><span /></div>
      <div className="doctor-activity-panel">
        <div className="doctor-activity-toolbar-skeleton"><span /><span /><span /><span /></div>
        <div className="doctor-activity-list">
          {Array.from({ length: 5 }, (_, index) => <div className="doctor-activity-skeleton" key={index} />)}
        </div>
      </div>
    </main>
  );
}
