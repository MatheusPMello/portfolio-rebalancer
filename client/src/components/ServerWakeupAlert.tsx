/**
 * @file ServerWakeupAlert.tsx
 * @description A reusable alert component showing a message while waiting for the server to wake up.
 */



interface ServerWakeupAlertProps {
  isLoading: boolean;
}

/**
 * Renders a spinner and a warning alert during server wakeup/initialization.
 * @param {ServerWakeupAlertProps} props - Component props.
 * @returns {JSX.Element | null} The alert element or null.
 */
export function ServerWakeupAlert({ isLoading }: Readonly<ServerWakeupAlertProps>) {
  if (!isLoading) return null;

  return (
    <div className="alert alert-info small py-2 mb-3">
      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
      <span>Waking up the free server... this might take 30s.</span>
    </div>
  );
}
