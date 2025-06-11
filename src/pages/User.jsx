import React, { useContext, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import UserProfileExtended from "../components/User/UseProfileExtended";
import "../components/User/User.css";
import UserInfoContainer from "../components/User/UserInfoContainer";
import Empty from "../components/Empty/Empty";
import { log } from "../utils/logger";
import { showToast } from "../services/toastService";

const User = () => {
  const { companyStore } = useContext(Context);
  const ownerId = companyStore.company ? companyStore.company._id : null;
  const { userId } = useParams();
    const navigate = useNavigate();

    const fields = useMemo(() => [
      "name",
      "role",
      "email",
      "rating",
      "organizationData.companyName",
      "organizationData.address",
      "blocked.blockedReason",
      "createdAt",
      "rated",
      "online",
    ], []);
  

    useEffect(() => {
      if (ownerId && userId) {
        log("Fetching user data:", userId, fields);
        companyStore.fetchUserData(userId, fields);
        log("userData", companyStore.userData);
      }
    }, [userId, ownerId, fields, companyStore]);

    if(!companyStore.userData || !ownerId || !userId || userId === undefined){
      return <div>Loading...</div>
    }

    const toggleRateUser = async (id) => {
      if (!id || !ownerId) return;
      log("toggleRateUser", id);
      try {
        await companyStore.rateUser(id);
      } catch (e) {
        error("Error rating user:", e);
          showToast({ text1: "Произошла ошибка", type: "error" });
      }
    };

    const handleNavigateToUserChat = (userId) => {
      if (!userId) return;
      
      navigate(`/chats/${userId}`, { 
        state: { 
          user: { 
            name: companyStore.userData?.name, 
            avatar: companyStore.userData?.avatar,
            rating: companyStore.userData?.rating
          } 
        } 
      });
    };

    const handleToggleBlockUser = async (id) => {
      if (!id || !ownerId) return;
      log("toggleRateUser", id);
      try {
        await companyStore.blockUser(id);
      } catch (e) {
        error("Error rating user:", e);
              showToast({ text1: "Произошла ошибка", type: "error" });
        
      }
    };


  return (
    <div className="profile-wrapper">
      {companyStore.userData._id ? (
         <div className="profile-container">
         <div className="profile-card">
           <UserProfileExtended user={companyStore.userData} toggleRateUser={toggleRateUser} handleNavigateToUserChat={handleNavigateToUserChat} handleToggleBlockUser={handleToggleBlockUser} companyData={companyStore.company}/>
         </div>
 
         <div className="info-container">
             <UserInfoContainer user={companyStore.userData} />
           <div className="info-card">
             <h3 className="section-title">Блок статистики</h3>
           </div>
         </div>
       </div>
      ):
      (
        <div>
          <Empty text="Пользователь не найден" />
        </div>
      )}
    </div>
  );
};

export default observer(User);
