import PublicLayoutShell from "@/components/shared/PublicLayoutShell";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PublicLayoutShell>{children}</PublicLayoutShell>
  );
}
