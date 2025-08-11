import { IUser, UserDataTable } from '@musetrip360/user-management';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const navigate = useNavigate();

  const handleView = (user: IUser) => {
    navigate(`/users/${user.id}`);
  };

  const handleEdit = (user: IUser) => {
    navigate(`/users/${user.id}/edit`);
  };

  const handleAdd = () => {
    navigate('/users/create');
  };

  return (
    <>
      <UserDataTable onView={handleView} onEdit={handleEdit} onAdd={handleAdd} />
    </>
  );
};

export default UsersPage;
