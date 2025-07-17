import React, { useState, useEffect } from 'react';
import ProfilePicUploader from './components/ProfilePicUploader';

export default function Settings() {
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
    <main className="flex-1 flex flex-col items-center justify-center bg-custom-cream min-h-screen py-12">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-16 flex flex-col items-center gap-12">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center w-full mb-2">
          <ProfilePicUploader
            userId={userId}
            currentImage={profilePicUrl}
            onUpload={url => setProfilePicUrl(url)}
          />
        </div>
        {/* Separator below profile picture */}
        <div className="w-full h-px bg-custom-dark opacity-20 mb-2" />
        {/* Email Section */}
        <form onSubmit={handleEmailChange} className="w-full flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-custom-dark mb-1 font-poppins">Email</h2>
          <div className="flex flex-row items-center gap-8 mb-4 w-full">
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
            <button type="submit" className="bg-custom-dark text-custom-cream px-8 py-2 rounded-lg hover:bg-custom-mint transition font-poppins">Apply</button>
          </div>
          {emailMsg && <div className="mt-2 text-sm text-custom-dark text-left font-nunito">{emailMsg}</div>}
        </form>
        {/* Separator */}
        <div className="w-full h-px bg-custom-dark opacity-20 mb-2 mt-4" />
        {/* Username Section */}
        <form onSubmit={handleUsernameChange} className="w-full flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-custom-dark mb-1 font-poppins">Username</h2>
          <div className="flex flex-row items-center gap-8 mb-4 w-full">
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
            <button type="submit" className="bg-custom-dark text-custom-cream px-8 py-2 rounded-lg hover:bg-custom-mint transition font-poppins">Apply</button>
          </div>
          {usernameMsg && <div className="mt-2 text-sm text-custom-dark text-left font-nunito">{usernameMsg}</div>}
        </form>
        {/* Separator */}
        <div className="w-full h-px bg-custom-dark opacity-20 mb-2 mt-4" />
        {/* Password Section */}
        <form onSubmit={handlePasswordChange} className="w-full flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-custom-dark mb-1 font-poppins">Password</h2>
          <div className="flex flex-row items-center gap-8 mb-4 w-full">
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
            <button type="submit" className="bg-custom-dark text-custom-cream px-8 py-2 rounded-lg hover:bg-custom-mint transition font-poppins">Apply</button>
          </div>
          {pwdMsg && <div className="mt-2 text-sm text-custom-dark text-left font-nunito">{pwdMsg}</div>}
        </form>
      </div>
    </main>
  );
} 