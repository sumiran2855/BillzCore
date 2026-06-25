import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

/**
 * Typography system:
 * - Plus Jakarta Sans → headings + body (modern, geometric, premium feel)
 * - JetBrains Mono    → code, IDs, monospaced labels
 *
 * Navbar is NOT rendered here — it lives in (main)/layout.tsx so that
 * the /login route (which is outside the (main) group) gets no navbar.
 */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BillzCore — Staffing Operations Platform",
  description:
    "Run your staffing operations without the chaos. Candidates, compliance, and billing — tracked from one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif" }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

