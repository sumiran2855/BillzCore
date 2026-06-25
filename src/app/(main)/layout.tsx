/**
 * (main) route group layout.
 *
 * Each nested layout (dashboard, onboarding, etc.) manages its own
 * chrome. The /login route lives outside this group so it gets none.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
