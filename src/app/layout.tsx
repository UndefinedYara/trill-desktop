import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/provider.reactQuery";

export const metadata: Metadata = {
  title: "Trill | Music Master",
  description:
    "Interactive guitar chord lookup app that identifies chords from fretboard input using interval-based music theory and real guitar voicings.",
  openGraph: {
    title: "Trill | Music Master",
    description:
      "Interactive guitar chord lookup app that identifies chords from fretboard input using interval-based music theory and real guitar voicings.",
    type: "website",
    locale: "en_US",
    siteName: "Trill | Music Master",
  },
  appleWebApp: { title: "Trill | Music Master" },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
