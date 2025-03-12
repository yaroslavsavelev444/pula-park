import React from "react";
import { CgProfile } from "react-icons/cg";
import { Star, MessageCircle, Check, KeyRound, X, Circle, CircleDashed } from "lucide-react";
import LikeButton from "../UI/Buttons/LikeButton";
import { MdBookOnline } from "react-icons/md";

export default function UserProfileExtended({ user, toggleRateUser, handleNavigateToUserChat }) {
  console.log("User data:", user);

  if (!user) {
    return <div className="user-profile-extended-card">Пользователь не найден</div>;
  }

  return (
    <div className="user-profile-extended-card">
      <div className="profile-avatar">
        {user.avatarUrl ? <img src={user.avatarUrl} alt="User avatar" /> : <CgProfile size={100} />}
      </div>
      <div className="user-name">
        <h2>{user.name || "Без имени"} </h2>
        <h2>{user.online ? <Circle size={25} color='green'/> : <CircleDashed size={25} color='gray'/>} </h2>
      </div>
      <div className="profile-rating">
        <h2><Star size={25} color="orange" /> {user.rating || "Нет рейтинга"}</h2>
      </div>
     
      <div className="profile-buttons">
        <LikeButton 
          initialLikes={user.likesCount || 0} 
          initialLiked={user.hasRated || false} 
          onLikeToggle={() => toggleRateUser(user._id)}
        />
        <button className="btn btn-outline" onClick={() => handleNavigateToUserChat(user._id)}>
          <MessageCircle size={20} />
        </button>
      </div>
    </div>
  );
}