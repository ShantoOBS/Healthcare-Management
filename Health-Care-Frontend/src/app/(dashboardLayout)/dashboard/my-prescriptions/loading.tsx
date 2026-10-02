import { FileText } from "lucide-react";

export default function MyPrescriptionsLoading() {
  return (
    <main className="patient-prescriptions" aria-busy="true" aria-label="Loading prescriptions">
      <header className="patient-prescriptions-header">
        <div className="patient-prescriptions-heading">
          <div className="patient-prescriptions-mark" aria-hidden="true"><FileText /></div>
          <div>
            <p className="patient-prescriptions-eyebrow">Your care records</p>
            <h1>My prescriptions</h1>
            <p>Review your instructions and keep your follow-up dates close.</p>
          </div>
        </div>
        <span className="patient-prescriptions-count-skeleton" />
      </header>
      <div className="patient-prescription-list" aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="patient-prescription-card" key={index}>
            <div className="patient-prescription-card-heading">
              <div className="flex items-center gap-3">
                <span className="patient-prescription-skeleton-avatar" />
                <div className="grid gap-2">
                  <span className="patient-prescription-skeleton-line wide" />
                  <span className="patient-prescription-skeleton-line short" />
                </div>
              </div>
              <span className="patient-prescription-skeleton-line medium" />
            </div>
            <span className="patient-prescription-skeleton-block" />
          </div>
        ))}
      </div>
    </main>
  );
}