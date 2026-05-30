import { RegionFormModal } from '@/components/region/RegionFormModal';
import { RegionGrid } from '@/components/region/RegionGrid';
import { Button } from '@/components/ui/button';
import { useRegions } from '@/hooks/useRegions';
import type { Region } from '@57em-regiment/krang-api-contract';
import { IconPlus } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createLazyFileRoute('/regions')({
  component: Regions,
});

function Regions() {
  const { data: regions = [], isLoading, isError } = useRegions();
  const [modalState, setModalState] = useState<{ open: boolean; region?: Region }>({
    open: false,
  });

  return (
    <div className="flex flex-col space-y-4" style={{ height: 'calc(100vh - 130px)' }}>
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Regions</h1>
          <p className="text-muted-foreground mt-1">Manage geographic regions.</p>
        </div>
        <Button onClick={() => setModalState({ open: true, region: undefined })}>
          <IconPlus className="h-4 w-4" />
          Add Region
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        {isLoading && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading...
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center h-full text-destructive">
            Failed to load regions.
          </div>
        )}
        {!isLoading && !isError && (
          <RegionGrid
            regions={regions}
            onRowDoubleClick={region => setModalState({ open: true, region })}
          />
        )}
      </div>

      <RegionFormModal
        open={modalState.open}
        onOpenChange={open => setModalState(s => ({ ...s, open }))}
        region={modalState.region}
      />
    </div>
  );
}
