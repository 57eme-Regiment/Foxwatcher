import { Badge } from '@57eme-regiment/nabu-ui';
import { Button } from '@57eme-regiment/nabu-ui';
import { Card, CardContent, CardHeader, CardTitle } from '@57eme-regiment/nabu-ui';
import { useItems } from '@/hooks/useItems';
import { useLocations } from '@/hooks/useLocations';
import { useRegions } from '@/hooks/useRegions';
import { useTowns } from '@/hooks/useTowns';
import {
  IconBuildingCommunity,
  IconMapPin,
  IconPackage,
  IconRefresh,
  IconWorld,
} from '@tabler/icons-react';
import type { ComponentType } from 'react';

type ActionRowProps = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  count: number | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onRefresh: () => void;
};

function ActionRow({
  label,
  icon: Icon,
  count,
  isLoading,
  isError,
  isFetching,
  onRefresh,
}: ActionRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-0">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-muted rounded-md text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {isError ? (
          <Badge variant="destructive">Erreur</Badge>
        ) : isLoading ? (
          <Badge variant="secondary">Chargement…</Badge>
        ) : (
          <Badge variant="outline">{count ?? 0}</Badge>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isFetching}
          onClick={onRefresh}
          aria-label={`Rafraîchir ${label}`}>
          <IconRefresh className={isFetching ? 'animate-spin' : ''} />
        </Button>
      </div>
    </div>
  );
}

export function DashboardApiActions() {
  const regions = useRegions();
  const towns = useTowns();
  const locations = useLocations();
  const items = useItems();

  const isAnyFetching =
    regions.isFetching ||
    towns.isFetching ||
    locations.isFetching ||
    items.isFetching;

  function refreshAll() {
    regions.refetch();
    towns.refetch();
    locations.refetch();
    items.refetch();
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Aperçu des ressources</CardTitle>
        <div>
          <Button
            variant="outline"
            size="sm"
            disabled={isAnyFetching}
            onClick={refreshAll}>
            <IconRefresh className={isAnyFetching ? 'animate-spin' : ''} />
            Rescrap data
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            disabled={isAnyFetching}
            onClick={refreshAll}>
            <IconRefresh className={isAnyFetching ? 'animate-spin' : ''} />
            Tout rafraîchir
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ActionRow
          label="Régions"
          icon={IconWorld}
          count={regions.data?.length}
          isLoading={regions.isLoading}
          isError={regions.isError}
          isFetching={regions.isFetching}
          onRefresh={() => regions.refetch()}
        />
        <ActionRow
          label="Villes"
          icon={IconBuildingCommunity}
          count={towns.data?.length}
          isLoading={towns.isLoading}
          isError={towns.isError}
          isFetching={towns.isFetching}
          onRefresh={() => towns.refetch()}
        />
        <ActionRow
          label="Locations"
          icon={IconMapPin}
          count={locations.data?.length}
          isLoading={locations.isLoading}
          isError={locations.isError}
          isFetching={locations.isFetching}
          onRefresh={() => locations.refetch()}
        />
        <ActionRow
          label="Items"
          icon={IconPackage}
          count={items.data?.length}
          isLoading={items.isLoading}
          isError={items.isError}
          isFetching={items.isFetching}
          onRefresh={() => items.refetch()}
        />
      </CardContent>
    </Card>
  );
}
