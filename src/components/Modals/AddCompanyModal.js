import Button from "../UI/Buttons/Button";
import Input from "../UI/Input/Input";
import AvatarUpload from "../UI/AvatarUpload/AvatarUpload";
import TimePicker from "react-time-picker";

const AddCompanyModal = ({ handleSaveAvatar, companyName, setCompanyName, companyAddress, setCompanyAddress, setStartCompanyWorkTime, setEndCompanyWorkTime, companyInn, setCompanyInn, email, setEmail, phone, setPhone, handleFormSubmit, startCompanyWorkTime, endCompanyWorkTime }) => {
  return (
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
                <h2>Выберите начало рабочего дня компании:</h2>
                <TimePicker onChange={setStartCompanyWorkTime} value={startCompanyWorkTime} format="HH:mm" clearIcon={null} />
                <h2>Выберите конец рабочего дня:</h2>
                <TimePicker onChange={setEndCompanyWorkTime} value={endCompanyWorkTime} format="HH:mm" clearIcon={null} />
              <Input
                placeholder="ИНН компании"
                value={companyInn}
                onChange={(e) => setCompanyInn(e.target.value)}
                required
                className="modal-input"
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
              />

              <Button onClick={handleFormSubmit}>Добавить</Button>
            </div>
          </>
  );
};

export default AddCompanyModal;