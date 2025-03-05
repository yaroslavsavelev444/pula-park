import React from "react";
import './Skeletons.css';
const MessageSkeleton = () => {
    // Create an array of 6 items for skeleton messages
    const skeletonMessages = Array(6).fill(null);
  
    return (
      <div className="message-skeleton-container">
        {skeletonMessages.map((_, idx) => (
          <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}>
            <div className="chat-image avatar">
              <div className="avatar-size">
                <div className="skeleton skeleton-avatar" />
              </div>
            </div>
  
            <div className="chat-header mb-1">
              <div className="skeleton skeleton-header" />
            </div>
  
            <div className="chat-bubble bg-transparent p-0">
              <div className="skeleton skeleton-bubble" />
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default MessageSkeleton;