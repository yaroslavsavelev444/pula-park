import { Building, MapPin, Landmark, Mail, Phone } from "lucide-react";
import Button from "../UI/Buttons/Button";
import { observer } from "mobx-react-lite";
import "./Profile.css";
import { IoMdSettings } from "react-icons/io";
import Empty from "../Empty/Empty";

const CompanyProfile = ({ companyStore, handleCheckIsEmailVerified, handleOpenSettingsModal }) => {
  console.log("companyStore.hasCompany", companyStore.hasCompany);
  return (
    <div className="company-profile">
      {companyStore.hasCompany === true ? (
        <div className="company-profile">
          <div className="company-info">
            {companyStore?.company?.avatarUrl ? (
              <div className="avatar-preview">
                <img
                  src={companyStore?.company?.avatarUrl}
                  alt="Company Avatar"
                  className="cropped-avatar"
                />
                <p>
                  <h1>{companyStore?.company?.companyName}</h1>
                </p>
                <IoMdSettings className="settings-icon"  onClick={handleOpenSettingsModal}/>
              </div>
            ) : (
              <div className="default-avatar">No Avatar</div>
            )}
            <p>
              <MapPin size={18} /> {companyStore?.company?.companyAddress}
            </p>
            <p>
              <Landmark size={18} /> {companyStore?.company?.companyInn}
            </p>
            <p>
              <Mail size={18} /> {companyStore?.company?.contacts?.email}
            </p>
            <p>
              <Phone size={18} /> {companyStore?.company?.contacts?.phone}
            </p>
          </div>
        </div>
      ) : (
        <div className="company-profile">
          <Empty text="Нет профиля компании" />
          <div className="btn-wrapper-company">
            <Button onClick={handleCheckIsEmailVerified}>Добавить</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(CompanyProfile);
