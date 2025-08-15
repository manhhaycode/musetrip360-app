/**
 * @fileoverview Host Info Component
 *
 * Displays host information and menu options
 */

import { Avatar, AvatarFallback, AvatarImage } from '@musetrip360/ui-core/avatar';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card } from '@musetrip360/ui-core/card';
import { cn } from '@musetrip360/ui-core/utils';
import { Crown, MoreHorizontal } from 'lucide-react';
import React from 'react';

interface HostInfoProps {
  hostName?: string;
  hostTitle?: string;
  hostAvatar?: string;
  isLive?: boolean;
  viewerCount?: number;
  onMenuClick?: () => void;
  className?: string;
}

export const HostInfo: React.FC<HostInfoProps> = ({
  hostName = 'Adam Joseph',
  hostTitle = 'Manager',
  hostAvatar,
  isLive = true,
  viewerCount = 4,
  onMenuClick,
  className,
}) => {
  // Generate initials from host name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className={cn(
        'p-3 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Host Avatar with Crown */}
        <div className="relative shrink-0">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
            {hostAvatar && <AvatarImage src={hostAvatar} alt={hostName} />}
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
              {getInitials(hostName)}
            </AvatarFallback>
          </Avatar>
          {/* Host Crown Badge */}
          <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
            <Crown className="h-3 w-3 text-primary-foreground fill-current" />
          </div>
        </div>

        {/* Host Info */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-foreground truncate" title={hostName}>
              {hostName}
            </p>
            <Badge variant="secondary" className="text-xs px-2 py-0.5 shrink-0">
              Host
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate" title={hostTitle}>
            {hostTitle}
          </p>

          {/* Live Status and Viewer Count */}
          <div className="flex items-center gap-2 mt-1">
            {isLive && (
              <Badge variant="destructive" className="text-xs px-2 py-0.5 animate-pulse">
                🔴 LIVE
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {viewerCount} viewer{viewerCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 shrink-0 hover:bg-primary/10"
          onClick={onMenuClick}
          title="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
