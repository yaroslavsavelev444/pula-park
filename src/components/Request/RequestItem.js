import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Request.css";
import CarItemBit from "../Car/CarItemBit";
import UserProfileLight from "../Profile/UserProfileLight";

const statusMap = {
  pending: "Ожидает",
  rejected: "Отклонено",
  approved: "Одобрено",
  confirmed: "Подтверждено",
  completed: "Выполнено",
};

const RequestItem = ({ request, onStatusChange }) => {
  console.log("request", request);  
  const { user, car, phone, status, createdAt } = request;
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    onStatusChange(request._id, newStatus);
  };

  // Проверка, чтобы заблокировать селект, если статус одобрен или отклонен
  const isStatusEditable = status !== "approved" && status !== "rejected";

  return (
    <div className="request-item">
      <div className="request-item__row">
        <CarItemBit car={car} />
      </div>
      <div className="request-item__row">
        <UserProfileLight user={request.user} />
      </div>
      <div className="request-item__row">
        <span className="request-item__label">Дата:</span>
        <span className="request-item__value">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>
      <div className="request-item__row">
        <span className="request-item__label">Телефон заявки:</span>
        <a href={`tel:${phone}`} className="request-item__link">
          {phone}
        </a>
      </div>
      <div className="request-item__row">
        <span className="request-item__label">Статус:</span>
        <select
          value={currentStatus}
          onChange={handleStatusChange}
          className="request-item__status-select"
        >
          {Object.keys(statusMap).map((statusKey) => (
            <option key={statusKey} value={statusKey}>
              {statusMap[statusKey]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

RequestItem.propTypes = {
  request: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    car: PropTypes.shape({
      characteristics: PropTypes.shape({
        model: PropTypes.string,
        brand: PropTypes.string,
        year: PropTypes.number,
      }).isRequired,
    }).isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    phone: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    requestDate: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default RequestItem;
