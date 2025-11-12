/**
 * @file DashboardPage.tsx
 * @description This page serves as the main dashboard for authenticated users.
 * It displays a welcome message and is intended to contain the core portfolio management features.
 */

/**
 * Renders the main dashboard page for the user.
 * This is the landing page after a successful login.
 * @returns {JSX.Element} The dashboard component.
 */
export function DashboardPage() {
  // The logout functionality is now handled by the MainLayout component.

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to your portfolio rebalancer!</p>
      {/* TODO: Add logic to fetch and display assets */}
    </div>
  );
}
