import { CgProfile } from "react-icons/cg";
import { FaStar } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const UserProfileLight = ({ user , actions}) => {
  const navigate = useNavigate(); 
  const handleNavigateToUserChat = (car) => {
    navigate(`/chats/${user._id}`);
  };
  return (
    <div className="user-profile-light-card">
      {user?.avatarUrl ? (
        <img src={user.avatarUrl} alt="user avatar" />
      ) : (
        <CgProfile size={60} />
      )}
      <div className="user-profile-light-wrapper">
        <div className="user-profile-light-text-data">
          <span className="user-profile-light-name">{user?.name || "Без имени"}</span>
          <span className="user-profile-light-rating">
            <FaStar size={15} color="orange" /> {user?.rating ?? "N/A"}
          </span>
        </div>
        {actions && (
          <div className="user-profile-light-actions">
          <FiMessageCircle size={20} onClick={handleNavigateToUserChat}/> 
          </div>
        )}
        
      </div>
    </div>
  );
};

export default UserProfileLight;