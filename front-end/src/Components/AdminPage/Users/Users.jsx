import { useCallback, useEffect, useState } from 'react';
import './Users.css';
import UsersTable from './UsersTable.jsx';
import { UsersApi } from '../../../api/UsersApi.js';
import FilterList from '../../Categories/FilterList.jsx';
import Modal from '../../Modals/Modal.jsx';
import Checkbox from '../../UI/Checkbox/Checkbox.jsx';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [roles, setRoles] = useState({ admin: false, runner: false, blocked: false });
  const [loading, setLoading] = useState(false);

  const types = ['admin', 'runner', 'blocked'];

  const closeModal = () => {
    setSelectedUser(null);
    setIsUpdating(false);
    setIsDeleting(false);
    setRoles({ admin: false, runner: false, blocked: false });
  };

  const getUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await UsersApi.getUsers(selectedType);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    getUsers().then();
  }, [getUsers]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setRoles({
      admin: user.roles.includes('admin'),
      runner: user.roles.includes('runner'),
      blocked: user.roles.includes('blocked'),
    });
    setIsUpdating(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await UsersApi.deleteUser(selectedUser._id);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== selectedUser._id));
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role, value) => {
    setRoles((prevRoles) => ({ ...prevRoles, [role]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = {
        userId: selectedUser._id,
        ...roles,
      };
      await UsersApi.changeRoles(user);
      closeModal();
      getUsers().then();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FilterList items={types} selected={selectedType} onSelect={setSelectedType} />
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <UsersTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {isUpdating && (
        <Modal isOpen={isUpdating} onClose={closeModal}>
          <form onSubmit={handleFormSubmit} className='users-form'>
            <h3>Editing Roles for {selectedUser._id}</h3>
            <Checkbox
              label="admin"
              defaultChecked={roles.admin}
              onChange={(value) => handleRoleChange('admin', value)}
            />
            <Checkbox
              label="runner"
              defaultChecked={roles.runner}
              onChange={(value) => handleRoleChange('runner', value)}
            />
            <Checkbox
              label="blocked"
              defaultChecked={roles.blocked}
              onChange={(value) => handleRoleChange('blocked', value)}
            />
            <button type="submit" className="create-button">Save</button>
          </form>
        </Modal>
      )}
      {isDeleting && (
        <Modal isOpen={isDeleting} onClose={closeModal}>
          <>
            <h3>Are you sure you want to delete the user with ID: {selectedUser?._id}?</h3>
            <button className="create-button" onClick={confirmDelete}>
              Yes, delete
            </button>
          </>
        </Modal>
      )}
    </>
  );
}
