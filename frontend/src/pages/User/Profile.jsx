import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { getMediaUrl, usersApi } from '../../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const avatarInitials = useMemo(() => user?.name?.slice(0, 2).toUpperCase() || 'TM', [user?.name]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError('');
    setSuccess('');

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, JPEG, PNG, and WEBP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5 MB or smaller.');
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Choose an image first.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const response = await usersApi.uploadAvatar(formData);
      updateUser(response.data.user);
      setSuccess('Profile photo updated successfully.');
      setSelectedFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to upload profile photo');
    } finally {
      setUploading(false);
    }
  };

  const avatarUrl = user?.avatarUrl ? getMediaUrl(user.avatarUrl) : '';

  return (
    <div className="workspace-shell">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="workspace-main">
        <section className="profile-shell">
          <div className="page-topbar">
            <div>
              <h1 className="section-title">Profile</h1>
              <p className="section-subtitle">Upload a profile image and personalize your workspace.</p>
            </div>
          </div>

          <div className="profile-layout">
            <div className="workspace-card profile-preview-card">
              <div className="profile-preview">
                {previewUrl || avatarUrl ? (
                  <img
                    className="profile-photo"
                    src={previewUrl || avatarUrl}
                    alt={user?.name || 'Profile photo'}
                  />
                ) : (
                  <div className="avatar avatar-xl">{avatarInitials}</div>
                )}
              </div>
              <h2>{user?.name}</h2>
              <p className="meta-note">{user?.email}</p>
              <span className={`role-pill ${user?.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                {user?.role}
              </span>
            </div>

            <form className="workspace-card profile-form" onSubmit={handleUpload}>
              <div>
                <h2 className="section-title">Upload Photo</h2>
                <p className="section-subtitle">
                  JPG, JPEG, PNG, or WEBP. Maximum size is 5 MB.
                </p>
              </div>

              <label className="upload-dropzone">
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
                <span>Select a profile image from your device</span>
                <strong>{selectedFile ? selectedFile.name : 'No file selected'}</strong>
              </label>

              {error ? <p className="form-error">{error}</p> : null}
              {success ? <p className="form-success">{success}</p> : null}

              <div className="form-actions">
                <button type="button" className="button button-ghost" onClick={() => navigate(-1)}>
                  Back
                </button>
                <button type="submit" className="button button-primary" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;