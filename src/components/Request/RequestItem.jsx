import React from "react";
import PropTypes from "prop-types";
import "./Request.css";
import CarItemBit from "../Car/CarItemBit";
import { AlertCircleIcon } from "lucide-react";
import { getStatuses } from "../constants/maps";

const RequestItem = ({
  request,
  onClick,
}) => {
  const { user, car, phone, status, createdAt } = request;

  return (
    <div className="request-item" onClick={() => onClick(request)}>
      {status === "pending" && (
        <div className="new-item-notificator"><AlertCircleIcon color="orange" size={30}/></div>
      )}
      <div className="request-item__row">
        <CarItemBit car={car} />
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
        <p className="request-item__value">{getStatuses(status)}</p>
      </div>
    </div>
  );
};

// RequestItem.propTypes = {
//   request: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     car: PropTypes.object.isRequired,
//     user: PropTypes.object.isRequired,
//     phone: PropTypes.string.isRequired,
//     status: PropTypes.string.isRequired,
//     createdAt: PropTypes.string.isRequired,
//   }).isRequired,
// };

export default RequestItem;
