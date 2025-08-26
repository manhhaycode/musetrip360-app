import React from 'react';
import { TourMode } from '../TourSync/SyncedVirtualTourViewer';
import { ParticipantRoleEnum } from '@musetrip360/event-management/types';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Button } from '@musetrip360/ui-core/button';
import { Badge } from '@musetrip360/ui-core/badge';
import { cn } from '@musetrip360/ui-core/utils';
import { Users, Map, ArrowRight, WifiOff, Radio } from 'lucide-react';

export interface TourModeSelectorProps {
  /** Current tour mode */
  currentMode: TourMode;

  /** Callback when mode changes */
  onModeChange: (mode: TourMode) => void;

  /** Whether mode switching is disabled */
  disabled?: boolean;

  /** User's role in the room */
  userRole: ParticipantRoleEnum | null;

  /** Whether tour sync is connected */
  isConnected: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Tour Mode Selector Component
 * Allows users to switch between follow-guide and free-explore modes
 */
export const TourModeSelector: React.FC<TourModeSelectorProps> = ({
  currentMode,
  onModeChange,
  disabled = false,
  userRole,
  isConnected,
  className = '',
}) => {
  const isFreeExploreMode = currentMode === 'free-explore';

  // Determine if user can switch modes
  const canSwitchMode = !disabled && isConnected;

  // Mode descriptions
  const modes = {
    'follow-guide': {
      label: 'Follow Guide',
      description: 'Sync with guide',
      icon: Users,
      color: 'blue',
    },
    'free-explore': {
      label: 'Free Explore',
      description: 'Explore freely',
      icon: Map,
      color: 'green',
    },
  };

  const currentModeInfo = modes[currentMode];
  const alternativeMode: TourMode = isFreeExploreMode ? 'follow-guide' : 'free-explore';
  const alternativeModeInfo = modes[alternativeMode];
  const CurrentIcon = currentModeInfo.icon;
  const AlternativeIcon = alternativeModeInfo.icon;

  return (
    <Card className={cn('w-56 bg-card/95 backdrop-blur-sm py-0 border-border shadow-lg', className)}>
      <CardContent className="p-3 space-y-3">
        {/* Current Mode Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CurrentIcon className="h-4 w-4 text-primary" />
            <div className="min-w-0">
              <div className="font-medium text-sm text-foreground truncate">{currentModeInfo.label}</div>
              <div className="text-xs text-muted-foreground">{currentModeInfo.description}</div>
            </div>
          </div>

          {/* Role indicator */}
          {userRole && (
            <Badge variant={userRole === 'TourGuide' ? 'default' : 'secondary'} className="text-xs px-2 py-0.5">
              {userRole === 'TourGuide' ? 'Guide' : 'Visitor'}
            </Badge>
          )}
        </div>

        {/* Mode Switch Button */}
        <Button
          onClick={() => onModeChange(alternativeMode)}
          disabled={!canSwitchMode}
          variant="outline"
          size="sm"
          className="w-full justify-between h-8"
        >
          <div className="flex flex-1 min-w-0 items-center gap-2">
            <AlternativeIcon className="h-3.5 w-3.5" />
            <span className="text-xs truncate">Switch to {alternativeModeInfo.label}</span>
          </div>
          {!isConnected ? <WifiOff className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
        </Button>

        {/* Connection Status */}
        {!isConnected && (
          <div className="text-xs text-destructive flex items-center gap-1.5">
            <WifiOff className="h-3 w-3" />
            <span>Sync unavailable</span>
          </div>
        )}

        {/* Broadcasting indicator for guides in free-explore */}
        {userRole === 'TourGuide' && isFreeExploreMode && (
          <div className="text-xs text-emerald-600 flex items-center gap-1.5">
            <Radio className="h-3 w-3" />
            <span>Broadcasting to attendees</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
