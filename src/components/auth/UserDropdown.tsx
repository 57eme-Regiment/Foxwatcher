import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth';
import {
  IconBulb,
  IconForklift,
  IconHome,
  IconLoader2,
  IconLogout,
  IconShieldLock,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export function UserDropdown() {
  const session = authClient.useSession();
  const user = session.data?.user;
  const navigate = useNavigate();

  const logout = useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: () => navigate({ to: '/unauthenticated' }),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted hover:cursor-pointer">
        <button className="group size-9 rounded-full">
          <Avatar className="mr-2 size-full group-active:scale-95">
            <AvatarFallback className="bg-card">
              {user?.name?.slice(0, 1).toUpperCase()}
            </AvatarFallback>
            {user?.image && <AvatarImage src={user.image} />}
          </Avatar>
        </button>
        <span className="max-w-32 truncate">{session.data?.user?.name}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => navigate({ to: '/' })}
            className="hover:cursor-pointer">
            <IconHome className="mr-2 size-4" />
            Dashboard
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => navigate({ to: '/wanshitong' })}
            className="hover:cursor-pointer">
            <IconShieldLock className="mr-2 size-4" />
            WanShiTong
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate({ to: '/krang' })}
            className="hover:cursor-pointer">
            <IconBulb className="mr-2 size-4" />
            Krang
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate({ to: '/renenutet' })}
            className="hover:cursor-pointer">
            <IconForklift className="mr-2 size-4" />
            Renenutet
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              logout.mutate();
            }}
            className="hover:cursor-pointer">
            {logout.isPending ? (
              <IconLoader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <IconLogout className="mr-2 size-4" />
            )}
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
