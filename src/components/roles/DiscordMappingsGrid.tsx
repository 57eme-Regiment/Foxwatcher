import { Button } from '@/components/ui/button';
import { IconTrash } from '@tabler/icons-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import {
  AllCommunityModule,
  colorSchemeDark,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo, useState } from 'react';
import { DeleteDiscordMappingDialog } from './DeleteDiscordMappingDialog';
import type { AdminDiscordMapping } from './roles.schema';

interface DiscordMappingsGridProps {
  mappings: AdminDiscordMapping[];
}

type DeleteCellParams = ICellRendererParams<AdminDiscordMapping> & {
  onDelete: (mapping: AdminDiscordMapping) => void;
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
        aria-label="Supprimer le mapping"
      >
        <IconTrash />
      </Button>
    </div>
  );
}

export function DiscordMappingsGrid({ mappings }: DiscordMappingsGridProps) {
  const theme = useMemo(() => themeQuartz.withPart(colorSchemeDark), []);
  const [mappingToDelete, setMappingToDelete] = useState<AdminDiscordMapping | null>(null);

  const colDefs = useMemo<ColDef<AdminDiscordMapping>[]>(() => [
    {
      field: 'guildId',
      headerName: 'Guild ID',
      flex: 2,
      minWidth: 160,
    },
    {
      field: 'discordRoleId',
      headerName: 'Discord Role ID',
      flex: 2,
      minWidth: 160,
    },
    {
      colId: 'roleName',
      headerName: 'Rôle applicatif',
      flex: 2,
      minWidth: 140,
      valueGetter: p => p.data?.role.name,
    },
    {
      colId: 'actions',
      headerName: '',
      width: 52,
      sortable: false,
      resizable: false,
      pinned: 'right',
      cellRenderer: DeleteCellRenderer,
      cellRendererParams: { onDelete: setMappingToDelete },
    },
  ], []);

  return (
    <>
      <AgGridReact<AdminDiscordMapping>
        modules={[AllCommunityModule]}
        theme={theme}
        rowData={mappings}
        columnDefs={colDefs}
        rowHeight={48}
        headerHeight={44}
        getRowId={p => p.data.id}
        defaultColDef={{ sortable: true, resizable: true, suppressMovable: true }}
        suppressMovableColumns
        suppressCellFocus
      />
      <DeleteDiscordMappingDialog
        mapping={mappingToDelete}
        open={mappingToDelete !== null}
        onOpenChange={open => { if (!open) setMappingToDelete(null); }}
      />
    </>
  );
}
