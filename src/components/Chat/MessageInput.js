import { useContext, useRef, useState, useEffect } from "react";
import { ArrowBigDownIcon, ArrowDown, Image, Send, X } from "lucide-react";
import { Context } from "../..";
import "./ChatContainer.css";
import { observer } from "mobx-react-lite";
import { containsBannedWords } from "../../utils/wordFilter";
import { useToast } from "../../providers/ToastProvider";
import Input from "../UI/Input/Input";

const MessageInput = ({isAtBottom, onClick}) => {
  const { chatStore } = useContext(Context);
  const [text, setText] = useState("");
  const { showToast } = useToast();
  const [imagePreview, setImagePreview] = useState(null);
  const [placeholderText, setPlaceholderText] = useState(""); // Стейт для placeholder
  const fileInputRef = useRef(null);
  const { sendMessage } = chatStore;
  
  const placeholderMessage = "Напишите сообщение..."; // Текст для placeholder

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      showToast({
        text1: "Пожалуйста, выберите изображение.",
        type: "error",
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => clearImage();

  const isMessageValid = (text, imagePreview) => {
    const trimmedText = text.trim();
    if (!trimmedText && !imagePreview) {
      showToast({
        text1: "Нельзя отправить пустое сообщение",
        type: "error",
      });
      return false;
    }
    if (trimmedText.length < 1) {
      showToast({
        text1: "Сообщение слишком короткое",
        type: "error",
      });
      return false;
    }
    if (containsBannedWords(trimmedText)) {
      showToast({
        text1: "Сообщение содержит запрещённое слово",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!isMessageValid(text, imagePreview)) return;
    const trimmedText = text.trim();

    try {
      await sendMessage(
        { text: trimmedText, image: imagePreview },
        chatStore.selectedUser
      );
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
    }
  };

  // Эффект печатающейся машинки с зацикливанием
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      setPlaceholderText((prev) => prev + placeholderMessage[i]);
      i++;
      if (i === placeholderMessage.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          setPlaceholderText(""); // Очищаем текст перед повтором
          i = 0; // Сброс индекса для печати заново
        }, 1000);
      }
    }, 150); // Задержка между символами

    return () => clearInterval(typingInterval); // Очищаем таймер при размонтировании
  }, []); // Эффект запускается один раз при монтировании компонента

  return (
    <div className="message-input">
      {!isAtBottom && (
  <button
    className={`scroll-to-bottom ${!isAtBottom ? "show" : ""}`}
    onClick={onClick}
  >
    <ArrowDown color="white" />
  </button>
)}
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
              <X className="remove-icon" color="black" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="message-form">
        <div className="input-container">
          <Input
            type="text"
            className="text-input"
            placeholder={"Введите сообщение..."} // Используем state для placeholder
            value={text}
            onChange={(e) => setText(e.target.value)}
            isPlaceholderAnimated={true}
          />

          {/* Скрытый input для файлов */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }} // Полностью скрываем инпут
          />

          {/* Кнопка для выбора файла (иконка вместо стандартной формы) */}
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