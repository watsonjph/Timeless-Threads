import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ProfilePicUploader from './components/ProfilePicUploader';

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
  const userId = localStorage.getItem('userId');

  // Fetch current user info on mount
  useEffect(() => {
    async function fetchUser() {
      if (!userId) return;
      try {
        const res = await fetch('/api/auth/user/' + userId);
        const data = await res.json();
        if (res.ok) {
          setEmail(data.email || '');
          setUsername(data.username || '');
          setProfilePicUrl(data.profile_pic_url || '');
        }
      } catch (err) {
        // Optionally handle error
      }
    }
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

          {/* Email Section */}
          <form onSubmit={handleEmailChange} className="mb-8">
            <h2 className="text-xl font-semibold text-custom-dark mb-4">Email</h2>
            <div className="flex flex-row items-center gap-8 mb-4">
              <div className="flex-1 flex flex-col">
                <label className="text-custom-dark font-poppins mb-1">Current</label>
                <input type="email" className="border border-custom-dark rounded px-4 py-3 bg-custom-cream font-nunito" value={email} disabled />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-custom-dark font-poppins mb-1">New</label>
                <input type="email" className="border border-custom-dark rounded px-4 py-3 font-nunito" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="New Email" />
              </div>
            </div>
            <div className="flex flex-row justify-start">
              <button type="submit" className="bg-custom-dark text-custom-cream px-8 py-2 rounded-lg hover:bg-custom-mint transition font-poppins">Update Email</button>
            </div>
            {emailMsg && <div className="mt-2 text-sm text-custom-dark text-left font-nunito">{emailMsg}</div>}
          </form>

          {/* Username Section */}
          <form onSubmit={handleUsernameChange} className="mb-8">
            <h2 className="text-xl font-semibold text-custom-dark mb-4">Username</h2>
            <div className="flex flex-row items-center gap-8 mb-4">
              <div className="flex-1 flex flex-col">
                <label className="text-custom-dark font-poppins mb-1">Current</label>
                <input type="text" className="border border-custom-dark rounded px-4 py-3 bg-custom-cream font-nunito" value={username} disabled />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-custom-dark font-poppins mb-1">New</label>
                <input type="text" className="border border-custom-dark rounded px-4 py-3 font-nunito" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="New Username" />
              </div>
            </div>
            <div className="flex flex-row justify-start">
              <button type="submit" className="bg-custom-dark text-custom-cream px-8 py-2 rounded-lg hover:bg-custom-mint transition font-poppins">Update Username</button>
            </div>
            {usernameMsg && <div className="mt-2 text-sm text-custom-dark text-left font-nunito">{usernameMsg}</div>}
          </form>

          {/* Password Section */}
          <form onSubmit={handlePasswordChange}>
            <h2 className="text-xl font-semibold text-custom-dark mb-4">Password</h2>
            <div className="flex flex-row items-center gap-8 mb-4">
              <div className="flex-1 flex flex-col">
                <label className="text-custom-dark font-poppins mb-1">Current</label>
                <input type="password" className="border border-custom-dark rounded px-4 py-3 font-nunito" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="Current Password" />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-custom-dark font-poppins mb-1">New</label>
                <input type="password" className="border border-custom-dark rounded px-4 py-3 font-nunito" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="New Password" />
              </div>
            </div>
            <div className="flex flex-row justify-start">
              <button type="submit" className="bg-custom-dark text-custom-cream px-8 py-2 rounded-lg hover:bg-custom-mint transition font-poppins">Update Password</button>
            </div>
            {pwdMsg && <div className="mt-2 text-sm text-custom-dark text-left font-nunito">{pwdMsg}</div>}
          </form>
        </div>
      </div>
    </div>
  );
} 