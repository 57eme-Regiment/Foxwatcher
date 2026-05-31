import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { HttpError } from '@/lib/http-error';
import { WanApi } from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AdminPermission } from './roles.schema';

interface DeletePermissionDialogProps {
  permission: AdminPermission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePermissionDialog({
  permission,
  open,
  onOpenChange,
}: DeletePermissionDialogProps) {
  const qc = useQueryClient();

  const deletePermission = useMutation({
    mutationFn: async (id: string) => {
      const res = await WanApi.adminPermisisions.deletePermissions({ params: { id } });
      if (res.status !== 204) throw new HttpError(res.status, 'Failed to delete permission');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'permissions'] });
      onOpenChange(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le droit</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le droit{' '}
            <span className="font-semibold text-foreground">{permission?.key}</span> ?
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePermission.isPending}>
            Annuler
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={deletePermission.isPending || !permission}
            onClick={() => permission && deletePermission.mutate(permission.id)}
          >
            {deletePermission.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
