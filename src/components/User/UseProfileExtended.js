import React, { useContext } from "react";
import { CgProfile } from "react-icons/cg";
import { Star, MessageCircle, Circle, CircleDashed } from "lucide-react";
import LikeButton from "../UI/Buttons/LikeButton";
import Button from "../UI/Buttons/Button";
import {  Context } from "../..";
import { observer } from "mobx-react-lite";

const UserProfileExtended = ({ user, toggleRateUser, handleNavigateToUserChat, handleToggleBlockUser }) => {
  const { store } = useContext(Context);
  console.log("User data:", user);
  const { companyStore } = useContext(Context);
  console.log("Company data:", companyStore.company);
  console.log("Blocked users:", store?.user);
  if (!user) {
    return <div className="user-profile-extended-card">Пользователь не найден</div>;
  }

  return (
    <div className="user-profile-extended-card">
      <div className="profile-avatar">
        {user.avatarUrl ? <img src={user.avatarUrl} alt="User avatar" /> : <CgProfile size={100} />}
      </div>
      <div className="user-name" style={{ maxWidth:"100%"}}>
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
      <div className="profile-rating">
        {companyStore.company?.blockedUsers?.includes(user._id) ? (
           <Button onClick={() => handleToggleBlockUser(user._id)} className="btn-unblock">Разблокировать</Button>
        ) : (
          <Button onClick={() => handleToggleBlockUser(user._id)} className="btn-block" >Заблокировать</Button>
        )}
        </div>
    </div>
  );
}

export default observer(UserProfileExtended);