import { MuseumStatus } from '@musetrip360/museum-management';
import { Badge } from '@musetrip360/ui-core/badge';

interface MuseumStatusBadgeProps {
  status: MuseumStatus;
}

const statusStyleMap: Record<MuseumStatus, string> = {
  [MuseumStatus.Active]: 'bg-green-100 text-green-700',
  [MuseumStatus.Inactive]: 'bg-gray-100 text-gray-700',
  [MuseumStatus.Pending]: 'bg-yellow-100 text-yellow-700',
  [MuseumStatus.Archived]: 'bg-red-100 text-red-700',
  [MuseumStatus.NotVerified]: 'bg-orange-100 text-orange-700',
};

export const MuseumStatusBadge = ({ status }: MuseumStatusBadgeProps) => {
  return <Badge className={statusStyleMap[status]}>{status}</Badge>;
};
