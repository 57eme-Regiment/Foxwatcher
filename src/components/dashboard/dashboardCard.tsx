import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LinkProps } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import type { ComponentType } from 'react';

export type NavItem = {
  label: string;
  to: NonNullable<LinkProps['to']>;
  icon: ComponentType<{ className?: string }>;
  description: string;
};

type DashboardCardProps = {
  item: NavItem;
  index: number;
};

export function DashboardCard({ item: { label, to, icon: Icon, description }, index }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}>
      <Link to={to} className="block h-full">
        <Card className="h-full hover:border-primary transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{label}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  );
}
