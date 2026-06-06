import { Button } from '@57eme-regiment/nabu-ui';
import { HttpError } from '@/lib/http-error';
import { WanApi } from '@/lib/api-client';
import type { UpdateRole } from '@57eme-regiment/auth-contracts';
import { IconTrash } from '@tabler/icons-react';
import type {
  CellValueChangedEvent,
  ColDef,
  ICellRendererParams,
  RowClickedEvent,
} from 'ag-grid-community';
import {
  AllCommunityModule,
  colorSchemeDark,
  themeQuartz,
} from 'ag-grid-community';
import type { AgGridReact as AgGridReactType } from 'ag-grid-react';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteRoleDialog } from './DeleteRoleDialog';
import type { AdminRole } from './roles.schema';

interface RolesGridProps {
  roles: AdminRole[];
  onSelect: (roleId: string) => void;
}

type DeleteCellParams = ICellRendererParams<AdminRole> & {
  onDelete: (role: AdminRole) => void;
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
        aria-label="Supprimer le rôle"
      >
        <IconTrash />
      </Button>
    </div>
  );
}

export function RolesGrid({ roles, onSelect }: RolesGridProps) {
  const theme = useMemo(() => themeQuartz.withPart(colorSchemeDark), []);
  const gridRef = useRef<AgGridReactType<AdminRole>>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<AdminRole | null>(null);
  const qc = useQueryClient();

  const updateRole = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdateRole }) => {
      const res = await WanApi.adminRole.updateRole({ params: { id }, body });
      if (res.status !== 200) throw new HttpError(res.status, 'Failed to update role');
      return res.body;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'roles'] }),
  });

  useEffect(() => {
    gridRef.current?.api?.redrawRows();
  }, [selectedId]);

  const onRowClicked = (e: RowClickedEvent<AdminRole>) => {
    if (!e.data) return;
    setSelectedId(e.data.id);
    onSelect(e.data.id);
  };

  const onCellValueChanged = useCallback(
    (e: CellValueChangedEvent<AdminRole>) => {
      if (!e.data) return;
      const field = e.colDef.field as keyof UpdateRole;
      const rawValue = e.newValue as string;
      const value = field === 'description' && rawValue === '' ? null : rawValue;
      updateRole.mutate({ id: e.data.id, body: { [field]: value } });
    },
    [updateRole],
  );

  const colDefs = useMemo<ColDef<AdminRole>[]>(() => [
    { field: 'name', headerName: 'Nom', flex: 2, minWidth: 140, editable: true },
    { field: 'key', headerName: 'Clé', flex: 2, minWidth: 140, editable: true },
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
      cellRendererParams: { onDelete: setRoleToDelete },
    },
  ], []);

  return (
    <>
      <AgGridReact<AdminRole>
        ref={gridRef}
        modules={[AllCommunityModule]}
        theme={theme}
        rowData={roles}
        columnDefs={colDefs}
        rowHeight={48}
        headerHeight={44}
        getRowId={p => p.data.id}
        getRowClass={p => (p.data?.id === selectedId ? 'ag-row-selected' : undefined)}
        onRowClicked={onRowClicked}
        onCellValueChanged={onCellValueChanged}
        stopEditingWhenCellsLoseFocus
        defaultColDef={{ sortable: true, resizable: true, suppressMovable: true }}
        suppressMovableColumns
      />
      <DeleteRoleDialog
        role={roleToDelete}
        open={roleToDelete !== null}
        onOpenChange={open => { if (!open) setRoleToDelete(null); }}
      />
    </>
  );
}
