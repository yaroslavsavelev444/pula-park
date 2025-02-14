import { Mail, LogOut } from "lucide-react";
import Button from "../UI/Buttons/Button";

const UserProfile = ({ user, onLogout }) => {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="avatar-wrapper">
          <div className={`status-indicator ${user.isActivated ? "active" : "inactive"}`} />
        </div>
        <div className="profile-info">
          <h2>{user.name} {user.surname}</h2>
          <span className={`badge ${user.isActivated ? "activated" : "not-activated"}`}>
            {user.isActivated ? "Активирован" : "Не активирован"}
          </span>
        </div>
      </div>

      {!user.isActivated && (
        <div className="email-warning">
          <Mail size={16} />
          <span className="email-warning-text">Подтвердите почту, чтобы активировать аккаунт</span>
        </div>
      )}

      <Button className="logout-btn" onClick={onLogout}>
        <LogOut size={18} />
        Выйти
      </Button>
    </div>
  );
};

export default UserProfile;