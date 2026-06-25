/**
 * Root entry point `/`
 *
 * Redirects to /onboarding on first visit.
 * In the future, replace this with an auth-aware redirect:
 *   - Authenticated users  → /dashboard
 *   - Unauthenticated users → /onboarding
 */

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/onboarding");
}
