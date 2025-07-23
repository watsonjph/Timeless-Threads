import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ProfilePicUploader from './components/ProfilePicUploader';
import Modal from './components/Modal';

export default function Account() {
  // State for each form
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [nameMsg, setNameMsg] = useState('');
  const userId = localStorage.getItem('userId');

  // Modal state
  const [modal, setModal] = useState(null); // 'email' | 'username' | 'password' | null

  // Fetch user info (moved outside useEffect for reuse)
  async function fetchUser() {
    if (!userId) return;
    try {
      const res = await fetch('/api/auth/user/' + userId);
      const data = await res.json();
      if (res.ok) {
        setEmail(data.email || '');
        setUsername(data.username || '');
        setProfilePicUrl(data.profile_pic_url || '');
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
      }
    } catch (err) {
      // Optionally handle error
    }
  }

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailMsg('');
    if (!newEmail) {
      setEmailMsg('Please enter a new email.');
      return;
    }
    try {
      const res = await fetch('/api/auth/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setEmailMsg('Email updated successfully.');
        setEmail(newEmail);
        setNewEmail('');
      } else {
        setEmailMsg(data.error || 'Failed to update email.');
      }
    } catch (err) {
      setEmailMsg('Network error.');
    }
  };

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    setUsernameMsg('');
    if (!newUsername) {
      setUsernameMsg('Please enter a new username.');
      return;
    }
    try {
      const res = await fetch('/api/auth/update-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newUsername })
      });
      const data = await res.json();
      if (res.ok) {
        setUsernameMsg('Username updated successfully.');
        setUsername(newUsername);
        setNewUsername('');
      } else {
        setUsernameMsg(data.error || 'Failed to update username.');
      }
    } catch (err) {
      setUsernameMsg('Network error.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdMsg('');
    if (!currentPwd || !newPwd) {
      setPwdMsg('Please enter your current and new password.');
      return;
    }
    // Password must be at least 8 chars, contain a number AND a special char
    if (!/^.{8,}$/.test(newPwd) || !/\d/.test(newPwd) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPwd)) {
      setPwdMsg('Password must be at least 8 characters and include a number and a special character.');
      return;
    }
    try {
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentPassword: currentPwd, newPassword: newPwd })
      });
      const data = await res.json();
      if (res.ok) {
        setPwdMsg('Password updated successfully.');
        setCurrentPwd('');
        setNewPwd('');
      } else {
        setPwdMsg(data.error || 'Failed to update password.');
      }
    } catch (err) {
      setPwdMsg('Network error.');
    }
  };

  const handleNameChange = async (e) => {
    e.preventDefault();
    setNameMsg('');
    if (!newFirstName || !newLastName) {
      setNameMsg('Please enter both first and last name.');
      return;
    }
    try {
      const res = await fetch('/api/auth/update-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, firstName: newFirstName, lastName: newLastName })
      });
      const data = await res.json();
      if (res.ok) {
        setNameMsg('Name updated successfully.');
        setNewFirstName('');
        setNewLastName('');
        setModal(null);
        fetchUser(); // Re-fetch user data from backend
      } else {
        setNameMsg(data.error || 'Failed to update name.');
      }
    } catch (err) {
      setNameMsg('Network error.');
    }
  };

  return (
    <div className="min-h-screen bg-custom-cream font-poppins">
      <Navbar alwaysHovered={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-custom-dark mb-8">Account Settings</h1>
          {/* Profile Picture Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-custom-dark mb-4">Profile Picture</h2>
            <ProfilePicUploader
              userId={userId}
              currentImage={profilePicUrl}
              onUpload={url => setProfilePicUrl(url)}
            />
          </div>
          {/* Email Row */}
          <div className="flex flex-row items-center justify-between mb-6">
            <div className="flex flex-col">
              <span className="text-custom-dark font-poppins text-lg">Email</span>
              <span className="text-custom-dark font-nunito">{email}</span>
            </div>
            <button className="bg-custom-dark text-custom-cream px-6 py-2 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer" onClick={() => setModal('email')}>Edit</button>
          </div>
          <div className="w-full h-px bg-custom-dark opacity-20 mb-6" />
          {/* Username Row */}
          <div className="flex flex-row items-center justify-between mb-6">
            <div className="flex flex-col">
              <span className="text-custom-dark font-poppins text-lg">Username</span>
              <span className="text-custom-dark font-nunito">{username}</span>
            </div>
            <button className="bg-custom-dark text-custom-cream px-6 py-2 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer" onClick={() => setModal('username')}>Edit</button>
          </div>
          <div className="w-full h-px bg-custom-dark opacity-20 mb-6" />
          {/* Name Row */}
          <div className="flex flex-row items-center justify-between mb-6">
            <div className="flex flex-col">
              <span className="text-custom-dark font-poppins text-lg">Name</span>
              <span className="text-custom-dark font-nunito">{[firstName, lastName].filter(Boolean).join(' ')}</span>
            </div>
            <button className="bg-custom-dark text-custom-cream px-6 py-2 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer" onClick={() => { setModal('name'); setNewFirstName(firstName); setNewLastName(lastName); }}>Edit</button>
          </div>
          <div className="w-full h-px bg-custom-dark opacity-20 mb-6" />
          {/* Password Row */}
          <div className="flex flex-row items-center justify-between mb-6">
            <div className="flex flex-col">
              <span className="text-custom-dark font-poppins text-lg">Password</span>
              <span className="text-custom-dark font-nunito">••••••••</span>
            </div>
            <button className="bg-custom-dark text-custom-cream px-6 py-2 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer" onClick={() => setModal('password')}>Edit</button>
          </div>
          {/* Email Modal */}
          <Modal isOpen={modal === 'email'} onClose={() => { setModal(null); setNewEmail(''); setEmailMsg(''); }} title="Edit Email">
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div>
                <label className="block text-custom-dark font-medium mb-2">Current Email</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" value={email} disabled />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">New Email</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="New Email" required />
              </div>
              {emailMsg && <div className="text-sm text-custom-dark">{emailMsg}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setModal(null); setNewEmail(''); setEmailMsg(''); }} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer">Update Email</button>
              </div>
            </form>
          </Modal>
          {/* Username Modal */}
          <Modal isOpen={modal === 'username'} onClose={() => { setModal(null); setNewUsername(''); setUsernameMsg(''); }} title="Edit Username">
            <form onSubmit={handleUsernameChange} className="space-y-4">
              <div>
                <label className="block text-custom-dark font-medium mb-2">Current Username</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" value={username} disabled />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">New Username</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="New Username" required />
              </div>
              {usernameMsg && <div className="text-sm text-custom-dark">{usernameMsg}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setModal(null); setNewUsername(''); setUsernameMsg(''); }} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer">Update Username</button>
              </div>
            </form>
          </Modal>
          {/* Name Modal */}
          <Modal isOpen={modal === 'name'} onClose={() => { setModal(null); setNewFirstName(''); setNewLastName(''); setNameMsg(''); }} title="Edit Name">
            <form onSubmit={handleNameChange} className="space-y-4">
              <div>
                <label className="block text-custom-dark font-medium mb-2">First Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={newFirstName} onChange={e => setNewFirstName(e.target.value)} placeholder="First Name" required />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Last Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={newLastName} onChange={e => setNewLastName(e.target.value)} placeholder="Last Name" required />
              </div>
              {nameMsg && <div className="text-sm text-custom-dark">{nameMsg}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setModal(null); setNewFirstName(''); setNewLastName(''); setNameMsg(''); }} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer">Update Name</button>
              </div>
            </form>
          </Modal>
          {/* Password Modal */}
          <Modal isOpen={modal === 'password'} onClose={() => { setModal(null); setCurrentPwd(''); setNewPwd(''); setPwdMsg(''); }} title="Edit Password">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-custom-dark font-medium mb-2">Current Password</label>
                <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="Current Password" required />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">New Password</label>
                <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="New Password" required />
              </div>
              <div className="text-xs text-gray-500">Password must be at least 8 characters and include a number and a special character.</div>
              {pwdMsg && <div className="text-sm text-custom-dark">{pwdMsg}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setModal(null); setCurrentPwd(''); setNewPwd(''); setPwdMsg(''); }} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer">Update Password</button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
} 