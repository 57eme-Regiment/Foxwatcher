import { Button } from '@57eme-regiment/nabu-ui';
import {
  IconBrandDiscord,
  IconLoader2,
  IconUserCheck,
  IconUserOff,
} from '@tabler/icons-react';
import type { ICellRendererParams } from 'ag-grid-community';
import type { GridRow } from './userGrid.schema';

export type ActionsCellParams = ICellRendererParams<GridRow> & {
  onSyncDiscord: (userId: string) => void;
  onDisable: (userId: string) => void;
  onEnable: (userId: string) => void;
  syncPendingId: string | undefined;
  disablePendingId: string | undefined;
  enablePendingId: string | undefined;
};

export function ActionsCellRenderer({
  data,
  onSyncDiscord,
  onDisable,
  onEnable,
  syncPendingId,
  disablePendingId,
  enablePendingId,
}: ActionsCellParams) {
  if (data?._type !== 'user') return null;

  const isDisabled = !!data.disabledAt;
  const isSyncing = syncPendingId === data.id;
  const isDisabling = disablePendingId === data.id;
  const isEnabling = enablePendingId === data.id;

  return (
    <div className="flex items-center gap-1 h-full justify-end pr-1">
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={isSyncing}
        onClick={() => onSyncDiscord(data.id)}
        aria-label="Synchroniser Discord"
        title="Synchroniser Discord">
        {isSyncing ? (
          <IconLoader2 className="animate-spin" />
        ) : (
          <IconBrandDiscord className="text-indigo-400" />
        )}
      </Button>

      {isDisabled ? (
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isEnabling}
          onClick={() => onEnable(data.id)}
          aria-label="Réactiver le compte"
          title="Réactiver le compte"
          className="text-green-600 hover:text-primary hover:bg-green-500/10">
          {isEnabling ? (
            <IconLoader2 className="animate-spin" />
          ) : (
            <IconUserCheck />
          )}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isDisabling}
          onClick={() => onDisable(data.id)}
          aria-label="Désactiver le compte"
          title="Désactiver le compte"
          className="text-destructive hover:text-primary hover:bg-destructive/10">
          {isDisabling ? (
            <IconLoader2 className="animate-spin" />
          ) : (
            <IconUserOff />
          )}
        </Button>
      )}
    </div>
  );
}
