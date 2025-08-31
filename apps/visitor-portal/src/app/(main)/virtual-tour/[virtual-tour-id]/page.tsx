import { VirtualTourDetailPage } from '@/components/virtual-tour/VirtualTourDetailPage';

interface VirtualTourPageProps {
  params: Promise<{
    'virtual-tour-id': string;
  }>;
}

export default async function VirtualTourPage({ params }: VirtualTourPageProps) {
  const { 'virtual-tour-id': virtualTourId } = await params;

  return <VirtualTourDetailPage tourId={virtualTourId} />;
}

export async function generateMetadata({ params }: VirtualTourPageProps) {
  const { 'virtual-tour-id': virtualTourId } = await params;

  return {
    title: `Tour ảo ${virtualTourId} | MuseTrip360`,
    description: 'Khám phá không gian 360° với công nghệ thực tế ảo hiện đại',
  };
}
