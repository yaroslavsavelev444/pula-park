import React, { useContext, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import UserProfileExtended from "../components/User/UseProfileExtended";
import "../components/User/User.css";
import UserInfoContainer from "../components/User/UserInfoContainer";

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
        console.log("Fetching user data:", userId, fields);
        companyStore.fetchUserData(userId, fields);
      }
    }, [userId, ownerId, fields, companyStore]);

    const toggleRateUser = async (id) => {
      if (!id || !ownerId) return;
      console.log("toggleRateUser", id);
      try {
        await companyStore.rateUser(id);
      } catch (error) {
        console.error("Error rating user:", error);
      }
    };

  const handleNavigateToUserChat = (userId) => {
    if(!userId) return
    navigate(`/chats/${userId}`);
  }


  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <div className="profile-card">
          <UserProfileExtended user={companyStore.userData} toggleRateUser={toggleRateUser} handleNavigateToUserChat={handleNavigateToUserChat} />
        </div>

        <div className="info-container">
            <UserInfoContainer user={companyStore.userData} />
          <div className="info-card">
            <h3 className="section-title">Project Status</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(User);
