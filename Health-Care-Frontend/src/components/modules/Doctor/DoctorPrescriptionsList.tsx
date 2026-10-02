"use client";

import { Button } from "@/components/ui/button";
import { getMyPrescriptions } from "@/services/prescription.services";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowUpRight, FileText, Stethoscope } from "lucide-react";

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Not specified";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not specified" : format(date, "MMM dd, yyyy");
};

const DoctorPrescriptionsList = () => {
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["doctor-my-prescriptions"],
    queryFn: getMyPrescriptions,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });
  const prescriptions = response?.data ?? [];

  return (
    <main className="doctor-management doctor-activity-page">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true"><FileText /></div>
        <div>
          <p className="doctor-management-eyebrow">Care records</p>
          <h1>My prescriptions</h1>
          <p className="doctor-management-description">Review prescriptions you have issued to patients.</p>
        </div>
        <div className="doctor-management-count" aria-live="polite">
          <strong>{isLoading ? "—" : prescriptions.length}</strong>
          <span>prescriptions</span>
        </div>
      </header>

      {isError && <p className="doctor-activity-error" role="alert">Prescriptions could not be loaded. Please refresh.</p>}
      {isLoading ? (
        <div className="doctor-prescription-list" aria-label="Loading prescriptions">
          {Array.from({ length: 3 }, (_, index) => <div className="doctor-activity-skeleton" key={index} />)}
        </div>
      ) : !isError && prescriptions.length === 0 ? (
        <div className="doctor-activity-empty">
          <Stethoscope aria-hidden="true" />
          <h2>No prescriptions issued</h2>
          <p>Prescriptions you create for patients will appear here.</p>
        </div>
      ) : !isError && (
        <section className="doctor-prescription-list" aria-label="Prescriptions issued by you">
          {prescriptions.map((prescription) => (
            <article className="doctor-prescription-item" key={prescription.id}>
              <header className="doctor-prescription-header">
                <div className="doctor-appointment-main">
                  <div className="doctor-appointment-avatar" aria-hidden="true">
                    {(prescription.patient?.name || "P").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("")}
                  </div>
                  <div className="min-w-0">
                    <span className="doctor-activity-eyebrow">Patient</span>
                    <h2>{prescription.patient?.name || "Patient"}</h2>
                    <p>{prescription.patient?.email || "No email listed"}</p>
                  </div>
                </div>
                <div className="doctor-prescription-dates">
                  <div><span>Issued</span><strong>{formatDate(prescription.createdAt)}</strong></div>
                  <div><span>Follow-up</span><strong>{formatDate(prescription.followUpDate)}</strong></div>
                </div>
              </header>
              <div className="doctor-prescription-instructions">
                <span>Instructions</span>
                <p>{prescription.instructions || "No instructions recorded."}</p>
              </div>
              <footer className="doctor-prescription-footer">
                <span>Prescription · {prescription.id.slice(0, 8)}</span>
                {prescription.pdfUrl ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={prescription.pdfUrl} target="_blank" rel="noreferrer">
                      View PDF <ArrowUpRight aria-hidden="true" />
                    </a>
                  </Button>
                ) : <span className="text-xs text-muted-foreground">PDF unavailable</span>}
              </footer>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default DoctorPrescriptionsList;