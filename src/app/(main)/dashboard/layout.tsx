"use client";

import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import Sidebar from "@/features/dashboard/Sidebar";
import DashboardNavbar from "@/features/dashboard/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div data-theme={theme} className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bz-bg)" }}>
      {/* Demo Banner */}
      <div
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 px-4 py-1.5 text-[11.5px] font-semibold"
        style={{
          background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)",
          color: "#fff",
          letterSpacing: "0.01em",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="hidden sm:inline">Demo Mode — This is a preview environment. Data shown is for demonstration purposes only and does not reflect real operations.</span>
        <span className="sm:hidden">Demo Mode — Preview only.</span>
      </div>

      {/* Mobile overlay backdrop — sits below demo banner (z-95 < z-100) */}
      {mobileOpen && (
        <div
          className="fixed left-0 right-0 bottom-0 z-[95] bg-black/50 md:hidden"
          style={{ top: "30px" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, slide-in overlay when mobileOpen.
          z-96 keeps it BELOW the demo banner (z-100) so the banner is always visible.
          top-[30px] starts the overlay below the banner; no extra marginTop here
          since Sidebar's own <aside> already has marginTop:30px for the desktop case. */}
      <div
        className={`
          fixed top-[30px] bottom-0 left-0 z-[96] md:relative md:top-auto md:bottom-auto md:z-auto md:mt-[30px]
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />
      </div>

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0" style={{ marginTop: "30px" }}>
        {/* Navbar */}
        <DashboardNavbar onMenuClick={() => setMobileOpen(p => !p)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}