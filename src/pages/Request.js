import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useToast } from "../providers/ToastProvider";
import { Context } from "../index";
import { useNavigate } from "react-router-dom";
import RequestItem from "../components/Request/RequestItem";
import SelectMenu from "../components/UI/SelectMenu/SelectMenu";
import FilterBar from "../components/UI/FilterBar/FilterBar";
import Empty from "../components/Empty/Empty";

const options = [
  { value: "rejected", label: "Отклоненные", color: "#F44336" },
  { value: "approved", label: "Принятые", color: "#4CAF50" },
  { value: "pending", label: "Ожидающие", color: "#2196F3", default: true },
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
  const defaultSortOption = sortOptions.find((option) => option.default);
  const defaultFilterOption = options.find((option) => option.default);
  const [sortParam, setSortParam] = useState(
    defaultSortOption ? defaultSortOption.value : "dateDesc"
  );
  const [filterParam, setFilterParam] = useState(
    defaultFilterOption ? defaultFilterOption.value : "approved"
  );

  const handleSortChange = (value) => {
    if (companyStore.requests.length > 1) {
      setSortParam(value);
      if (ownerId !== null) {
        companyStore.fetchRequests(ownerId, filterParam, value);
      }
    }
  };

  const handleFilterChange = (value) => {
    setFilterParam(value);
    if (ownerId !== null) {
      companyStore.fetchRequests(ownerId, value, sortParam);
    }
  };

  useEffect(() => {
    if (ownerId) {
      companyStore.fetchRequests(ownerId, filterParam, sortParam);
    }
  }, [ownerId, filterParam, sortParam]);

  const handleRequestStatusChange = (requestId, newStatus) => {
    if (requestId && newStatus) {
      companyStore.updateRequestStatus(requestId, newStatus);
      showToast({ text1: "Статус заявки изменен", type: "success" });
    }
  };

  if (store.isAuth === false) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="page_wrapper">
      <div className="left-sidebar">
        <div className="left-add-car">
          <h1>Тестовый блок</h1>
        </div>
        <div className="left-sort">
          <>
            <FilterBar options={options} onChange={handleFilterChange} />
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
        {companyStore.requests.length > 0 ? (
          <div className="right-content">
            <>
              {companyStore.requests.map((request) => (
                <RequestItem
                  request={request}
                  key={request._id}
                  onStatusChange={handleRequestStatusChange}
                />
              ))}
            </>
          </div>
        ) : (
          <Empty text={"Заявок нет"} />
        )}
      </div>
    </div>
  );
};

export default observer(Request);
