import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Store from "./store/store";
import CompanyStore from "./store/companyStore"; // Импорт companyStore


export const store = new Store();
export const companyStore = new CompanyStore();

export const Context = createContext({
    store,
    companyStore
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Context.Provider value={{ store, companyStore }}>
        <App />
        </Context.Provider>
    </React.StrictMode>
);