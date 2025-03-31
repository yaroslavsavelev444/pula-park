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
import CustomDateTimePicker from "../components/UI/CustomDateTimePicker/CustomDateTimePicker";
import RequestModalContent from "../components/Modals/RequestModalContent";
import Button from "../components/UI/Buttons/Button";
import {
  requestOptions,
  sortRequestOptions,
} from "../components/constants/options";
import Loader from "../components/UI/Loader/Loader";

const Request = () => {
  const navigate = useNavigate();
  const { store, companyStore } = useContext(Context);
  const { showToast } = useToast();
  const ownerId = companyStore.company ? companyStore.company._id : null;
  const storedFilters =
    JSON.parse(localStorage.getItem("requestFilterData")) || [];
  const storedSort = localStorage.getItem("requestSortData");
  const defaultSort = "dateDesc";

  const parsedSort = storedSort ? JSON.parse(storedSort) : defaultSort;

  const [sortParam, setSortParam] = useState(parsedSort);
  const [filterParam, setFilterParam] = useState(storedFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [message, setMessage] = useState("");

  const limit = 10;
  const [isFetching, setIsFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCancelledRequestId, setSelectedCancelledRequestId] =
    useState(null);
  const { requestId } = useParams();

  useEffect(() => {
    if (requestId) {
      const request = companyStore.requests.find(
        (request) => request._id === requestId
      );
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
      localStorage.setItem("requestSortData", JSON.stringify(value));
      if (ownerId !== null) {
        companyStore.getRequests(ownerId, filterParam, value);
      }
    }
  };

  const handleFilterChange = (values) => {
    setFilterParam(values);
    localStorage.setItem("requestFilterData", JSON.stringify(values));
    if (ownerId !== null) {
      companyStore.getRequests(ownerId, values, sortParam);
    }
  };

  const handleRequestStatusChange = (
    requestId,
    newStatus,
    startDate,
    endDate
  ) => {
    if (requestId) {
      if (newStatus === "confirmed") {
        if (alertIfDateIsEmpty(startDate, endDate)) return;
        companyStore.updateRequestStatus(
          requestId,
          newStatus,
          startDate,
          endDate
        );
        showToast({
          text1: "Статус заявки изменен на 'Одобрено'",
          type: "success",
        });
        setIsModalOpen(false);
        setSelectedCancelledRequestId(null);
      } else {
        companyStore.updateRequestStatus(requestId, newStatus);
        companyStore.getRequests(ownerId, filterParam, sortParam);
        showToast({ text1: "Статус заявки изменен", type: "success" });
      }
    }
  };

  const alertIfDateIsEmpty = (startDate, endDate) => {
    if (
      !startDate ||
      !endDate ||
      startDate === "" ||
      endDate === "" ||
      !startDate.date ||
      !endDate.date ||
      !startDate.time ||
      !endDate.time
    ) {
      showToast({
        text1: "Необходимо выбрать даты начала и окончания аренды",
        type: "warning",
      });
      return true;
    }
    return false;
  };

  const handleCancel = (selectedCancelledRequestId, message) => {
    if (!selectedCancelledRequestId || !message) {
      showToast({ text1: "Заполните все поля", type: "warning" });
      return;
    }
    companyStore.cancelCancelRequestAhead(
      selectedCancelledRequestId,
      message,
      store.user.id
    );
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

  //Динамическая пагинация

  useEffect(() => {
    if (ownerId) {
      companyStore.getRequests(ownerId, filterParam, sortParam, limit, currentPage);
    }
  }, [ownerId, filterParam, sortParam]); 

  useEffect(() => {
    if (isFetching) {
      companyStore
        .getRequests(ownerId, filterParam, sortParam, limit, currentPage + 1) // Передаем следующую страницу
        .then(() => {
          setCurrentPage(prev => prev + 1);
          setIsFetching(false);
        })
        .catch(() => setIsFetching(false)); // Обязательно сбрасываем состояние при ошибке
    }
  }, [isFetching, ownerId, filterParam, sortParam, limit]); 

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return () => {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const scrollHandler = () => {
    console.log('companyStore.totalRequests',  companyStore.totalRequests);
    console.log('companyStore.requests.length',  companyStore.requests.length);
    if (
      document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.documentElement.clientHeight) < 550 && companyStore.totalRequests > companyStore.requests.length && !isFetching
    ) {
      setIsFetching(true);
    }
  };

  return (
    <div className="page_wrapper">
      <div className="left-sidebar">
        <div className="left-add-car">
          <Empty text={"Пусто"} />
        </div>
        <div className="left-sort">
          <>
            <FilterBar
              options={requestOptions}
              onChange={handleFilterChange}
              selectedFilters={filterParam}
            />
          </>
        </div>
      </div>
      <div className="right-content-wrapper">
        <div className="right-sort-wrapper">
          <SelectMenu
            options={sortRequestOptions}
            onChange={handleSortChange}
            value={sortParam}
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
                    onClick={handleRequestModal}
                  />
                </>
              ))}
              {isFetching && <Loader />}
            </>
          </div>
        ) : (
          <Empty text={"Заявок нет"} />
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent === "cancelRequestAhead" && (
          <>
            <h1>Укажите причину отмены</h1>
            <Input
              type="text"
              placeholder="Причина"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <Button
              onClick={() =>
                handleCancel(selectedCancelledRequestId, message, store.user.id)
              }
            >
              Отменить заявку
            </Button>
          </>
        )}

        {modalContent?.type === "requestModal" && (
          <>
            <RequestModalContent
              request={modalContent.request}
              onStatusChange={handleRequestStatusChange}
              onCancel={handleOpenModal}
              openDateModal={openDateModal}
              showToast={showToast}
              onClose={() => setIsModalOpen(false)}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default observer(Request);
