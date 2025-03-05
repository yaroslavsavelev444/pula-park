import { useContext, useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import {  Context } from "../..";
import "./ChatContainer.css"; // Подключение CSS-файла
import { observer } from "mobx-react-lite";
import Chats from "../../pages/Chats";
const MessageInput = () => {
    const { store, chatStore } = useContext(Context);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = chatStore;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      console.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if(!chatStore.selectedUser ) {
      console.log("Ошибка: selectedUser не определён при отправке сообщения");
      return;
    }
    console.log("chatStore.selectedUser:", chatStore.selectedUser);
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      } , chatStore.selectedUser);

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="message-input">
      {imagePreview && (
        <div className="image-preview">
          <div className="image-container">
            <img
              src={imagePreview}
              alt="Preview"
              className="image-preview-img"
            />
            <button
              onClick={removeImage}
              className="remove-image-btn"
              type="button"
            >
              <X className="remove-icon" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="message-form">
        <div className="input-container">
          <input
            type="text"
            className="text-input"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`image-btn ${imagePreview ? "active" : ""}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="send-btn"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default observer(MessageInput);