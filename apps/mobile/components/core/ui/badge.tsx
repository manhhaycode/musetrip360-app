import React from 'react';
import { View, ViewProps } from 'react-native';
import { Text } from './text';
import { cn } from '@/libs/utils';

interface BadgeProps extends ViewProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children?: React.ReactNode;
}

const badgeVariants = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  outline: 'border border-border bg-transparent text-foreground',
};

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <View className={cn('inline-flex items-center rounded-md px-2 py-1', badgeVariants[variant], className)} {...props}>
      {children}
    </View>
  );
}
