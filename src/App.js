import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import { ThemeProvider } from "./providers/ThemeProvider";
import ResetPassword from "./pages/ResetPassword";
import Rentals from "./pages/Rentals";

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
        <ThemeProvider>
          <Router>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={store.isAuth ? <Navigate to="/profile" /> : <Auth />} />
              <Route path="/profile" element={store.isAuth ? <Profile /> : <Navigate to="/auth" />} />
              <Route path="/cars" element={store.isAuth ? <Cars /> : <Navigate to="/auth" />} />
              <Route path="/cars/:carId" element={store.isAuth ? <Cars /> : <Navigate to="/auth" />} />
              <Route path="/request" element={store.isAuth ? <Request /> : <Navigate to="/auth" />} />
              <Route path="/request/:requestId" element={store.isAuth ? <Request /> : <Navigate to="/auth" />} />
              <Route path="/rentals" element={store.isAuth ? <Rentals /> : <Navigate to="/auth" />} />
              <Route path="/reset-password" element={store.isAuth ? <Navigate to="/profile" /> : <ResetPassword />} />
              <Route path="*" element={<Navigate to="/ " />} />
            </Routes>
            <FooterBar />
          </Router>
        </ThemeProvider>
      </ToastProvider>
    </div>
  );
});

export default App;