import type { Region } from '@57em-regiment/krang-api-contract';
import { useTheme } from '@/components/theme-provider';
import type { ColDef } from 'ag-grid-community';
import {
  AllCommunityModule,
  colorSchemeDark,
  colorSchemeLight,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';

interface RegionGridProps {
  regions: Region[];
  onRowDoubleClick: (region: Region) => void;
}

export function RegionGrid({ regions, onRowDoubleClick }: RegionGridProps) {
  const { theme } = useTheme();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const agTheme = useMemo(
    () =>
      isDark
        ? themeQuartz.withPart(colorSchemeDark)
        : themeQuartz.withPart(colorSchemeLight),
    [isDark],
  );

  const colDefs = useMemo<ColDef<Region>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        flex: 2,
        minWidth: 200,
      },
      {
        field: 'gameRegionId',
        headerName: 'Game Region ID',
        flex: 1,
        minWidth: 160,
        valueFormatter: ({ value }) =>
          value !== null && value !== undefined ? String(value) : '—',
      },
    ],
    [],
  );

  return (
    <AgGridReact<Region>
      modules={[AllCommunityModule]}
      theme={agTheme}
      rowData={regions}
      columnDefs={colDefs}
      rowHeight={48}
      defaultColDef={{ sortable: true, resizable: true }}
      suppressMovableColumns
      onRowDoubleClicked={e => e.data && onRowDoubleClick(e.data)}
    />
  );
}
