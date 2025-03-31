import { useContext, useEffect, useState } from "react";
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
import Input from "../UI/Input/Input";
import { ArrowLeft } from "lucide-react";
import ThemeSwitcher from "../UI/ThemeSwitcher/ThemeSwitcher";
import RequestItemMini from "../Request/RequestItemMini";
import Toggle from "../UI/Toggle/Toggle";
import RentalItemMini from "../Rental/RentalItemMini";
import LogoutModal from "../Modals/LogoutModal";
import ChangePasswordModalContent from "./ChangePasswordModalContent";

const Profile = () => {
  const { store, companyStore } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyInn, setCompanyInn] = useState("");
  const [startCompanyWorkTime, setStartCompanyWorkTime] = useState("");
  const [endCompanyWorkTime, setEndCompanyWorkTime] = useState("");
  const [companyText, setCompanyText] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const userId = store.user.id;
  const navigate = useNavigate();
  const [croppedAvatar, setCroppedAvatar] = useState(null);
  const { showToast } = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [filterRequests, setFilterRequests] = useState(["pending"]);
  const [sortRequests, setSortRequests] = useState([]);
  const ownerId = companyStore.company ? companyStore.company._id : null;
  const [expiringRentals, setExpiringRentals] = useState([]);
  const [toggleSettings, setToggleSettings] = useState({
    notificationRequest: false,
    notificationTO: false,
    notificationNewRequests: false,
  });

  const handleFormSubmit = async (data) => {
    try {
      console.log("Тип данных avatar:", croppedAvatar);
      const avatarUrl = await handleAvatarUpload(croppedAvatar);
      if (!avatarUrl) {
        showToast({
          text1: "Загрузите логотип компании",
          type: "warning",
        });
        return;
      }

      const companyData = {
        companyName,
        companyAddress,
        contacts: { email, phone },
        companyInn,
        avatarUrl,
        startCompanyWorkTime,
        endCompanyWorkTime,
        companyText,
      };

      await companyStore.addCompany(companyData, userId, showToast);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      showToast({
        text1: "Ошибка при отправке формы",
        text2: error.message,
        type: "warning",
      });
    }
  };

  const handleSaveAvatar = async (avatar) => {
    setCroppedAvatar(avatar);
  };

  const handleAvatarUpload = async (avatar) => {
    try {
      if (!avatar) {
        throw new Error("Изображение не выбрано.");
      }
      const url = await uploadAvatarToFirebase(avatar, store.user.id);
      return url;
    } catch (error) {
      console.error("Ошибка загрузки аватара:", error.message);
      return null;
    }
  };
  const handleResendEmailVerification = async () => {
    try {
      await store.resendVerificationEmail(store.user.email);
    } catch (error) {
      console.error("Error resending verification email:", error);
    }
  };

  const handleAlertLogout = () => {
    setModalContent("logout");
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
    setModalContent("addCompany");
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    store.logout();
    setIsModalOpen(false);
    navigate("/auth");
  };

  const handleChangePassword = async () => {
    try {
      if (oldPassword === "" || newPassword === "") {
        showToast({
          text1: "Заполните все поля",
          type: "error",
        });
        return;
      }
      if (newPassword !== repeatPassword) {
        showToast({
          text1: "Пароли не совпадают",
          type: "error",
        });
        return;
      }
      await store.changePassword(oldPassword, newPassword, userId, showToast);
      setIsModalOpen(false);
      navigate("/auth");
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleChangePasswordModal = () => {
    console.log("Change password modal opened");
    setModalContent("changePassword");
    setIsModalOpen(true);
  };

  const handleOpenSettingsModal = () => {
    setModalContent("main");
    setIsModalOpen(true);
  };

  const handleGoBack = () => {
    setModalContent("main");
  };

  const fetchBoxData = async () => {
    companyStore.getRequests(ownerId, filterRequests, sortRequests);
  };

  const [serverSettings, setServerSettings] = useState({
    notificationRequest: false,
    notificationTO: false,
    notificationNewRequests: false,
  });

  useEffect(() => {
    if (ownerId) {
      fetchBoxData();
      companyStore.fetchRentals(ownerId, filterRequests, sortRequests);
      store.fetchSettings().then(() => {
        setServerSettings(store.settings);
      });
    }
  }, [ownerId, store, companyStore]);

  const handleRequestItemClick = (requestId) => {
    navigate(`/request/${requestId}`, { state: { openModal: requestId } });
  };

  const handleToggleChange = (key, value) => {
    console.log("handleToggleChange", key, value);
    setToggleSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Отправка в стор
    store.updateSetting(key, value);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false); // Закрытие модалки
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (ownerId && Array.isArray(companyStore.rentals)) {
      const now = new Date();
      const fiveDaysLater = new Date(now);
      fiveDaysLater.setDate(now.getDate() + 5);

      const filteredRentals = companyStore.rentals.filter((rental) => {
        console.log("rental.dates.endDate", rental.dates.endDate);

        const endDate = new Date(rental.dates.endDate.date);
        const endTime = rental.dates.endDate.time
          ? new Date(
              `${rental.dates.endDate.date}T${rental.dates.endDate.time}`
            )
          : endDate;

        return endTime >= now && endTime <= fiveDaysLater;
      });

      filteredRentals.sort(
        (a, b) =>
          new Date(a.dates.endDate.date) - new Date(b.dates.endDate.date)
      );

      setExpiringRentals(filteredRentals);
    } else if (!Array.isArray(companyStore.rentals)) {
      console.log("companyStore.rentals is not an array or not yet loaded.");
    }
  }, [companyStore.rentals, ownerId]);

  return (
    <div className="wrapper">
      <div className="box a">
        <Empty text={"Содержимого нет"} />
      </div>
      
      <div className="box b">
        <UserProfile
          store={store}
          companyStore={companyStore}
          handleAlertLogout={handleAlertLogout}
          handleCheckIsEmailVerified={handleCheckIsEmailVerified}
          handleResendEmailVerification={handleResendEmailVerification}
          handleChangePasswordModal={handleChangePasswordModal}
          handleOpenSettingsModal={handleOpenSettingsModal}
        />
      </div>
      <div className="box c">
        <h1>
          Истекающие аренды{" "}
          {expiringRentals.length > 0 ? `(${expiringRentals.length})` : ""}
        </h1>
        {expiringRentals.length > 0 ? (
          <div>
            {expiringRentals.map((rental) => (
              <RentalItemMini
                rental={rental}
                key={rental._id}
                showToast={showToast}
              />
            ))}
          </div>
        ) : (
          <Empty text={"Заявок нет"} />
        )}
      </div>
      <div className="box d">
        <div>
          <h1>
            Новые заявки{" "}
            {companyStore.requestsList.length > 0
              ? `(${companyStore.requestsList.length})`
              : ""}
          </h1>
          {companyStore.requestsList.length > 0 ? (
            <div className="requests-mini-wrapper">
              {companyStore.requestsList
                .slice()
                .reverse()
                .map((request) => (
                  <div
                    onClick={() => handleRequestItemClick(request._id)}
                    key={request._id}
                  >
                    <RequestItemMini request={request} />
                  </div>
                ))}
            </div>
          ) : (
            <Empty text="У вас нет заявок" />
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent !== "main" && modalContent !== "addCompany" && (
          <ArrowLeft size={20} onClick={handleGoBack} />
        )}
       <LogoutModal isOpen={modalContent === "logout"} onClose={() => setIsModalOpen(false)} onConfirm={handleLogout} handleGoBack={handleGoBack} />

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
            setStartCompanyWorkTime={setStartCompanyWorkTime}
            startCompanyWorkTime={startCompanyWorkTime}
            endCompanyWorkTime={endCompanyWorkTime}
            setEndCompanyWorkTime={setEndCompanyWorkTime}
            companyText={companyText}
            setCompanyText={setCompanyText}
          />
        )}
        {modalContent === "main" && (
          <div>
            <h2>Настройки</h2>
            <div className="settings-list">
              <Button onClick={() => setModalContent("changePassword")}>
                Аккаунт
              </Button>
              <Button onClick={() => setModalContent("system")}>Система</Button>
              <Button onClick={() => setModalContent("notification")}>
                Уведомления
              </Button>
              <Button onClick={() => setModalContent("logout")}>Выйти</Button>
            </div>
          </div>
        )}

        {modalContent === "changePassword" && (
         <ChangePasswordModalContent
            oldPassword={oldPassword}
            setOldPassword={setOldPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            repeatPassword={repeatPassword}
            setRepeatPassword={setRepeatPassword}
            handleChangePassword={handleChangePassword}
          />
        )}
        {modalContent === "notification" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h1>Настройки уведомлений</h1>
            <Toggle
              checked={serverSettings.notificationRequest}
              onChange={(value) =>
                handleToggleChange("notificationRequest", value)
              }
              placeholder="Истекающие заявки"
            />
            <Toggle
              checked={serverSettings.notificationTO}
              onChange={(value) => handleToggleChange("notificationTO", value)}
              placeholder="Истекающие ТО"
            />
            <Toggle
              checked={serverSettings.notificationNewRequests}
              onChange={(value) =>
                handleToggleChange("notificationNewRequests", value)
              }
              placeholder="Новые заявки"
            />
          </div>
        )}
        {modalContent === "system" && (
          <div>
            <h2>Настройки темы</h2>
            <ThemeSwitcher />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default observer(Profile);
