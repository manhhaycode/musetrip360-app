import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '@/libs/utils';

interface CardProps extends ViewProps {
  children?: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <View className={cn('rounded-lg border border-border bg-card shadow-sm', className)} {...props}>
      {children}
    </View>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <View className={cn('p-4 pb-2', className)} {...props}>
      {children}
    </View>
  );
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <View className={cn('p-4', className)} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <View className={cn('p-4 pt-2', className)} {...props}>
      {children}
    </View>
  );
}
