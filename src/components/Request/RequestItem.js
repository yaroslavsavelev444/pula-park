import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Request.css";
import CarItemBit from "../Car/CarItemBit";
import UserProfileLight from "../Profile/UserProfileLight";
import { Clock } from "lucide-react";
import Button from "../UI/Buttons/Button";

const statusMap = {
  pending: "Ожидает",
  rejected: "Отклонено",
  approved: "Одобрено",
  confirmed: "Подтверждено",
  cancelledAhead: "Отмена",
};


const RequestItem = ({
  request,
  onClick
}) => {
  const { user, car, phone, status, createdAt } = request;
  const [currentStatus, setCurrentStatus] = useState(status);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="request-item" onClick={() => onClick(request)}>
      <div className="request-item__row">
        <CarItemBit car={car} />
      </div>
      <div className="request-item__row">
        <UserProfileLight user={user} />
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
    </div>
  );
};

RequestItem.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    car: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    phone: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RequestItem;
