import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/items')({
  component: Items,
});

function Items() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Items</h1>
        <p className="text-muted-foreground mt-2">Manage inventory items.</p>
      </div>
    </div>
  );
}
