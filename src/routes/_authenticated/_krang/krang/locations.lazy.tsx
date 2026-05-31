import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/_krang/krang/locations')({
  component: Locations,
});

function Locations() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
        <p className="text-muted-foreground mt-2">View all locations.</p>
      </div>
    </div>
  );
}
