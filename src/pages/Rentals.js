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

const filterOptions = [
  { value: "active", label: "Активные", color: "#F44336" },
  { value: "completed", label: "Завершенные", color: "#4CAF50" },
  { value: "canceled", label: "Отмененные", color: "#2196F3" },
];

const sortOptions = [
  { value: "dateAsc", label: "По дате (возрастание)" },
  { value: "dateDesc", label: "По дате (убывание)", default: true },
];

const Rentals = () => {
  const navigate = useNavigate();
  const { store, companyStore } = useContext(Context);
  const { showToast } = useToast();
  const ownerId = companyStore.company ? companyStore.company._id : null;
  // Загружаем фильтры из localStorage, если они там есть
  const storedFilters = localStorage.getItem("rentalFilterData");
  const initialFilters = storedFilters ? JSON.parse(storedFilters) : [];
  const storedSort = localStorage.getItem("rentalSortData");
  const initialSort = storedSort ? JSON.parse(storedSort) : "dateDesc";
  const [sortParam, setSortParam] = useState(initialSort);

  const [filterParam, setFilterParam] = useState(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleFilterChange = (values) => {
    setFilterParam(values);
    localStorage.setItem("rentalFilterData", JSON.stringify(values));
    if (ownerId) {
      companyStore.fetchRentals(ownerId, values, sortParam);
    }
  };

  // Функция обновления и сохранения сортировки
  const handleSortChange = (value) => {
    if (!companyStore.rentals.length) return;
    setSortParam(value);
    localStorage.setItem("rentalSortData", JSON.stringify(value));
    if (ownerId) {
      companyStore.fetchRentals(ownerId, filterParam, value);
    }
  };


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
            options={filterOptions}
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
          showToast={showToast}
          />
          </>
        )}
      </Modal>
    </div>
  );
};

export default observer(Rentals);
