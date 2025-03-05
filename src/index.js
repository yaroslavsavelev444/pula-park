import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Store from "./store/store";
import CompanyStore from "./store/companyStore"; // Импорт companyStore
import ChatStore from "./store/chatStore"; // Импорт companyStore

export const store = new Store();
export const companyStore = new CompanyStore();
export const chatStore = new ChatStore();

export const Context = createContext({
    store,
    companyStore
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Context.Provider value={{ store, companyStore, chatStore }}>
        <App />
        </Context.Provider>
    </React.StrictMode>
);