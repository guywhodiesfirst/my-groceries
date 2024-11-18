const UsersTable = ({ users, onEdit, onDelete }) => {
  return (
    <table className="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Email</th>
        <th>Roles</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
      </thead>
      <tbody>
      {users.map((user) => (
        <tr key={user._id}>
          <td>{user._id}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>{user.roles.join(', ')}</td>
          <td>
            <button className="edit-button" onClick={() => onEdit(user)}>
              Change roles
            </button>
          </td>
          <td>
            <button className="edit-button" onClick={() => onDelete(user)}>Delete</button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
