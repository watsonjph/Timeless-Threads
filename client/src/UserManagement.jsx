import React, { useState, useEffect } from 'react';
import { adminUsersAPI } from './api/apiService';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
      setShowAddModal(false);
      setUpdateMessage('User created successfully!');
      fetchUsers();
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch {
      setError('Failed to create user.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAddUserClick = () => {
    setShowAddModal(true);
    setCreatingUser({ email: '', username: '', password: '' });
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setCreatingUser({ email: '', username: '', password: '' });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  // Edit user
  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  // Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await adminUsersAPI.update(editingUser.user_id, { username: editingUser.username, email: editingUser.email });
      setShowEditModal(false);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-dark mx-auto"></div>
          <p className="mt-4 text-custom-dark">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-custom-dark">User Management</h1>
          <div className="flex gap-3">
            <button
              onClick={handleAddUserClick}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-poppins cursor-pointer"
            >
              Add User
            </button>
                          <button
                onClick={fetchUsers}
                className="bg-custom-dark text-custom-cream px-4 py-2 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
              >
                Refresh
              </button>
          </div>
        </div>



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
                        <div className="h-10 w-10 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors overflow-hidden bg-gray-200 flex items-center justify-center">
                          <img
                            src={user.profile_pic_url || '/api/uploads/default-pfp.png'}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Hide the image and show fallback initials
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          {/* Fallback initials when image fails to load */}
                          <div 
                            className="w-full h-full flex items-center justify-center hidden"
                            style={{ display: 'none' }}
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {user.firstName ? user.firstName.charAt(0).toUpperCase() : 
                               user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
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
                      <button className="bg-blue-500 text-white rounded px-2 py-1 cursor-pointer" onClick={() => handleEditUser(user)} disabled={user.role === 'admin'}>Edit</button>
                      <button className="bg-red-500 text-white rounded px-2 py-1 cursor-pointer" onClick={() => handleDeleteUser(user.user_id)} disabled={user.role === 'admin'}>Delete</button>
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
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-custom-dark">Add New User</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-custom-dark font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  placeholder="Enter email"
                  value={creatingUser.email}
                  onChange={e => setCreatingUser(s => ({ ...s, email: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-custom-dark font-medium mb-2">Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  placeholder="Enter username"
                  value={creatingUser.username}
                  onChange={e => setCreatingUser(s => ({ ...s, username: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-custom-dark font-medium mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  placeholder="Enter password"
                  value={creatingUser.password}
                  onChange={e => setCreatingUser(s => ({ ...s, password: e.target.value }))}
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
                >
                  Add User
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-custom-dark">Edit User</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-custom-dark font-medium mb-2">Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  placeholder="Enter username"
                  value={editingUser.username}
                  onChange={e => setEditingUser(s => ({ ...s, username: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="block text-custom-dark font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  placeholder="Enter email"
                  value={editingUser.email}
                  onChange={e => setEditingUser(s => ({ ...s, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 