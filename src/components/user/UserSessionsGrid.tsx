import { WanApi } from '@/lib/api-client';
import type { AdminUser } from '@57eme-regiment/auth-contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ColDef,
  ColSpanParams,
  GetRowIdParams,
  ICellRendererParams,
} from 'ag-grid-community';
import {
  AllCommunityModule,
  colorSchemeDark,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo, useState } from 'react';
import { ActionsCellRenderer } from './ActionsCellRenderer';
import { IdentityCellRenderer } from './IdentityCellRenderer';
import type { GridRow, SessionRow } from './userGrid.schema';

const COLUMN_COUNT = 5;

interface UserSessionsGridProps {
  users: AdminUser[];
}

export function UserSessionsGrid({ users }: UserSessionsGridProps) {
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const qc = useQueryClient();

  const invalidateUsers = useCallback(
    () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
    [qc],
  );

  const syncDiscordMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await WanApi.adminUsers.syncDiscord({ params: { userId } });
      if (res.status !== 204) throw new Error('Sync Discord failed');
    },
    onSuccess: invalidateUsers,
  });

  const disableUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await WanApi.adminUsers.disableUser({
        params: { userId },
        body: {},
      });
      if (res.status !== 204) throw new Error('Disable user failed');
    },
    onSuccess: invalidateUsers,
  });

  const enableUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await WanApi.adminUsers.enableUser({ params: { userId } });
      if (res.status !== 204) throw new Error('Enable user failed');
    },
    onSuccess: invalidateUsers,
  });

  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await WanApi.adminSessions.revokeSession({
        params: { sessionId },
      });
      if (res.status !== 204) throw new Error('Revoke session failed');
    },
    onSuccess: invalidateUsers,
  });

  const toggleUser = useCallback((userId: string) => {
    setExpandedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }, []);

  const flatRows = useMemo<GridRow[]>(
    () =>
      users.flatMap(user => [
        {
          ...user,
          _type: 'user' as const,
          _isExpanded: expandedUsers.has(user.id),
          _sessionCount: user.sessions?.length ?? 0,
        },
        ...(expandedUsers.has(user.id)
          ? (user.sessions ?? []).map(
              (s): SessionRow => ({ ...s, _type: 'session' }),
            )
          : []),
      ]),
    [users, expandedUsers],
  );

  const colDefs = useMemo<ColDef<GridRow>[]>(
    () => [
      {
        colId: 'identity',
        headerName: 'Utilisateur',
        width: 260,
        minWidth: 260,
        colSpan: (params: ColSpanParams<GridRow>) =>
          params.data?._type === 'session' ? COLUMN_COUNT : 1,
        cellRenderer: IdentityCellRenderer,
        cellRendererParams: {
          onToggle: toggleUser,
          onRevokeSession: revokeSessionMutation.mutate,
          revokePendingId: revokeSessionMutation.isPending
            ? revokeSessionMutation.variables
            : undefined,
        },
        sortable: false,
      },
      {
        colId: 'superAdmin',
        headerName: 'Super Admin',
        width: 120,
        sortable: false,
        cellDataType: 'boolean',
        editable: false,
        valueGetter: params =>
          params.data?._type === 'user' ? params.data.isSuperAdmin : null,
      },
      {
        colId: 'status',
        headerName: 'Statut',
        width: 120,
        sortable: false,
        cellRenderer: ({ data }: ICellRendererParams<GridRow>) => {
          if (data?._type !== 'user') return null;
          const isDisabledUser = !!data.disabledAt;
          return (
            <span
              className={`flex items-center gap-1.5 text-xs font-medium h-full ${
                isDisabledUser ? 'text-destructive' : 'text-green-500 '
              }`}>
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isDisabledUser
                    ? 'bg-destructive'
                    : 'bg-green-500 animate-pulse'
                }`}
              />
              {isDisabledUser ? 'Désactivé' : 'Actif'}
            </span>
          );
        },
      },
      {
        colId: 'sessions',
        headerName: 'Sessions',
        flex: 1,
        resizable: false,
        sortable: false,
        cellRenderer: ({ data }: ICellRendererParams<GridRow>) => {
          if (data?._type !== 'user') return null;
          const count = data._sessionCount;
          return (
            <span className="text-sm tabular-nums">
              {count}
              <span className="text-muted-foreground ml-1">
                session{count !== 1 ? 's' : ''}
              </span>
            </span>
          );
        },
      },
      {
        colId: 'actions',
        headerName: 'Actions',
        sortable: false,
        resizable: false,
        pinned: 'right',
        cellRenderer: ActionsCellRenderer,
        cellRendererParams: {
          onSyncDiscord: syncDiscordMutation.mutate,
          onDisable: disableUserMutation.mutate,
          onEnable: enableUserMutation.mutate,
          syncPendingId: syncDiscordMutation.isPending
            ? syncDiscordMutation.variables
            : undefined,
          disablePendingId: disableUserMutation.isPending
            ? disableUserMutation.variables
            : undefined,
          enablePendingId: enableUserMutation.isPending
            ? enableUserMutation.variables
            : undefined,
        },
      },
    ],
    [
      toggleUser,
      revokeSessionMutation.mutate,
      revokeSessionMutation.isPending,
      revokeSessionMutation.variables,
      syncDiscordMutation.mutate,
      syncDiscordMutation.isPending,
      syncDiscordMutation.variables,
      disableUserMutation.mutate,
      disableUserMutation.isPending,
      disableUserMutation.variables,
      enableUserMutation.mutate,
      enableUserMutation.isPending,
      enableUserMutation.variables,
    ],
  );

  const getRowId = useCallback(
    (params: GetRowIdParams<GridRow>) =>
      params.data._type === 'user'
        ? `user-${params.data.id}`
        : `session-${params.data.id}`,
    [],
  );

  const getRowStyle = (params: { data?: GridRow }) =>
    params.data?._type === 'session'
      ? {
          background: 'rgba(255,255,255,0.025)',
          borderTop: 'none',
        }
      : undefined;
  return (
    <AgGridReact<GridRow>
      modules={[AllCommunityModule]}
      theme={themeQuartz
        .withPart(colorSchemeDark)
        .withParams({ pinnedColumnBorder: false })}
      rowData={flatRows}
      columnDefs={colDefs}
      rowHeight={52}
      headerHeight={44}
      getRowId={getRowId}
      getRowStyle={getRowStyle}
      defaultColDef={{ resizable: true, suppressMovable: true }}
      suppressMovableColumns
      suppressCellFocus
    />
  );
}
