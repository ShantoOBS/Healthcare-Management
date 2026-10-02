"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyPrescriptions } from "@/services/prescription.services";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowUpRight, CalendarClock, FileText, Stethoscope } from "lucide-react";
import Link from "next/link";

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Not specified";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not specified" : format(date, "MMM dd, yyyy");
};

const MyPrescriptionsList = () => {
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["my-prescriptions"],
    queryFn: getMyPrescriptions,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });
  const prescriptions = response?.data ?? [];

  return (
    <main className="patient-prescriptions">
      <header className="patient-prescriptions-header">
        <div className="patient-prescriptions-heading">
          <div className="patient-prescriptions-mark" aria-hidden="true">
            <FileText />
          </div>
          <div>
            <p className="patient-prescriptions-eyebrow">Your care records</p>
            <h1>My prescriptions</h1>
            <p>Review your instructions and keep your follow-up dates close.</p>
          </div>
        </div>
        <div className="patient-prescriptions-count" aria-live="polite">
          <strong>{isLoading ? "—" : prescriptions.length}</strong>
          <span>prescriptions</span>
        </div>
      </header>

      {isError && (
        <div className="patient-prescriptions-error" role="alert">
          Prescriptions could not be loaded. Please refresh and try again.
        </div>
      )}

      {isLoading ? (
        <div className="patient-prescription-list" aria-label="Loading prescriptions">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="patient-prescription-card" key={index}>
              <div className="patient-prescription-card-heading">
                <div className="flex min-w-0 items-center gap-3">
                  <Skeleton className="size-10 rounded-lg" />
                  <div className="grid gap-2">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-2.5 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-28" />
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : !isError && prescriptions.length === 0 ? (
        <section className="patient-prescriptions-empty">
          <div className="patient-prescriptions-mark" aria-hidden="true"><Stethoscope /></div>
          <h2>No prescriptions yet</h2>
          <p>Prescriptions from your completed visits will appear here.</p>
          <Button asChild>
            <Link href="/dashboard/my-appointments">View my appointments</Link>
          </Button>
        </section>
      ) : (
        <section className="patient-prescription-list" aria-label="Your prescriptions">
          {prescriptions.map((prescription) => (
            <article className="patient-prescription-card" key={prescription.id}>
              <header className="patient-prescription-card-heading">
                <div className="patient-prescription-doctor">
                  <div className="patient-prescription-doctor-mark" aria-hidden="true">
                    <Stethoscope />
                  </div>
                  <div className="min-w-0">
                    <p className="patient-prescription-label">Prescribed by</p>
                    <h2>{prescription.doctor?.name || "Your doctor"}</h2>
                    <span>{prescription.doctor?.email || "Healthcare provider"}</span>
                  </div>
                </div>
                <div className="patient-prescription-dates">
                  <div>
                    <span>Issued</span>
                    <strong>{formatDate(prescription.createdAt)}</strong>
                  </div>
                  <div>
                    <CalendarClock aria-hidden="true" />
                    <span>Follow-up</span>
                    <strong>{formatDate(prescription.followUpDate)}</strong>
                  </div>
                </div>
              </header>

              <div className="patient-prescription-instructions">
                <p className="patient-prescription-label">Instructions</p>
                <p>{prescription.instructions || "No additional instructions provided."}</p>
              </div>

              <footer className="patient-prescription-footer">
                <span className="patient-prescription-reference">
                  Prescription · {prescription.id.slice(0, 8)}
                </span>
                {prescription.pdfUrl ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={prescription.pdfUrl} target="_blank" rel="noreferrer">
                      View PDF <ArrowUpRight aria-hidden="true" />
                    </a>
                  </Button>
                ) : (
                  <span className="patient-prescription-unavailable">PDF unavailable</span>
                )}
              </footer>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default MyPrescriptionsList;