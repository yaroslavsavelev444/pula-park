import { Mail, LogOut, RefreshCcw } from "lucide-react";
import Button from "../UI/Buttons/Button";
import CompanyProfile from "./CompanyProfile";
const UserProfile = ({ store, companyStore, handleCheckIsEmailVerified, handleResendEmailVerification, handleAlertLogout, handleChangePasswordModal, handleOpenSettingsModal }) => {
  return (
    <div className="profile-card">
        <CompanyProfile
          companyStore={companyStore}
          handleCheckIsEmailVerified={handleCheckIsEmailVerified}
          handleOpenSettingsModal={handleOpenSettingsModal}
        />
          <div className="profile-header">
            <div className="avatar-wrapper">
              <div
                className={`status-indicator ${
                  store.user.isActivated ? "active" : "inactive"
                }`}
              />
            </div>
            <div className="profile-info">
              <h1>
                {store.user.name} {store.user.surname}
              </h1>
              <div className="email-wrapper">
                <p>{store.user.email}</p>
                <span
                  className={`badge ${
                    store.user.isActivated ? "activated" : "not-activated"
                  }`}
                >
                  {store.user.isActivated ? "Активирован" : "Не активирован"}
                </span>
              </div>
            </div>
          </div>

          {!store.user.isActivated && (
            <div className="email-warning">
              <Mail size={16} />
              <span className="email-warning-text">
                Подтвердите почту, чтобы активировать аккаунт
              </span>
              {store.user.isActivationLinkExpired === true && (
                <RefreshCcw
                  onClick={handleResendEmailVerification}></RefreshCcw>
              )}
            </div>
          )}
        </div>
  );
};

export default UserProfile;