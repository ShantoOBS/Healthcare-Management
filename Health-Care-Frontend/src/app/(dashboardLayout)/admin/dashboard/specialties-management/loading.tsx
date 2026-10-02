import { Stethoscope } from "lucide-react";

export default function AdminsSpecialtiesManagementLoading() {
  return (
    <div className="doctor-management" aria-busy="true" aria-label="Loading specialties">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true"><Stethoscope /></div>
        <div>
          <p className="doctor-management-eyebrow">Clinical taxonomy</p>
          <h1>Specialties</h1>
          <p className="doctor-management-description">
            Manage medical departments and their directory icons.
          </p>
        </div>
      </header>
      <div className="doctor-management-table specialties-management-table">
        <div className="specialties-toolbar">
          <span className="h-9 w-full max-w-sm rounded-md bg-[#edf2ee]" />
          <span className="h-9 w-36 rounded-md bg-[#edf2ee]" />
        </div>
        <div className="specialties-loading-rows">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="specialties-loading-row" key={index}>
              <span className="specialties-loading-icon" />
              <span className="specialties-loading-title" />
              <span className="specialties-loading-date" />
              <span className="specialties-loading-action" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
