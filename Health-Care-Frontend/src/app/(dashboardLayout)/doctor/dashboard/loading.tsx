export default function DoctorDashboardLoading() {
  return (
    <main className="admin-analytics role-dashboard" aria-busy="true" aria-label="Loading doctor dashboard">
      <header className="admin-analytics-heading">
        <div>
          <p className="admin-analytics-eyebrow">Care practice</p>
          <h1>Doctor Dashboard</h1>
          <p>A clear view of your appointments, patients, and outcomes.</p>
        </div>
        <span className="admin-analytics-live-state"><span aria-hidden="true" />Loading data</span>
      </header>
      <section className="admin-analytics-metrics" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <article className="admin-analytics-metric" key={index}>
            <div className="admin-analytics-metric-topline"><span>Loading metric</span><span /></div>
            <span className="admin-analytics-value-skeleton" />
            <p>Loading summary</p>
          </article>
        ))}
      </section>
      <section className="admin-analytics-charts" aria-hidden="true">
        <div className="admin-analytics-chart admin-analytics-bar-chart">
          <div className="admin-analytics-chart-header"><span className="h-4 w-40 rounded bg-[#edf2ee]" /></div>
          <div className="admin-analytics-chart-content"><div className="doctor-activity-skeleton h-full" /></div>
        </div>
        <div className="admin-analytics-chart admin-analytics-pie-chart">
          <div className="admin-analytics-chart-header"><span className="h-4 w-36 rounded bg-[#edf2ee]" /></div>
          <div className="admin-analytics-chart-content flex items-center justify-center"><span className="h-40 w-40 rounded-full border-[1.25rem] border-[#edf2ee]" /></div>
        </div>
      </section>
    </main>
  );
}
