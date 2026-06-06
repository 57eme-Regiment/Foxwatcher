import { Button } from '@57eme-regiment/nabu-ui';
import { HttpError } from '@/lib/http-error';
import { WanApi } from '@/lib/api-client';
import type { UpdatePermission } from '@57eme-regiment/auth-contracts';
import { IconTrash } from '@tabler/icons-react';
import type {
  CellValueChangedEvent,
  ColDef,
  ICellRendererParams,
} from 'ag-grid-community';
import {
  AllCommunityModule,
  colorSchemeDark,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeletePermissionDialog } from './DeletePermissionDialog';
import type { AdminPermission, PermissionRow } from './roles.schema';

interface PermissionsGridProps {
  permissions: AdminPermission[];
  assignedPermissionIds: Set<string>;
  selectedRoleId: string | null;
  onToggle: (permissionId: string, assign: boolean) => void;
}

type DeleteCellParams = ICellRendererParams<PermissionRow> & {
  onDelete: (permission: AdminPermission) => void;
};

function DeleteCellRenderer({ data, onDelete }: DeleteCellParams) {
  if (!data) return null;
  return (
    <div className="flex items-center h-full justify-center">
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={e => { e.stopPropagation(); onDelete(data); }}
        aria-label="Supprimer le droit"
      >
        <IconTrash />
      </Button>
    </div>
  );
}

export function PermissionsGrid({
  permissions,
  assignedPermissionIds,
  selectedRoleId,
  onToggle,
}: PermissionsGridProps) {
  const theme = useMemo(() => themeQuartz.withPart(colorSchemeDark), []);
  const [permissionToDelete, setPermissionToDelete] = useState<AdminPermission | null>(null);
  const qc = useQueryClient();

  const updatePermission = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdatePermission }) => {
      const res = await WanApi.adminPermisisions.updatePermission({ params: { id }, body });
      if (res.status !== 200) throw new HttpError(res.status, 'Failed to update permission');
      return res.body;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'permissions'] }),
  });

  const rows = useMemo<PermissionRow[]>(
    () =>
      selectedRoleId === null
        ? []
        : permissions.map(p => ({
            ...p,
            isAssigned: assignedPermissionIds.has(p.id),
          })),
    [permissions, assignedPermissionIds, selectedRoleId],
  );

  const colDefs = useMemo<ColDef<PermissionRow>[]>(
    () => [
      {
        field: 'isAssigned',
        headerName: 'Assignée',
        width: 100,
        cellDataType: 'boolean',
        editable: true,
      },
      {
        field: 'key',
        headerName: 'Clé',
        flex: 2,
        minWidth: 160,
        editable: true,
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 3,
        minWidth: 180,
        editable: true,
        valueFormatter: ({ value }) => value ?? '—',
      },
      {
        colId: 'actions',
        headerName: '',
        width: 52,
        sortable: false,
        resizable: false,
        editable: false,
        pinned: 'right',
        cellRenderer: DeleteCellRenderer,
        cellRendererParams: { onDelete: setPermissionToDelete },
      },
    ],
    [],
  );

  const onCellValueChanged = useCallback(
    (e: CellValueChangedEvent<PermissionRow>) => {
      if (!e.data) return;

      if (e.colDef.field === 'isAssigned') {
        if (!selectedRoleId) return;
        onToggle(e.data.id, e.newValue as boolean);
        return;
      }

      const field = e.colDef.field as keyof UpdatePermission;
      const rawValue = e.newValue as string;
      const value = field === 'description' && rawValue === '' ? null : rawValue;
      updatePermission.mutate({ id: e.data.id, body: { [field]: value } });
    },
    [selectedRoleId, onToggle, updatePermission],
  );

  return (
    <>
      <AgGridReact<PermissionRow>
        modules={[AllCommunityModule]}
        theme={theme}
        rowData={rows}
        columnDefs={colDefs}
        rowHeight={48}
        headerHeight={44}
        getRowId={p => p.data.id}
        onCellValueChanged={onCellValueChanged}
        stopEditingWhenCellsLoseFocus
        defaultColDef={{ sortable: true, resizable: true, suppressMovable: true }}
        suppressMovableColumns
        suppressCellFocus
      />
      <DeletePermissionDialog
        permission={permissionToDelete}
        open={permissionToDelete !== null}
        onOpenChange={open => { if (!open) setPermissionToDelete(null); }}
      />
    </>
  );
}
