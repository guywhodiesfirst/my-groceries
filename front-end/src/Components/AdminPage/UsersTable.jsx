const UserTable = ({ users }) => {
  return (
    <table className="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>First name</th>
        <th>Last name</th>
        <th>Email</th>
        <th>Username</th>
        <th>Role</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
      </thead>
      <tbody>
      {users.map((user) => (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.firstName}</td>
          <td>{user.lastName}</td>
          <td>{user.email}</td>
          <td>{user.username}</td>
          <td>{user.role}</td>
          <td>
            <button className="edit-button">Edit</button>
          </td>
          <td>
            <button className="edit-button">Delete</button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default UserTable;
