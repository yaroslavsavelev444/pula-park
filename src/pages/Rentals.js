import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useToast } from "../providers/ToastProvider";
import { Context } from "../index";
import "../components/Request/Request.css";
import { useNavigate } from "react-router-dom";
import SelectMenu from "../components/UI/SelectMenu/SelectMenu";
import FilterBar from "../components/UI/FilterBar/FilterBar";
import Empty from "../components/Empty/Empty";
import Modal from "../components/UI/Modal/Modal";
import RentalItem from "../components/Rental/RentalItem";
import RentalModalContent from "../components/Modals/RentalModalContent";

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

const Rentals = () => {
  const navigate = useNavigate();
  const { store, companyStore } = useContext(Context);
  const { showToast } = useToast();
  const ownerId = companyStore.company ? companyStore.company._id : null;
  const storedFilters =
    JSON.parse(
      localStorage.getItem(process.env.RENTALS_STORAGE_KEY_FILTERS)
    ) || [];
  const storedSort =
    localStorage.getItem(process.env.RENTALS_STORAGE_KEY_SORT) || "dateDesc";
  const [sortParam, setSortParam] = useState(storedSort);
  const [filterParam, setFilterParam] = useState(storedFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleSortChange = (value) => {
    if (companyStore.rentals.length > 1) {
      setSortParam(value);
      localStorage.setItem(process.env.RENTALS_STORAGE_KEY_SORT, value);
      if (ownerId !== null) {
        companyStore.fetchRentals(ownerId, filterParam, value);
      }
    }
  };

  const handleFilterChange = (values) => {
    setFilterParam(values);
    localStorage.setItem(
      process.env.RENTALS_STORAGE_KEY_FILTERS,
      JSON.stringify(values)
    );
    if (ownerId !== null) {
      companyStore.fetchRentals(ownerId, values, sortParam);
    }
  };

  console.log("rentals render");
  useEffect(() => {
    if (ownerId) {
      companyStore.fetchRentals(ownerId, filterParam, sortParam);
    }
  }, [ownerId, filterParam, sortParam]);

  const handleRentalModal = (rental) => {
    setModalContent({ type: "rentalModal", rental });
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
            <FilterBar
              options={options}
              onChange={handleFilterChange}
              selectedFilters={filterParam}
            />
          </>
        </div>
      </div>
      <div className="right-content-wrapper">
        <div className="right-sort-wrapper">
          <SelectMenu
            options={sortOptions}
            onChange={handleSortChange}
            value={sortParam}
          />
        </div>
        {companyStore.rentals.length > 0 ? (
          <div className="right-content">
            <>
              {companyStore.rentals.map((rental) => (
                <RentalItem
                  rental={rental}
                  key={rental._id}
                  showToast={showToast}
                  onClick={handleRentalModal}
                />
              ))}
            </>
          </div>
        ) : (
          <Empty text={"Заявок нет"} />
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent === "cancelRequestAhead" && <h1>skdjfnsjfs</h1>}
        {modalContent?.type === "rentalModal" && (
          <> 
          <RentalModalContent 
          rental={modalContent.rental}
          onClose={() => setIsModalOpen(false)} 
          />
          </>
        )}
      </Modal>
    </div>
  );
};

export default observer(Rentals);
