import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NavBar from "./components/navbar/NavBar";
import FooterBar from "./components/FooterBar/FooterBar";
import "./styles/App.css";
import { Context} from "./index";
import {observer} from "mobx-react-lite";
import ToastProvider from "./providers/ToastProvider";
import Cars from "./pages/Cars";
import Request from "./pages/Request";
import Loader from "./components/UI/Loader/Loader";

const App = observer(() => {
  const { store, companyStore } = useContext(Context);
  useEffect(() => {
      if (localStorage.getItem('token')) {
          store.checkAuth()
      }
  }, [])
  useEffect(() => {
    if (store.user?.id) {
        companyStore.fetchCompanyData(store.user.id);
    }
}, [store.user?.id]); 


  if (store.isLoading) {
      return (
        <div className="App">
        <Loader />
      </div>
      )
  }

  return (
    <div className="App">
      <ToastProvider>
        <Router>
          <NavBar />
          
          {store.isLoading ? (
            <Loader />
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              {store.isAuth === false && <Route path="/auth" element={<Auth />} />}
              {store.isAuth === true && <Route path="/profile" element={<Profile />} />}
              {store.isAuth === true && <Route path="/cars" element={<Cars />} />}
              {store.isAuth === true && <Route path="/request" element={<Request />} />}
            </Routes>
          )}

          <FooterBar />
        </Router>
      </ToastProvider>
    </div>
  );
});

export default App;