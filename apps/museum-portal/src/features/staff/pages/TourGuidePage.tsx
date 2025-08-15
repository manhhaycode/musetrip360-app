import withPermission from '@/hocs/withPermission';
import TourGuideDataTable from '../components/TourGuideDataTable';
import { PERMISSION_USER_VIEW, PERMISSION_USER_MANAGEMENT } from '@musetrip360/rolebase-management';

const TourGuidePage = withPermission(() => {
  return (
    <>
      <TourGuideDataTable />
    </>
  );
}, [PERMISSION_USER_VIEW, PERMISSION_USER_MANAGEMENT]);

export default TourGuidePage;
