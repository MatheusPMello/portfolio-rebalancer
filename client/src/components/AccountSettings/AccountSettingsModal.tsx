import { useEffect, useState } from 'react';
import { Modal } from '../ModalLayout';
import { DeleteAccountSection } from './DeleteAccountSection';
import { UpdateEmailForm } from './UpdateEmailForm';
import { UpdatePasswordForm } from './UpdatePasswordForm';
import userService from '../../services/userService';

export function AccountSettingsModal({ show, onClose }: Readonly<{ show: boolean; onClose: () => void }>) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'danger'>('profile');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true);
      setProfileError(null);
      const data = await userService.getProfile();
      setCurrentUserEmail(data.email);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setProfileError('Failed to load user profile. Please try again.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchProfile();
      setActiveTab('profile');
    }
  }, [show]);

  const handleEmailUpdated = (newEmail: string) => {
    setCurrentUserEmail(newEmail);
  };

  let content;
  if (isLoadingProfile) {
    content = (
      <div className="d-flex justify-content-center align-items-center h-100 py-5">
        <output className="spinner-border text-primary">
          <span className="visually-hidden">Loading profile...</span>
        </output>
      </div>
    );
  } else if (profileError) {
    content = <div className="alert alert-danger py-2 px-3 small">{profileError}</div>;
  } else {
    content = (
      <div className="h-100">
        {activeTab === 'profile' && (
          <UpdateEmailForm currentEmail={currentUserEmail} onSuccess={handleEmailUpdated} />
        )}
        {activeTab === 'security' && <UpdatePasswordForm />}
        {activeTab === 'danger' && (
          <DeleteAccountSection />
        )}
      </div>
    );
  }

  return (
    <Modal show={show} onClose={onClose} title="Account Settings" size="lg">
      <div className="d-flex gap-4" style={{ minHeight: '450px', height: '450px' }}>
        {/* Navigation Sidebar */}
        <div 
          className="d-flex flex-column gap-2 border-end pe-3" 
          style={{ width: '220px', flexShrink: 0 }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`btn text-start w-100 px-3 d-flex align-items-center fw-medium ${
              activeTab === 'profile' ? 'btn-custom-solid-primary' : 'btn-light text-secondary border'
            }`}
            style={{ minHeight: '44px', borderRadius: '8px', transition: 'all 0.2s' }}
          >
            Email & Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`btn text-start w-100 px-3 d-flex align-items-center fw-medium ${
              activeTab === 'security' ? 'btn-custom-solid-primary' : 'btn-light text-secondary border'
            }`}
            style={{ minHeight: '44px', borderRadius: '8px', transition: 'all 0.2s' }}
          >
            Security & Password
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('danger')}
            className={`btn text-start w-100 px-3 d-flex align-items-center fw-medium ${
              activeTab === 'danger' ? 'btn-danger text-white' : 'btn-light text-danger border border-danger-subtle'
            }`}
            style={{ minHeight: '44px', borderRadius: '8px', transition: 'all 0.2s' }}
          >
            Danger Zone
          </button>
        </div>

        {/* Content Panel */}
        <div className="flex-grow-1 ps-2" style={{ minWidth: 0, overflowY: 'auto', height: '100%' }}>
          {content}
        </div>
      </div>
    </Modal>
  );
}
