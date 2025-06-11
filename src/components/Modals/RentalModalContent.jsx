import React, { useContext, useEffect, useState } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import PropTypes from "prop-types";
import CarItemBit from "../Car/CarItemBit";
import UserProfileLight from "../Profile/UserProfileLight";
import { Clock } from "lucide-react";
import SelectMenu from "../UI/SelectMenu/SelectMenu";
import Button from "../UI/Buttons/Button";
import Input from "../UI/Input/Input";
import { getRentalCancelReason } from "../constants/maps";
import { Context } from "../..";
import "../Rental/RentalItem.css";
import { formatDate, formatTime } from "../../utils/formatMessageTime";
import { cancelRentalOptions } from "../constants/options";
import { showToast } from "../../services/toastService";
import { log } from "../../utils/logger";

const RentalModalContent = ({ rental, onClose, }) => {
  const { store, companyStore } = useContext(Context);
  log("rentalModal", rental);
  const [cancelReason, setCancelReason] = useState(false);
  const [cancelRentalVisible, setRentalCancelVisible] = useState(false);
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleCancelRental = () => {
    if (cancelReason) {
      if (rental.status === "canceled" || rental.status === "completed") {
        showToast({
          text1: "Вы не можете отменить уже отменённую аренду",
          type: "error",
        });
        log("Вы не можете отменить уже отменённую аренду");
        return;
      }
      if (rental.status === "in_use") {
        showToast({
          text1: "Вы не можете отменить аренду в прокате",
          type: "error",
        });
        log("Вы не можете отменить аренду в прокате");
        return;
      } else {
        companyStore.cancelRental(rental._id, cancelReason);
        setRentalCancelVisible(false);
      }
    }
  };

  return (
    <div className="car-modal-content">
      <div className="request-item__row">
        <CarItemBit car={rental.car} />
      </div>
      <div className="request-item__row">
        <UserProfileLight user={rental.user} actions={true} />
      </div>
      <div className="request-item__row">
        <p className="request-item__value">
          <div className="item-row">
            <Clock /> <p> С: </p> {formatDate(rental.dates?.startDate.date)}{" "}
            {formatTime(rental.dates?.startDate.time)}
          </div>
          <div className="item-row">
            <Clock /> <p> До: </p> {formatDate(rental.dates?.endDate.date)}{" "}
            {formatTime(rental.dates?.endDate.time)}
          </div>
        </p>
      </div>
      {rental.status !== "canceled" && rental.status !== "completed" && (
        <div style={{ gap: "10px", display: "flex", flexDirection: "column" }}>
          <Button
            onClick={() => setRentalCancelVisible((prev) => !prev)}
            haveBaccol={false}
          >
            <p style={{ color: "red" }}>Отозвать аренду</p>
          </Button>
        </div>
      )}
      {rental.status === "canceled" && (
        <div className="rental-cancel-data">
          <p>Аренда отозвана</p>
          <p>
            Причина:{" "}
            {getRentalCancelReason(rental?.cancelData?.reason) || "Неизвестно"}
          </p>
          <p>
            Инициатор:{" "}
            {rental?.cancelData?.iniciator === store.user.id ? "Вы" : "Клиент"}{" "}
          </p>
        </div>
      )}
      {cancelRentalVisible && (
        <div style={{ gap: "10px", display: "flex", flexDirection: "column" }}>
          <SelectMenu
            options={cancelRentalOptions}
            onSelect={(value) => {
              setRentalCancelVisible(false);
              log(value);
            }}
            onClose={() => {
              setRentalCancelVisible(false);
              log("closed");
            }}
            onChange={(value) => {
              setCancelReason(value);
              log(value);
            }}
          />
          {cancelReason === "other" && (
            <div>
              <Input placeholder="Причина" />
            </div>
          )}
          <Button onClick={() => handleCancelRental()}>Подтвердить</Button>
        </div>
      )}
    </div>
  );
};

export default RentalModalContent;
