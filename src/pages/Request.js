import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useToast } from "../providers/ToastProvider";
import { Context } from "../index";
import "../components/Request/Request.css"; 
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RequestItem from "../components/Request/RequestItem";
import SelectMenu from "../components/UI/SelectMenu/SelectMenu";
import FilterBar from "../components/UI/FilterBar/FilterBar";
import Empty from "../components/Empty/Empty";
import Input from "../components/UI/Input/Input";
import Modal from "../components/UI/Modal/Modal";
import { Button } from "react-bootstrap";
import CustomDateTimePicker from "../components/UI/CustomDateTimePicker/CustomDateTimePicker";
import RequestModalContent from "../components/Modals/RequestModalContent";

const options = [
  { value: "rejected", label: "Отклоненные", color: "#F44336" },
  { value: "approved", label: "Принятые", color: "#4CAF50" },
  { value: "pending", label: "Ожидающие", color: "#2196F3" },
  { value: "cancelledAhead", label: "Отменено вперед", color: "#2196F3" },
];

const sortOptions = [
  {
    value: "dateAsc",
    label: "По дате создания (по возрастанию)",
    default: false,
  },
  {
    value: "dateDesc",
    label: "По дате создания (по убыванию)",
    default: true,
    color: "#FF9800",
  },
];

const Request = () => {
  const navigate = useNavigate();
  const { store, companyStore } = useContext(Context);
  const { showToast } = useToast();
  const ownerId = companyStore.company ? companyStore.company._id : null;
  const storedFilters = JSON.parse(localStorage.getItem(process.env.REQUESTS_STORAGE_KEY_FILTERS)) || [];
  const storedSort = localStorage.getItem(process.env.REQUESTS_STORAGE_KEY_SORT) || "dateDesc";
  const [sortParam, setSortParam] = useState(storedSort);
  const [filterParam, setFilterParam] = useState(storedFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedCancelledRequestId , setSelectedCancelledRequestId] = useState(null);
  const { requestId } = useParams();

  useEffect(() => {
      if (requestId) {
        const request = companyStore.requests.find(request => request._id === requestId);
        if (request) {
          console.log("request", request);
          handleRequestModal(request);
        } else {
          navigate("/request");
        }
      }
    }, [requestId, companyStore.requests]);
  
  const handleSortChange = (value) => {
    if (companyStore.requests.length > 1) {
      setSortParam(value);
      localStorage.setItem(process.env.REQUESTS_STORAGE_KEY_SORT, value);
      if (ownerId !== null) {
        companyStore.fetchRequests(ownerId, filterParam, value);
      }
    }
  };

  const handleFilterChange = (values) => {
    setFilterParam(values);
    localStorage.setItem(process.env.REQUESTS_STORAGE_KEY_FILTERS, JSON.stringify(values));
    if (ownerId !== null) {
      companyStore.fetchRequests(ownerId, values, sortParam);
    }
  };

  useEffect(() => {
    if (ownerId) {
      companyStore.fetchRequests(ownerId, filterParam, sortParam);
    }
  }, [ownerId, filterParam, sortParam]);

  const handleRequestStatusChange = (requestId, newStatus, startDate, endDate) => {
    console.log("requestId", requestId, "newStatus", newStatus, "startDate", startDate, "endDate", endDate);
    if (requestId) {
      if (newStatus === "confirmed") {
        if (alertIfDateIsEmpty(startDate, endDate)) return;
        companyStore.updateRequestStatus(requestId, newStatus, startDate, endDate);
        showToast({ text1: "Статус заявки изменен на 'Одобрено'", type: "success" });
        setIsModalOpen(false);
        setSelectedCancelledRequestId(null);
      } else {
        companyStore.updateRequestStatus(requestId, newStatus);
        showToast({ text1: "Статус заявки изменен", type: "success" });
      }
    }
  };

  const alertIfDateIsEmpty = (startDate, endDate) => {
    if (!startDate || !endDate) {
      showToast({ text1: "Необходимо выбрать даты начала и окончания аренды", type: "warning" });
      return true;
    }
    return false;
  };
  
  const handleCancel = (selectedCancelledRequestId, message) => {
      companyStore.cancelCancelRequestAhead(selectedCancelledRequestId, message, store.user.id);
      showToast({ text1: "Заявка отменена", type: "success" });
      setIsModalOpen(false); 
      setSelectedCancelledRequestId(null);
  };

  const handleOpenModal = (requestId) => {
    setSelectedCancelledRequestId(requestId);
    setModalContent("cancelRequestAhead");
    setIsModalOpen(true);
    setMessage("");
  };

  const openDateModal = (requestId, setStartDate, setEndDate) => {
    setStartDate(null);
    setEndDate(null);
    setModalContent({ type: "dataModal", requestId });
   setIsModalOpen(true);
  };

  const handleRequestModal = (request) => {
    setModalContent({ type: "requestModal", request });
    setIsModalOpen(true);
  };

  return (
    <div className="page_wrapper">
      <div className="left-sidebar">
        <div className="left-add-car">
         <Empty text={"Пусто"} />
        </div>
        <div className="left-sort">
          <>
          <FilterBar options={options} onChange={handleFilterChange} selectedFilters={filterParam} />
          </>
        </div>
      </div>
      <div className="right-content-wrapper">
        <div className="right-sort-wrapper">
          <SelectMenu
           options={sortOptions} onChange={handleSortChange} value={sortParam}
          />
        </div>
        {companyStore.requests.length > 0 ? (
          <div className="right-content">
            <>
              {companyStore.requests.map((request) => (
                <>
                <RequestItem
                  request={request}
                  key={request._id}
                  onStatusChange={handleRequestStatusChange}
                  onCancel={handleOpenModal}
                  openDateModal={openDateModal}
                  showToast={showToast}
                  onClick={handleRequestModal}
                />
               </>
              ))}
            </>
          </div>
        ) : (
          <Empty text={"Заявок нет"} />
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      {modalContent === "cancelRequestAhead" && (
        <>
          <h1>Укажите причину досрочной отмены заказа</h1>
          <Input
            type="text"
            placeholder="Причина"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            />
            <Button onClick={() => handleCancel(selectedCancelledRequestId, message, store.user.id)}>Отменить</Button>
            </>
        )}  

{modalContent?.type === "requestModal" && (
  <> 
  <RequestModalContent request={modalContent.request}
  onStatusChange={handleRequestStatusChange}
  onCancel={handleOpenModal}
  openDateModal={openDateModal}
  showToast={showToast}
   onClose={() => setIsModalOpen(false)} />
  </>
)}
      </Modal>
    </div>
  );
};

export default observer(Request);
