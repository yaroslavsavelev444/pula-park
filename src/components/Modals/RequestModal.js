import Button from "../UI/Buttons/Button";
import Modal from "../UI/Modal/Modal";

const RequestModal = ({ request, onClose, isOpen }) => {
    console.log("reqsdfsfest", request);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Пример модалки для {request.user.name}</h2>
      <Button>ыпыпыап</Button>
    </Modal>
  );
};

export default RequestModal;