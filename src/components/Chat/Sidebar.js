import { useContext, useEffect, useState } from "react";
import { Users, XCircle } from "lucide-react";
import { Context } from "../..";
import SideBarSkeleton from "../skeletons/SideBarSkeleton";
import "./Chat.css";
import { observer } from "mobx-react-lite";


const Sidebar = () => {
  const { chatStore } = useContext(Context);
  const { onlineUsers } = chatStore;
  console.log("chatStore в Sidebar:", chatStore);
  
  useEffect(() => {
    if (chatStore) {
      chatStore.getUsers();
    }
  }, [chatStore]);

  if (chatStore?.isUsersLoading) return <SideBarSkeleton />;

  const setSelectedUserHandler = (user) => {
    if (chatStore && user) {
      chatStore?.setSelectedUser(user);
    }
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Users className="icon" />
          <span>Contacts</span>
        </div>
      </div>

      <div className="sidebar-users">
        {chatStore.users.length > 0 ? (
          chatStore.users.map((user) => (
            <button
            style={{width: 'auto'}}
              key={user._id}
              onClick={() => setSelectedUserHandler(user)}
              className={`user-button ${
                chatStore.selectedUser?._id === user._id ? "selected" : ""
              }`}
            >
              <div className="user-avatar">
               <img src={user.avatarUrl || "/avatar.png"} alt={user.name} />
                {onlineUsers.includes(user._id) && <span className="user-status" />}
              </div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-status-text">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="no-users">No users</div>
        )}
      </div>
    </aside>
  );
};

export default observer(Sidebar);