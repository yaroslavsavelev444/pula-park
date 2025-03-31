import React, { useContext, useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NavBar from "./components/navbar/NavBar";
import FooterBar from "./components/FooterBar/FooterBar";
import "./styles/App.css";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import ToastProvider from "./providers/ToastProvider";
import Cars from "./pages/Cars";
import Request from "./pages/Request";
import Chats from "./pages/Chats";
import Loader from "./components/UI/Loader/Loader";
import { ThemeProvider } from "./providers/ThemeProvider";
import ResetPassword from "./pages/ResetPassword";
import Rentals from "./pages/Rentals";
import User from "./pages/User";

const AppContent = observer(() => {
  const location = useLocation(); // Теперь он внутри <Router>
  const { store, companyStore } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, []);

  useEffect(() => {
    if (store.user?.id) {
      companyStore.fetchCompanyData();
    }
  }, [store.user?.id]);

  if (store.isLoading) {
    return (
      <div className="App">
        <Loader />
      </div>
    );
  }

  const hideFooter = location.pathname.startsWith("/chats");

  return (
    <div className="App">
      <ToastProvider>
        <ThemeProvider>
          <NavBar />
          <Content />
          {!hideFooter && <FooterBar />}
        </ThemeProvider>
      </ToastProvider>
    </div>
  );
});

const Content = () => {
  const location = useLocation(); 
  const isSpecialPage = ["/", "/chats", "/chats/:userId"].includes(location.pathname);
  const { store } = useContext(Context);

  return (
    <div className={isSpecialPage ? "" : "content"}>
      {store.isLoading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          {store.isAuth === false && <Route path="/auth" element={<Auth />} />}
          {store.isAuth === true && <Route path="/profile" element={<Profile />} />}
          {store.isAuth === true && (
            <>
              <Route path="/cars" element={<Cars />} />
              <Route path="/cars/:carId" element={<Cars />} />
            </>
          )}
          {store.isAuth === true && (
            <>
              <Route path="/request" element={<Request />} />
              <Route path="/request/:requestId" element={<Request />} />
            </>
          )}
          {store.isAuth === true && <Route path="/rentals" element={<Rentals />} />}
          {store.isAuth === true && <Route path="/user/:userId" element={<User />} />}
          {store.isAuth === true && <Route path="/chats" element={<Chats />} />}
          {store.isAuth === true && <Route path="/chats/:userId" element={<Chats />} />}
          {store.isAuth === false && <Route path="/reset-password" element={<ResetPassword />} />}
        </Routes>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;