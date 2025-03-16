import { CgProfile } from "react-icons/cg";
import { FaStar } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const UserProfileLight = ({ user , actions}) => {
  const navigate = useNavigate(); 
  const handleNavigateToUserChat = (event, userId) => {
    event.stopPropagation(); // Остановка всплытия
    if (!userId) return;

    navigate(`/chats/${userId}`, {
      state: {
        user: {
          name: user?.name,
          avatar: user.avatarUrl,
          rating: user?.rating
        }
      }
    });
  };

  return (
    <div className="user-profile-light-card" onClick={() => navigate(`/user/${user._id}`)}>
      {user?.avatarUrl ? (
        <img src={user.avatarUrl} alt="user avatar" />
      ) : (
        <CgProfile size={50} />
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
            <FiMessageCircle size={20} className="message-btn-user-profile-light" onClick={(event) => handleNavigateToUserChat(event, user._id)}/> 
          </div>
        )}
        
      </div>
    </div>
  );
};

export default UserProfileLight;