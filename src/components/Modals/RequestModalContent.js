import React, { useEffect, useState } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import PropTypes from "prop-types";
import "../Car/Car.css";
import Button from "../UI/Buttons/Button";
import CarItemBit from "../Car/CarItemBit";
import UserProfileLight from "../Profile/UserProfileLight";
import CustomDateTimePicker from "../UI/CustomDateTimePicker/CustomDateTimePicker";

const statusMap = {
  pending: "Ожидает",
  rejected: "Отклонено",
  approved: "Одобрено",
  confirmed: "Подтверждено",
  cancelled: "Отмена",
};

const nextStatuses = {
  pending: ["rejected", "approved"],
  approved: ["cancelled", "confirmed"],
};

const RequestModalContent = ({
  request,
  onClose,
  showToast,
  onStatusChange,
  onCancel,
  openDateModal,
}) => {
  const { user, car, phone, status, createdAt } = request;
  const [currentStatus, setCurrentStatus] = useState(status);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
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

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    if (newStatus === "confirmed" && (!startDate || !endDate)) {
      showToast({ text1: "Выберите даты аренды", type: "warning" });
    } else {
      console.log(
        "newStatus",
        newStatus,
        "startDate",
        startDate,
        "endDate",
        endDate
      );
      onStatusChange(request._id, newStatus, startDate, endDate);
    }
  };

  return (
    <div className="car-modal-content">
      {request?._id}
      <div className="request-item__row">
        <CarItemBit car={car} />
      </div>
      <div className="request-item__row">
        <UserProfileLight user={user} actions={true}/>
      </div>
      <div className="request-item__row">
        <p className="request-item__label">Дата:</p>
        <p className="request-item__value">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
      <div className="request-item__row">
        <p className="request-item__label">Телефон заявки:</p>
        <a href={`tel:${phone}`} className="request-item__link">
          {phone}
        </a>
      </div>
      <div className="request-item__row">
        <p className="request-item__label">Статус:</p>
        <p className="request-item__value">{statusMap[currentStatus]}</p>
      </div>
      {currentStatus === "approved" && (
        <>
        <h1>Выберите дату</h1>
            <CustomDateTimePicker onChange={setStartDate} placeholder={"Начало аренды"}/>
            <CustomDateTimePicker onChange={setEndDate} placeholder={"Конец аренды"} />
        </>
      )}
      {currentStatus !== "confirmed" && (
        <div className="request-item__row request-item__actions">
          {nextStatuses[currentStatus]?.map((nextStatus) => (
            <Button
              key={nextStatus}
              onClick={() =>
                nextStatus === "cancelled"
                  ? onCancel(request._id)
                  : currentStatus === "approved"
                  ? handleStatusChange(nextStatus, startDate, endDate)
                  : handleStatusChange(nextStatus)
              }
            >
              {statusMap[nextStatus]}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

RequestModalContent.propTypes = {
  request: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RequestModalContent;
