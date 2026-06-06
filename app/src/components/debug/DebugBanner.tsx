export function DebugBanner({ label }: { label: string }) {
  return (
    <div className="border-b border-secondary/30 bg-secondary-container/50 px-4 py-2 text-center text-label-sm font-medium text-on-secondary-container">
      Debug preview — {label}. Stubbed data; no Convex case required.
    </div>
  );
}
