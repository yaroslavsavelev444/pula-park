import { useContext, useState } from "react";
import { Context } from "../../index";
import "./Profile.css";
import Modal from "../UI/Modal/Modal";
import Button from "../UI/Buttons/Button";
import { uploadAvatarToFirebase } from "../../utils/ImageOperations/uploadAvatarToFirebase";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../providers/ToastProvider";
import { observer } from "mobx-react-lite";
import UserProfile from "./UserProfile";
import AddCompanyModal from "../Modals/AddCompanyModal";
import Empty from "../Empty/Empty";
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
  };

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
        type: "error",
      });
      return;
    }
    handleAddCompany();
  };
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
      <div className="box a"></div>
      <div className="box b">
        <UserProfile
          store={store}
          companyStore={companyStore}
          handleAlertLogout={handleAlertLogout}
          handleCheckIsEmailVerified={handleCheckIsEmailVerified}
          handleResendEmailVerification={handleResendEmailVerification}
        />
      </div>
      <div className="box c">
        <h1>Мои автомобили</h1>
        {companyStore.cars !== null ? (
          companyStore.cars.map((car) => <h1>{car.name}</h1>)
        ) : (
          <Empty text="У вас нет автомобилей" />
        )}
      </div>
      <div className="box d">
        <h1>Мои заявки</h1>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent === "logout" && (
          <>
            <h2>Вы точно хотите выйти из аккаунта?</h2>
            <Button onClick={handleLogout}>Выйти</Button>
          </>
        )}
        {modalContent === "addCompany" && (
          <AddCompanyModal
            handleSaveAvatar={handleSaveAvatar}
            handleFormSubmit={handleFormSubmit}
            companyName={companyName}
            setCompanyName={setCompanyName}
            companyAddress={companyAddress}
            setCompanyAddress={setCompanyAddress}
            companyInn={companyInn}
            setCompanyInn={setCompanyInn}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
          />
        )}
      </Modal>
    </div>
  );
};

export default observer(Profile);
