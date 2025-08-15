import withPermission from '@/hocs/withPermission';
import StaffDataTable from '../components/StaffDataTable';
import { PERMISSION_USER_MANAGEMENT, PERMISSION_USER_VIEW } from '@musetrip360/rolebase-management';

const StaffPage = withPermission(() => {
  return (
    <>
      <StaffDataTable />
    </>
  );
}, [PERMISSION_USER_VIEW, PERMISSION_USER_MANAGEMENT]);

export default StaffPage;
