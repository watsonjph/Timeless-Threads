import React, { useState, useEffect } from 'react';
import { adminUsersAPI } from './api/apiService';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [creatingUser, setCreatingUser] = useState({ email: '', username: '', password: '' });
  const [editingUser, setEditingUser] = useState(null); // user object or null

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/users');
      const data = await res.json();
      
      if (res.ok) {
        setUsers(data.users);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch('/api/auth/update-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUpdateMessage('User role updated successfully!');
        // Update the local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.user_id === userId 
              ? { ...user, role: newRole }
              : user
          )
        );
        // Clear message after 3 seconds
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to update user role');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Network error');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminUsersAPI.create(creatingUser);
      setCreatingUser({ email: '', username: '', password: '' });
      setUpdateMessage('User created successfully!');
      fetchUsers();
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch {
      setError('Failed to create user.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Edit user
  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  // Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await adminUsersAPI.update(editingUser.user_id, { username: editingUser.username, email: editingUser.email });
      setEditingUser(null);
      setUpdateMessage('User updated successfully!');
      fetchUsers();
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch {
      setError('Failed to update user.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminUsersAPI.delete(id);
      setUpdateMessage('User deleted successfully!');
      fetchUsers();
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch {
      setError('Failed to delete user.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'supplier':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-custom-cream font-poppins">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-dark mx-auto"></div>
            <p className="mt-4 text-custom-dark">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-cream font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-custom-dark">User Management</h1>
            <button
              onClick={fetchUsers}
              className="bg-custom-dark text-custom-cream px-4 py-2 rounded-lg hover:bg-custom-mint transition font-poppins"
            >
              Refresh
            </button>
          </div>

          {/* Edit User Form */}
          {editingUser && (
            <form className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleUpdateUser}>
              <input className="border rounded px-2 py-1" required placeholder="Username" value={editingUser.username} onChange={e => setEditingUser(s => ({ ...s, username: e.target.value }))} />
              <input className="border rounded px-2 py-1" required placeholder="Email" value={editingUser.email} onChange={e => setEditingUser(s => ({ ...s, email: e.target.value }))} />
              <button className="bg-custom-dark text-custom-cream rounded px-4 py-2 col-span-1 md:col-span-4" type="submit">Update User</button>
              <button className="bg-red-500 text-white rounded px-4 py-2 col-span-1 md:col-span-4" type="button" onClick={() => setEditingUser(null)}>Cancel</button>
            </form>
          )}

          {/* Messages */}
          {updateMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {updateMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto mb-12">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.firstName ? user.firstName.charAt(0).toUpperCase() : 
                               user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}`
                              : user.username || 'N/A'
                            }
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="bg-blue-500 text-white rounded px-2 py-1" onClick={() => handleEditUser(user)} disabled={user.role === 'admin'}>Edit</button>
                      <button className="bg-red-500 text-white rounded px-2 py-1" onClick={() => handleDeleteUser(user.user_id)} disabled={user.role === 'admin'}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found.</p>
            </div>
          )}

          {/* Divider and Create User Section */}
          <hr className="my-10 border-gray-300" />
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-custom-dark font-kanit">Add New User</h2>
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleCreateUser}>
              <input className="border rounded px-2 py-1" required placeholder="Email" value={creatingUser.email} onChange={e => setCreatingUser(s => ({ ...s, email: e.target.value }))} />
              <input className="border rounded px-2 py-1" required placeholder="Username" value={creatingUser.username} onChange={e => setCreatingUser(s => ({ ...s, username: e.target.value }))} />
              <input className="border rounded px-2 py-1" required placeholder="Password" type="password" value={creatingUser.password} onChange={e => setCreatingUser(s => ({ ...s, password: e.target.value }))} />
              <button className="bg-custom-dark text-custom-cream rounded px-4 py-2 col-span-1 md:col-span-4" type="submit">Add User</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 