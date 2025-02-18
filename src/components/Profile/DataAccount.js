import { useContext, useEffect, useState } from "react";
import { Context } from "../../index";
import "./Profile.css";
import Modal from "../UI/Modal/Modal";
import Button from "../UI/Buttons/Button";
import Input from "../UI/Input/Input";
import { Building, MapPin, Landmark, Mail, Phone, LogOut, Upload, RefreshCcw } from "lucide-react";
import AvatarUpload from "../UI/AvatarUpload/AvatarUpload";
import { uploadAvatarToFirebase } from "../../utils/uploadAvatarToFirebase";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "../../providers/ToastProvider";
import { observer } from "mobx-react-lite";
const Profile = () => {
  const { store, companyStore } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null); // Состояние для контента модалки
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyInn, setCompanyInn] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const userId = store.user.id;
  const [avatarUrl, setAvatarUrl] = useState(null); // Состояние для URL аватара
  const [isUploading, setIsUploading] = useState(false); // Флаг загрузки аватара
  const navigate = useNavigate(); // Хук для навигации
  const [croppedAvatar, setCroppedAvatar] = useState(null);
  const { showToast } = useToast();

  const handleFormSubmit = async (data) => {
    try {
      console.log("Тип данных avatar:", croppedAvatar);
      const avatarUrl = await handleAvatarUpload(croppedAvatar);
      if (!avatarUrl) {
        alert("Пожалуйста, загрузите аватар перед отправкой формы.");
        return;
      }
  
      const companyData = {
        companyName,
        companyAddress,
        contacts: { email, phone },
        companyInn,
        avatarUrl,
      };
      console.log("SendCompanyData", companyData);
  
      companyStore.addCompany(companyData, userId);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
    }
  };

 
  const handleSaveAvatar = async (avatar) => {
    setCroppedAvatar(avatar);
  }
  
  const handleAvatarUpload = async (avatar) => {
    setIsUploading(true);
    try {
      if (!avatar) {
        throw new Error("Изображение не выбрано.");
      }

      const url = await uploadAvatarToFirebase(avatar, store.user.id);
      return url;
    } catch (error) {
      console.error("Ошибка загрузки аватара:", error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  const handleResendEmailVerification = async () => {
    try {

      await store.resendVerificationEmail(store.user.email);
    } catch (error) {
      console.error("Error resending verification email:", error);
    }
  };



  // Функция для открытия модалки с разным содержимым
  const handleAlertLogout = () => {
    setModalContent("logout"); // Устанавливаем контент для выхода
    setIsModalOpen(true);
  };

  const handleCheckIsEmailVerified = () => {
    if (store.user.isActivated === false) {
     showToast({
        text1: "Подтвердите почту, чтобы создать компанию",
        type: "error"
      });
      return;
    }
    handleAddCompany();
  }
  const handleAddCompany = () => {
    setModalContent("addCompany"); // Устанавливаем контент для добавления компании
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    store.logout();
    setIsModalOpen(false);
    navigate("/auth");
  };
  

  return (
    <div className="wrapper">
      <div className="box a">A</div>
      <div className="box b">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-wrapper">
              <div
                className={`status-indicator ${
                  store.user.isActivated ? "active" : "inactive"
                }`}
              />
            </div>
            <div className="profile-info">
              <h1>
                {store.user.name} {store.user.surname}
              </h1>
              <div className="email-wrapper">
                <p>{store.user.email}</p>
                <span
                  className={`badge ${
                    store.user.isActivated ? "activated" : "not-activated"
                  }`}
                >
                  {store.user.isActivated ? "Активирован" : "Не активирован"}
                </span>
              </div>
            </div>
          </div>

          {!store.user.isActivated && (
            <div className="email-warning">
              <Mail size={16} />
              <span className="email-warning-text">
                Подтвердите почту, чтобы активировать аккаунт
              </span>
              {store.user.isActivationLinkExpired === true && (
                <RefreshCcw onClick={handleResendEmailVerification}></RefreshCcw>
              )}
            </div>
          )}

          <button className="logout-btn" onClick={handleAlertLogout}>
            <LogOut size={18} />
            Выйти
          </button>
        </div>
      </div>
      <div className="box c">
        <h1>Мои автомобили</h1>
        {companyStore.cars !== null ? (
          companyStore.cars.map((car) => (
             <h1>sdfsfs</h1>
          ))
        ) : (
          <p>Нет автомобилей</p>
        )}
      </div>
      <div className="box d">
        {companyStore.hasCompany === true  ? (
          <div className="company-profile">
          <div className="company-info">
          {companyStore.company.avatarUrl ? (
            <div className="avatar-preview">
                <img 
                  src={companyStore.company.avatarUrl} 
                  alt="Company Avatar" 
                  className="cropped-avatar" 
                />
              </div>
              ) : (
                <div className="default-avatar">No Avatar</div> // Если аватар не задан
              )}
            <p><Building size={18} /> {companyStore.company.companyName}</p>
            <p><MapPin size={18} /> {companyStore.company.companyAddress}</p>
            <p><Landmark size={18} /> {companyStore.company.companyInn}</p>
            <p><Mail size={18} /> {companyStore.company.contacts.email}</p>
            <p><Phone size={18} /> {companyStore.company.contacts.phone}</p>
          </div>
        </div>
        ) : (
          <div className="company-profile">
  <h1>Профиль компании</h1>
  <div className="btn-wrapper-company">
    <Button onClick={handleCheckIsEmailVerified}>Добавить</Button>
  </div>
</div>
        )}
</div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* Отображаем контент модалки в зависимости от состояния modalContent */}
        {modalContent === "logout" && (
          <>
            <h2>Вы точно хотите выйти из аккаунта?</h2>
            <button onClick={handleLogout}>Выйти</button>
          </>
        )}
        {modalContent === "addCompany" && (
          <>
            <h2>Заполните данные о компании</h2>
            <div className="modal-input-wrapper">
            <div className="company-logo">
            </div>
            <AvatarUpload onSubmit={handleSaveAvatar} />
            <Input
                placeholder="Название компании"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="modal-input"
              />
              <Input
                placeholder="Адрес компании"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                required
                className="modal-input"
              />
              <Input
                placeholder="ИНН компании"
                value={companyInn}
                onChange={(e) => setCompanyInn(e.target.value)}
                required
                className="modal-input"
              />
               <Input
                placeholder="Рабочий email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="modal-input"
              />
               <Input
                placeholder="Телефон компании"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="modal-input"
              />

            <Button onClick={handleFormSubmit}>Добавить</Button>

            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default observer(Profile);
