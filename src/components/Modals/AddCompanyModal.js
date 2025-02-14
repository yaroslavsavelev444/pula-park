import Modal from "../UI/Modal/Modal";
import Button from "../UI/Buttons/Button";
import Input from "../UI/Input/Input";
import AvatarUpload from "../UI/AvatarUpload/AvatarUpload";

const AddCompanyModal = ({ isOpen, onClose, companyData, setCompanyData, handleSubmit, handleSaveAvatar }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Заполните данные о компании</h2>
      <AvatarUpload onSubmit={handleSaveAvatar} />
      <Input 
        placeholder="Название компании" 
        value={companyData.name} 
        onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
      />
      <Input 
        placeholder="Адрес компании" 
        value={companyData.address} 
        onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
      />
      <Input 
        placeholder="ИНН компании" 
        value={companyData.inn} 
        onChange={(e) => setCompanyData({ ...companyData, inn: e.target.value })}
      />
      <Input 
        placeholder="Рабочий email" 
        value={companyData.email} 
        onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
      />
      <Input 
        placeholder="Телефон компании" 
        value={companyData.phone} 
        onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
      />
      <Button onClick={handleSubmit}>Добавить</Button>
    </Modal>
  );
};

export default AddCompanyModal;