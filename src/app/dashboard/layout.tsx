import { Header } from "@/components/ui/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-full">
      <Header />
      {children}
    </main>
  );
}
