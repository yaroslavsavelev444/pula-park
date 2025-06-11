import { Mail, LogOut, RefreshCcw } from "lucide-react";
import CompanyProfile from "./CompanyProfile";
import "./Profile.css";
import { motion } from "framer-motion";

const UserProfile = ({
  store,
  companyStore,
  handleCheckIsEmailVerified,
  handleResendEmailVerification,
  handleOpenSettingsModal,
}) => {
  return (
    <div className="profile-card">
      <CompanyProfile
        companyStore={companyStore}
        handleCheckIsEmailVerified={handleCheckIsEmailVerified}
        handleOpenSettingsModal={handleOpenSettingsModal}
      />

      <div className="profile-header">
        <div className="avatar-wrapper">
          <div
            className={`status-indicator ${
              store?.user?.isActivated ? "active" : "inactive"
            }`}
          />
        </div>
        <div className="profile-info">
          <h1>
            {store?.user?.name} {store?.user?.surname}
          </h1>
          <div className="email-wrapper">
            <p>{store?.user?.email}</p>
            <span
              className={`badge ${
                store?.user?.isActivated ? "activated" : "not-activated"
              }`}
            >
              {store?.user?.isActivated ? "Активирован" : "Не активирован"}
            </span>
          </div>
        </div>
      </div>

      {!store?.user?.isActivated && (
        <div className="email-warning">
          {store?.user?.isActivationLinkExpired === true ? (
            <>
              <Mail size={16} />
              <span className="email-warning-text">
                Ссылка для активации устарела, повторите попытку
              </span>

              <motion.div
                animate={{
                  scale: [1, 1.2, 1], // Пульсация
                  opacity: [1, 0.7, 1], // Изменение прозрачности
                  rotate: [0, 360], // Вращение
                }}
                transition={{
                  duration: 2, // Время полного цикла анимации
                  repeat: Infinity, // Бесконечное повторение
                  ease: "easeInOut", // Плавность
                }}
              >
                <RefreshCcw
                  className="pulsing-icon"
                  onClick={handleResendEmailVerification}
                  size={20}
                />
              </motion.div>
            </>
          ) : (
            <>
              <Mail size={16} />
              <span className="email-warning-text">
                Прислали на почту ссылку для активации
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
