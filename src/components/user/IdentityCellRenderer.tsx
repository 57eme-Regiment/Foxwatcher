import { Button } from '@57eme-regiment/nabu-ui';
import { formatDateTime } from '@/lib/format';
import { IconLoader2, IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import type { ICellRendererParams } from 'ag-grid-community';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { GridRow } from './userGrid.schema';

export type IdentityCellParams = ICellRendererParams<GridRow> & {
  onToggle: (userId: string) => void;
  onRevokeSession: (sessionId: string) => void;
  revokePendingId: string | undefined;
};

export function IdentityCellRenderer({
  data,
  onToggle,
  onRevokeSession,
  revokePendingId,
}: IdentityCellParams) {
  if (!data) return null;

  if (data._type === 'user') {
    const hasNoSessions = data._sessionCount === 0;
    return (
      <div className="flex items-center gap-2.5 h-full">
        <button
          className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0 disabled:opacity-30"
          onClick={() => onToggle(data.id)}
          disabled={hasNoSessions}
          aria-label={data._isExpanded ? 'Réduire' : 'Développer'}>
          {hasNoSessions ? (
            '—'
          ) : data._isExpanded ? (
            <IconMinus />
          ) : (
            <IconPlus />
          )}
        </button>

        <div className="group size-9 rounded-full">
          <Avatar className="mr-2 size-full group-active:scale-95">
            <AvatarFallback className="bg-card">
              {data.name?.slice(0, 1).toUpperCase()}
            </AvatarFallback>
            {data?.image && <AvatarImage src={data.image} />}
          </Avatar>
        </div>
        <span className="max-w-32 truncate">{data?.name}</span>
      </div>
    );
  }

  const now = new Date();
  const isExpired = new Date(data.expiresAt) < now;
  const isRevoking = revokePendingId === data.id;

  return (
    <div className="flex items-center justify-between gap-6 pl-14 pr-2 h-full text-sm text-muted-foreground">
      <div className="flex items-center gap-6 min-w-0">
        <span className="flex items-center gap-1.5 shrink-0">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${isExpired ? 'bg-destructive' : 'bg-green-500 animate-pulse'}`}
          />
          <span
            className={
              isExpired ? 'text-destructive' : 'text-green-600 animate-pulse'
            }>
            {isExpired ? 'Expirée' : 'Active'}
          </span>
        </span>
        <span className="font-mono text-xs shrink-0">
          {data.ipAddress ?? '—'}
        </span>
        <span className="max-w-xs truncate text-xs">
          {data.userAgent ?? '—'}
        </span>
        <span className="shrink-0 text-xs">
          Créée le {formatDateTime(data.createdAt)}
        </span>
        <span className="shrink-0 text-xs">
          {isExpired ? 'Expirée le' : 'Expire le'}{' '}
          {formatDateTime(data.expiresAt)}
        </span>
      </div>
      {!isExpired && (
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive"
          disabled={isRevoking}
          onClick={() => onRevokeSession(data.id)}
          aria-label="Révoquer la session">
          {isRevoking ? <IconLoader2 className="animate-spin" /> : <IconX />}
        </Button>
      )}
    </div>
  );
}
