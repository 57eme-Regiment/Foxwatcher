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
import type { AdminRole } from './roles.schema';

interface DeleteRoleDialogProps {
  role: AdminRole | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteRoleDialog({ role, open, onOpenChange }: DeleteRoleDialogProps) {
  const qc = useQueryClient();

  const deleteRole = useMutation({
    mutationFn: async (id: string) => {
      const res = await WanApi.adminRole.deleteRole({ params: { id } });
      if (res.status !== 204) throw new HttpError(res.status, 'Failed to delete role');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'roles'] });
      onOpenChange(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le rôle</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le rôle{' '}
            <span className="font-semibold text-foreground">{role?.name}</span> ?
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteRole.isPending}>
            Annuler
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={deleteRole.isPending || !role}
            onClick={() => role && deleteRole.mutate(role.id)}
          >
            {deleteRole.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
