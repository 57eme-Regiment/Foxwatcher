import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@57eme-regiment/nabu-ui';
import type { NavigationLink } from '@/features/navigation/navigation.model';
import { cn } from '@/lib/utils';
import { useHasPermission } from '@57eme-regiment/auth-browser';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';

type DashboardCardProps = {
  item: NavigationLink;
};

export function DashboardCard({
  item: { label, to, Icon, description, permission },
}: DashboardCardProps) {
  const userCanUse = useHasPermission(permission);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: userCanUse ? 0.9 : 1, y: 0 }}
      whileHover={userCanUse ? { scale: 1.03 } : undefined}
      className="select-none">
      <Link to={to} className="block h-full " disabled={!userCanUse}>
        <Card
          className={cn(
            'h-full hover:border-primary transition-colors cursor-not-allowed',
            userCanUse && 'cursor-pointer group',
          )}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'p-2 bg-gray-600/10 text-muted-foreground rounded-lg',
                  userCanUse && 'bg-primary/10 text-primary',
                )}>
                {Icon && (
                  <Icon
                    className={cn(
                      'h-6 w-6',
                      !userCanUse && 'text-muted-foreground/60',
                    )}
                  />
                )}
              </div>
              <div>
                <CardTitle
                  className={cn(
                    'group-hover:text-primary',
                    !userCanUse && 'text-muted-foreground/55',
                  )}>
                  {label}
                </CardTitle>
                <CardDescription
                  className={cn(
                    'group-hover:text-primary/50',
                    !userCanUse && 'text-muted-foreground/60',
                  )}>
                  {description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  );
}
