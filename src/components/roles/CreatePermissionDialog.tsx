import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { WanApi } from '@/lib/api-client';
import { HttpError } from '@/lib/http-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  key: z
    .string()
    .min(1, 'La clé est requise')
    .regex(/^[a-z0-9_:]+$/, 'Minuscules, chiffres, _ et : uniquement'),
  description: z
    .string()
    .optional()
    .transform(v => v?.trim() || null),
});

type FormData = z.infer<typeof schema>;

interface CreatePermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePermissionDialog({
  open,
  onOpenChange,
}: CreatePermissionDialogProps) {
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const createPermission = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await WanApi.adminPermisisions.createPermissions({
        body: { key: data.key, description: data.description },
      });
      if (res.status !== 201)
        throw new HttpError(res.status, 'Failed to create permission');
      return res.body;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'permissions'] });
      onOpenChange(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(data => createPermission.mutate(data))}>
          <AlertDialogHeader>
            <AlertDialogTitle>Nouveau droit</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Field>
              <FieldLabel htmlFor="perm-key">Clé</FieldLabel>
              <Input
                id="perm-key"
                placeholder="ex: stock:inventory:read"
                autoFocus
                disabled={createPermission.isPending}
                {...register('key')}
              />
              <FieldError errors={[errors.key]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="perm-description">Description</FieldLabel>
              <Input
                id="perm-description"
                placeholder="Optionnel"
                disabled={createPermission.isPending}
                {...register('description')}
              />
            </Field>

            {createPermission.error && (
              <p className="text-sm text-destructive">
                {createPermission.error.message}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => onOpenChange(false)}
              disabled={createPermission.isPending}>
              Annuler
            </AlertDialogCancel>
            <Button type="submit" disabled={createPermission.isPending}>
              {createPermission.isPending ? 'Création...' : 'Créer'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
