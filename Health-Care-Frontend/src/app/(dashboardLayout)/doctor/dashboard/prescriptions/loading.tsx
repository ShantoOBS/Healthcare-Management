import { FileText } from "lucide-react";

export default function DoctorPrescriptionsLoading() {
  return (
    <main className="doctor-management doctor-activity-page" aria-busy="true" aria-label="Loading prescriptions">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true"><FileText /></div>
        <div>
          <p className="doctor-management-eyebrow">Care records</p>
          <h1>My prescriptions</h1>
          <p className="doctor-management-description">Review prescriptions you have issued to patients.</p>
        </div>
      </header>
      <div className="doctor-prescription-list">
        {Array.from({ length: 3 }, (_, index) => <div className="doctor-activity-skeleton" key={index} />)}
      </div>
    </main>
  );
}
