import { Button } from '@/components/core/ui/button';
import { Text } from '@/components/core/ui/text';
import { cn } from '@/libs/utils';
import React from 'react';
import { View } from 'react-native';

interface ModelViewerControlsProps {
  className?: string;
  onToggleRotation?: () => void;
  onResetCamera?: () => void;
  isAutoRotating?: boolean;
}

export function ModelViewerControls({
  className,
  onToggleRotation,
  onResetCamera,
  isAutoRotating = true,
}: ModelViewerControlsProps) {
  return (
    <View
      className={cn(
        'bg-card/90 backdrop-blur-md rounded-lg',
        'p-3 flex-row gap-3 items-center',
        'border border-border shadow-lg',
        className
      )}
    >
      <Button
        variant={isAutoRotating ? 'outline' : 'default'}
        size="sm"
        onPress={onToggleRotation}
        className="rounded-lg"
      >
        <Text className="text-xs">{isAutoRotating ? 'Tắt xoay' : 'Bật xoay'}</Text>
      </Button>

      <Button variant="outline" size="sm" onPress={onResetCamera} className="rounded-lg">
        <Text className="text-xs">Đặt lại góc nhìn</Text>
      </Button>
    </View>
  );
}
