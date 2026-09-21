import PublicNavbar from "@/components/shared/PublicNavbar";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNavbar />
      {children}
    </div>
  );
}
