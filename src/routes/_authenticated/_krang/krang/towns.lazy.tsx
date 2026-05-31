import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/_krang/krang/towns')({
  component: Towns,
});

function Towns() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Towns</h1>
        <p className="text-muted-foreground mt-2">Browse and manage towns.</p>
      </div>
    </div>
  );
}
