import React, { useEffect, useState } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import PropTypes from "prop-types";
import CarItemBit from "../Car/CarItemBit";
import UserProfileLight from "../Profile/UserProfileLight";
import { Clock } from "lucide-react";
import SelectMenu from "../UI/SelectMenu/SelectMenu";
import Button from "../UI/Buttons/Button";
import Input from "../UI/Input/Input";
import { companyStore } from "../..";

const options = [
    { value: "notCome", label: "Не пришел в офис " },
    { value: "carProblem", label: "Проблемы с автомобилем " },
    { value: "other", label: "Другое " },
]
const formatDate = (isoString) => {
    if (!isoString) return "Неизвестно";
    const date = new Date(isoString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return "Неизвестно";
    const date = new Date(isoString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  
const RentalModalContent = ({
  rental,
  onClose,
}) => {
    console.log('sdfsdfs', rental);
    const [reason, setReason] = useState(false);
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
    if (reason) {
      companyStore.cancelRental(rental._id, reason);
      setRentalCancelVisible(false);
    }
  };

  return (
    <div className="car-modal-content">
      Аренда N{rental?._id}
      <div className="request-item__row">
        <CarItemBit car={rental.rental.car} />
      </div>
      <div className="request-item__row">
        <UserProfileLight user={rental.rental.user} actions={true} />
      </div>
      <div className="request-item__row">
        <p className="request-item__value">
          <div className="item-row">
            <Clock /> <p> С: </p> {formatDate(rental.dates?.startDate.date)} {formatTime(rental.dates?.startDate.time)}
          </div>
          <div className="item-row">
            <Clock /> <p> До: </p> {formatDate(rental.dates?.endDate.date)} {formatTime(rental.dates?.endDate.time)}
          </div>
        </p>
      </div>
      <div style={{gap:"10px", display:"flex", flexDirection:"column"}}>
      <Button onClick={() => setRentalCancelVisible(prev => !prev)} haveBaccol={false}>
  <p style={{ color: "red" }}>Отозвать аренду</p>
</Button>   
</div>
   {cancelRentalVisible && (
        <div style={{gap:"10px", display:"flex", flexDirection:"column"}}>
        <SelectMenu
        options={options}
          onSelect={(value) => {
            setRentalCancelVisible(false);
            console.log(value);
          }}
          onClose={() => {
            setRentalCancelVisible(false);
            console.log("closed");
          }}
          onChange={(value) => {
            setReason(value);
            console.log(value);
          }}
        />
        {reason === 'other' && <div ><Input placeholder = "Причина"/></div>}
        <Button onClick={() => handleCancelRental()}>Подтвердить</Button>
        </div>
      )}
    </div>
  );
};

RentalModalContent.propTypes = {
  request: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RentalModalContent;
