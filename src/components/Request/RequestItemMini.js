import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Request.css";
import CarItemBit from "../Car/CarItemBit";
import UserProfileLight from "../Profile/UserProfileLight";
import { Clock , AlertCircleIcon } from "lucide-react";
import Button from "../UI/Buttons/Button";

const statusMap = {
  pending: "Ожидает",
  cancelledAhead: "Отмена",
};

const RequestItemMini = ({
  request
}) => {
  const { user, car, phone, status, createdAt } = request;
  const [currentStatus, setCurrentStatus] = useState(status);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="request-item request-item--mini">
        <div className="new-item-notificator"><AlertCircleIcon color="orange" size={30}/></div>
      <div className="request-item__row">
        <UserProfileLight user={user} />
        <a href={`tel:${phone}`} className="request-item__link">
          {phone}
        </a>
      </div>
      <div className="request-item__row">
        <CarItemBit car={car} />
        <p className="request-item__value">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

RequestItemMini.propTypes = {
  request: PropTypes.object.isRequired,
};

export default RequestItemMini;
