import { useContext, useEffect, useState } from "react";
import { Users, XCircle } from "lucide-react";
import { Context } from "../..";
import SideBarSkeleton from "../skeletons/SideBarSkeleton";
import "./Chat.css";
import { observer } from "mobx-react-lite";
import { formatDate, formatTime } from "../../utils/formatMessageTime";
import { CgProfile } from "react-icons/cg";


const Sidebar = () => {
  const { store, chatStore } = useContext(Context);
  const { onlineUsers } = chatStore;
  console.log("chatStore в Sidebar:", chatStore);
  
  useEffect(() => {
    chatStore.getUsers();
  }, []);

  if (chatStore?.isUsersLoading) return <SideBarSkeleton />;

  const setSelectedUserHandler = (user) => {
    if (user) chatStore.setSelectedUser(user);
  };

  const lastMessage = (user) => {
    if (!user?.lastMessage) return null;

    return ( 
      <div className="user-info">
        <div className="user-name">
  {!user.lastMessage ? (
    "Нет сообщений"
  ) : (
    <>
      {user?.lastMessage?.sender._id === store.user.id ? "Вы: " : ""}
      {user?.lastMessage?.text}
    </>
  )}
</div>
      </div>
    )
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Users className="icon" />
          <span>Чаты</span>
        </div>
      </div>

      <div className="sidebar-users">
        {chatStore.users?.length > 0 ? (
          chatStore.users.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUserHandler(user)}
              className={`user-button ${
                chatStore.selectedUser?._id === user._id ? "selected" : ""
              }`}
            >
              <div className="user-avatar">
              <CgProfile size={50} />
                {onlineUsers.includes(user._id) && <span className="user-status" />}
              </div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-name">{lastMessage(user)}</div>
              </div>
              {formatTime(user?.lastMessage?.createdAt)}
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