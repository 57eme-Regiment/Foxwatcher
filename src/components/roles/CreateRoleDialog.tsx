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
import { HttpError } from '@/lib/http-error';
import { WanApi } from '@/lib/api-client';
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
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional().transform(v => v?.trim() || undefined),
});

type FormData = z.infer<typeof schema>;

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoleDialog({ open, onOpenChange }: CreateRoleDialogProps) {
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const createRole = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await WanApi.adminRole.createRole({ body: data });
      if (res.status !== 201) throw new HttpError(res.status, 'Failed to create role');
      return res.body;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'roles'] });
      onOpenChange(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(data => createRole.mutate(data))}>
          <AlertDialogHeader>
            <AlertDialogTitle>Nouveau rôle</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Field>
              <FieldLabel htmlFor="role-key">Clé</FieldLabel>
              <Input
                id="role-key"
                placeholder="ex: admin:users:read"
                autoFocus
                disabled={createRole.isPending}
                {...register('key')}
              />
              <FieldError errors={[errors.key]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="role-name">Nom</FieldLabel>
              <Input
                id="role-name"
                placeholder="ex: Administrateur"
                disabled={createRole.isPending}
                {...register('name')}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="role-description">Description</FieldLabel>
              <Input
                id="role-description"
                placeholder="Optionnel"
                disabled={createRole.isPending}
                {...register('description')}
              />
            </Field>

            {createRole.error && (
              <p className="text-sm text-destructive">{createRole.error.message}</p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => onOpenChange(false)}
              disabled={createRole.isPending}
            >
              Annuler
            </AlertDialogCancel>
            <Button type="submit" disabled={createRole.isPending}>
              {createRole.isPending ? 'Création...' : 'Créer'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
