import Modal from "../UI/Modal/Modal";
import Button from "../UI/Buttons/Button";
import { ArrowLeft } from "lucide-react";

const LogoutModal = ({ isOpen, onClose, onConfirm, handleGoBack }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
      <ArrowLeft size={20} onClick={handleGoBack} />
        <h2>Вы точно хотите выйти из аккаунта?</h2>
        <Button onClick={onConfirm}>Выйти</Button>
      </Modal>
    </>
  );
};

export default LogoutModal;
