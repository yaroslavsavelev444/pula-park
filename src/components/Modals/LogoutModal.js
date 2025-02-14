import Button from "../UI/Buttons/Button";
import Modal from "../UI/Modal/Modal";

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Вы точно хотите выйти из аккаунта?</h2>
      <Button onClick={onLogout}>Выйти</Button>
    </Modal>
  );
};

export default LogoutModal;