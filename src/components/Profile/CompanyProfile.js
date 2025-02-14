import { Building, MapPin, Landmark, Mail, Phone } from "lucide-react";
import Button from "../UI/Buttons/Button";

const CompanyProfile = ({ companyStore, onAddCompany }) => {
  return (
    <div className="company-profile">
      {companyStore.company !==null ? (
        <div className="company-info">
          {companyStore.company.avatarUrl ? (
            <img src={companyStore.company.avatarUrl} alt="Company Avatar" className="cropped-avatar" />
          ) : (
            <div className="default-avatar">No Avatar</div>
          )}
          <p><Building size={18} /> {companyStore.company?.companyName}</p>
          <p><MapPin size={18} /> {companyStore.company?.companyAddress}</p>
          <p><Landmark size={18} /> {companyStore.company?.companyInn}</p>
        </div>
      ) : (
        <div className="btn-wrapper-company">
          <h4>Профиль компании</h4>
          <Button onClick={onAddCompany}>Добавить</Button>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;