import { CgProfile } from "react-icons/cg";
import { FaStar } from "react-icons/fa";

const UserProfileLight = (user) => {
  return (
    <div className="user-profile-light-card">
      <CgProfile size={40} />
      <div className="user-profile-light-text-data">
        <span className="user-profile-light-name">{user.user.name}</span>
        <span className="user-profile-light-name"><FaStar size={15} color="orange" /> {user.user.rating}</span>
      </div>
    </div>
  );
};

export default UserProfileLight;
