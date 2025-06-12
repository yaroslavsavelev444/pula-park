import { IoMdSettings } from "react-icons/io";
import CompanyProfile from "./CompanyProfile";
import "./Profile.css";

const UserProfile = ({
  store,
  companyStore,
  handleOpenSettingsModal,
  user
}) => {
  return (
    <div className="profile-card">
      {user.role === 'Car_park' && (
         <CompanyProfile
        companyStore={companyStore}
      />
      )}
      <div className="profile-header">
        <div className="avatar-wrapper">
          <div
            className={`status-indicator ${
              store?.user?.isActivated ? "active" : "inactive"
            }`}
          />
        </div>
        <div className="profile-info">
          <h1 style={{textAlign:"center", display:"flex", alignItems:"center", gap:"10px"
          }}>
            {store?.user?.name} {store?.user?.surname}
            <IoMdSettings className="settings-icon"  color="gray"  onClick={handleOpenSettingsModal}/>
          </h1>
          <div className="email-wrapper">
            <p>{store?.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
