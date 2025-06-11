import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import "./Button.css";

export default function LikeButton({ initialLikes, initialLiked, onLikeToggle }) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  // Обновляем, если изменились пропсы
  useEffect(() => {
    setLiked(initialLiked);
    setLikes(initialLikes);
  }, [initialLikes, initialLiked]);

  const handleToggle = () => {
    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;

    setLiked(newLiked);
    setLikes(newLikes);

    if (onLikeToggle) {
      onLikeToggle(newLiked, newLikes);
    }
  };

  return (
    <div className="like-button" onClick={handleToggle}>
      <Heart className={`heart-icon ${liked ? "liked" : ""}`} />
      <span className="like-count">{likes}</span>
    </div>
  );
}