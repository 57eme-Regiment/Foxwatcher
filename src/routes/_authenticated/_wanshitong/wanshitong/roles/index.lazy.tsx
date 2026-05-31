import { CreateDiscordMappingDialog } from '@/components/roles/CreateDiscordMappingDialog';
import { CreatePermissionDialog } from '@/components/roles/CreatePermissionDialog';
import { CreateRoleDialog } from '@/components/roles/CreateRoleDialog';
import { DiscordMappingsGrid } from '@/components/roles/DiscordMappingsGrid';
import { PermissionsGrid } from '@/components/roles/PermissionsGrid';
import { RolesGrid } from '@/components/roles/RolesGrid';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WanApi } from '@/lib/api-client';
import { HttpError } from '@/lib/http-error';
import { IconPlus } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createLazyFileRoute(
  '/_authenticated/_wanshitong/wanshitong/roles/',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const qc = useQueryClient();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [createPermissionOpen, setCreatePermissionOpen] = useState(false);
  const [createMappingOpen, setCreateMappingOpen] = useState(false);

  const rolesQuery = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: async () => {
      const res = await WanApi.adminRole.getRoles();
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch roles');
      return res.body;
    },
  });

  const permissionsQuery = useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: async () => {
      const res = await WanApi.adminPermisisions.getPermissions();
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch permissions');
      return res.body;
    },
  });

  const rolePermissionsQuery = useQuery({
    queryKey: ['admin', 'roles', selectedRoleId, 'permissions'],
    enabled: selectedRoleId !== null,
    queryFn: async () => {
      const res = await WanApi.adminRole.getRolePermissions({
        params: { roleId: selectedRoleId! },
      });
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch role permissions');
      return res.body;
    },
  });

  const discordMappingsQuery = useQuery({
    queryKey: ['admin', 'discord-mappings'],
    queryFn: async () => {
      const res = await WanApi.adminDiscordMapping.getMappings();
      if (res.status !== 200)
        throw new HttpError(res.status, 'Failed to fetch mappings');
      return res.body;
    },
  });

  const invalidateRolePermissions = () =>
    qc.invalidateQueries({
      queryKey: ['admin', 'roles', selectedRoleId, 'permissions'],
    });

  const addPermission = useMutation({
    mutationFn: async (permissionId: string) => {
      const res = await WanApi.adminRole.addRolePermission({
        params: { roleId: selectedRoleId! },
        body: { permissionId },
      });
      if (res.status !== 201)
        throw new HttpError(res.status, 'Failed to add permission');
    },
    onSuccess: invalidateRolePermissions,
  });

  const removePermission = useMutation({
    mutationFn: async (permissionId: string) => {
      const res = await WanApi.adminRole.removeRolePermission({
        params: { roleId: selectedRoleId!, permissionId },
      });
      if (res.status !== 204)
        throw new HttpError(res.status, 'Failed to remove permission');
    },
    onSuccess: invalidateRolePermissions,
  });

  const assignedPermissionIds = new Set(
    rolePermissionsQuery.data?.map(p => p.id) ?? [],
  );

  const handleToggle = (permissionId: string, assign: boolean) => {
    if (assign) addPermission.mutate(permissionId);
    else removePermission.mutate(permissionId);
  };

  const selectedRole =
    rolesQuery.data?.find(r => r.id === selectedRoleId) ?? null;

  const filteredMappings = (discordMappingsQuery.data ?? []).filter(
    m => m.roleId === selectedRoleId,
  );

  return (
    <div
      className="flex flex-col space-y-4"
      style={{ height: 'calc(100vh - 130px)' }}>
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">
          Rôles & Permissions
        </h1>
        <p className="text-muted-foreground mt-1">
          Sélectionnez un rôle pour gérer ses permissions et mappings Discord.
        </p>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left — roles */}
        <div className="w-1/2 flex flex-col gap-2 min-h-0">
          <div className="flex justify-end shrink-0">
            <Button size="sm" onClick={() => setCreateRoleOpen(true)}>
              <IconPlus />
              Nouveau rôle
            </Button>
          </div>
          {rolesQuery.isError ? (
            <p className="text-destructive text-sm">
              Impossible de charger les rôles.
            </p>
          ) : (
            <div className="flex-1 min-h-0">
              <RolesGrid
                roles={rolesQuery.data ?? []}
                onSelect={setSelectedRoleId}
              />
            </div>
          )}
        </div>

        {/* Right — tabs */}
        <div className="w-1/2 flex flex-col min-h-0">
          <Tabs
            defaultValue="permissions"
            className="flex flex-col flex-1 min-h-0">
            <TabsList className="shrink-0 w-full justify-start">
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="discord">Discord</TabsTrigger>
            </TabsList>

            <TabsContent
              value="permissions"
              className="flex flex-col flex-1 gap-2 mt-2 min-h-0">
              <div className="flex justify-end shrink-0">
                <Button size="sm" onClick={() => setCreatePermissionOpen(true)}>
                  <IconPlus />
                  Nouveau droit
                </Button>
              </div>
              {permissionsQuery.isError ? (
                <p className="text-destructive text-sm">
                  Impossible de charger les permissions.
                </p>
              ) : (
                <div className="flex-1 min-h-0">
                  <PermissionsGrid
                    permissions={permissionsQuery.data ?? []}
                    assignedPermissionIds={assignedPermissionIds}
                    selectedRoleId={selectedRoleId}
                    onToggle={handleToggle}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="discord"
              className="flex flex-col flex-1 gap-2 mt-2 min-h-0">
              <div className="flex justify-end shrink-0">
                <Button
                  size="sm"
                  disabled={!selectedRole}
                  onClick={() => setCreateMappingOpen(true)}>
                  <IconPlus />
                  Nouveau mapping
                </Button>
              </div>
              {!selectedRole ? (
                <p className="text-sm text-muted-foreground">
                  Sélectionnez un rôle pour voir ses mappings Discord.
                </p>
              ) : discordMappingsQuery.isError ? (
                <p className="text-destructive text-sm">
                  Impossible de charger les mappings.
                </p>
              ) : (
                <div className="flex-1 min-h-0">
                  <DiscordMappingsGrid mappings={filteredMappings} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateRoleDialog
        open={createRoleOpen}
        onOpenChange={setCreateRoleOpen}
      />
      <CreatePermissionDialog
        open={createPermissionOpen}
        onOpenChange={setCreatePermissionOpen}
      />
      {selectedRole && (
        <CreateDiscordMappingDialog
          roleKey={selectedRole.key}
          open={createMappingOpen}
          onOpenChange={setCreateMappingOpen}
        />
      )}
    </div>
  );
}
