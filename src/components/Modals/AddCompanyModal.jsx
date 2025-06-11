import Button from "../UI/Buttons/Button";
import Input from "../UI/Input/Input";
import AvatarUpload from "../UI/AvatarUpload/AvatarUpload";
import InputRawHtml from "../safeRenderers/InputRawHtml";
import { useState, useEffect, useContext } from "react";
import Tooltip from "../UI/Tooltip/Tooltip";
import { FaInfoCircle } from "react-icons/fa";
import { Context } from "../..";
import Loader from "../UI/Loader/Loader";
import { observer } from "mobx-react-lite";

const AddCompanyModal = ({
  handleSaveAvatar,
  companyName,
  setCompanyName,
  companyAddress,
  setCompanyAddress,
  setStartCompanyWorkTime,
  setEndCompanyWorkTime,
  companyInn,
  setCompanyInn,
  email,
  setEmail,
  phone,
  setPhone,
  handleFormSubmit,
  startCompanyWorkTime,
  endCompanyWorkTime,
  companyText,
  setCompanyText,
}) => {
  const {companyStore } = useContext(Context);
  const [startTime, setStartTime] = useState({ hours: "", minutes: "" });
  const [endTime, setEndTime] = useState({ hours: "", minutes: "" });

  // Обновление времени работы компании
  useEffect(() => {
    setStartCompanyWorkTime(`${startTime.hours}:${startTime.minutes}`);
  }, [startTime]);

  useEffect(() => {
    setEndCompanyWorkTime(`${endTime.hours}:${endTime.minutes}`);
  }, [endTime]);

  const handleStartTimeChange = (e) => {
    const { name, value } = e.target;
    const intValue = parseInt(value, 10); // Преобразуем в число

    if (name === "startHours" && intValue >= 0 && intValue <= 23) {
      setStartTime((prev) => ({ ...prev, hours: intValue }));
    } else if (name === "startMinutes" && intValue >= 0 && intValue <= 59) {
      setStartTime((prev) => ({ ...prev, minutes: intValue }));
    }
  };

  const handleEndTimeChange = (e) => {
    const { name, value } = e.target;
    const intValue = parseInt(value, 10); // Преобразуем в число

    if (name === "endHours" && intValue >= 0 && intValue <= 23) {
      setEndTime((prev) => ({ ...prev, hours: intValue }));
    } else if (name === "endMinutes" && intValue >= 0 && intValue <= 59) {
      setEndTime((prev) => ({ ...prev, minutes: intValue }));
    }
  };

  return (
    <>
      {companyStore.isLoading === true ? (
 <Loader  size={100}/>
      ) : (
        <>
          <h2>Заполните данные о компании</h2>
          <div className="modal-input-wrapper">
            <div className="company-logo"></div>
            <AvatarUpload onSubmit={handleSaveAvatar} />

            <Input
              placeholder="Название компании"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="modal-input"
            />

            <Input
              placeholder="Адрес компании"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              required
              className="modal-input"
            />

            <label htmlFor="time-inputs-container" className="timepicker-label">
              <div className="label-timepicker">
                <p>
                  Время работы
                  <Tooltip
                    icon={<FaInfoCircle />}
                    text="Будем высылать вам уведомление о новых заказах в указанное время"
                    id="info-tooltip"
                  />
                </p>
              </div>
              <div id="time-inputs-container" className="time-inputs-container">
                <div className="time-inputs">
                  <input
                    type="number"
                    name="startHours"
                    value={startTime.hours}
                    onChange={handleStartTimeChange}
                    placeholder="Часы"
                    min="0"
                    max="23"
                    className="time-input"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    name="startMinutes"
                    value={startTime.minutes}
                    onChange={handleStartTimeChange}
                    placeholder="Мин"
                    min="0"
                    max="59"
                    className="time-input"
                  />
                </div>
                <div className="time-inputs">
                  <input
                    type="number"
                    name="endHours"
                    value={endTime.hours}
                    onChange={handleEndTimeChange}
                    placeholder="Часы"
                    min="0"
                    max="23"
                    className="time-input"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    name="endMinutes"
                    value={endTime.minutes}
                    onChange={handleEndTimeChange}
                    placeholder="Мин"
                    min="0"
                    max="59"
                    className="time-input"
                  />
                </div>
              </div>
            </label>

            <Input
              placeholder="ИНН компании"
              value={companyInn}
              onChange={(e) => setCompanyInn(e.target.value)}
              required
              className="modal-input"
              mask="9999999999"
            />

            <Input
              placeholder="Рабочий email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="modal-input"
            />

            <Input
              placeholder="Телефон компании"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="modal-input"
              mask="+7 (999) 999-99-99"
            />

            <InputRawHtml
              onSave={setCompanyText}
              value={companyText}
              onChange={(e) => setCompanyText(e.target.value)} // Правильный обработчик
              required
              className="modal-input"
            />

            <Button onClick={handleFormSubmit}>Добавить</Button>
          </div>
        </>
      )}
    </>
  );
};

export default observer(AddCompanyModal);
