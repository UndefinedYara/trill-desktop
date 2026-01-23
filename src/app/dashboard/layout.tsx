import { Header } from "@/components/ui/header";
import { SwitchToWideScreenCTA } from "@/components/ui/switch-to-wide-screen-cta";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-full">
      <Header />
      {children}
      <SwitchToWideScreenCTA />
    </main>
  );
}
