export default function LoadingComponent() {
  return (
    <div className="loader-modern" aria-label="Loading" aria-live="polite" role="status">
      <div className="loader-orb" aria-hidden="true">
        <span className="loader-ring" />
        <span className="loader-core" />
        <span className="loader-pulse" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
