import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile";
import NavBar from "./components/navbar/NavBar";
import FooterBar from "./components/FooterBar/FooterBar";
import "./styles/App.css";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import Cars from "./pages/Cars";
import Request from "./pages/Request";
import Chats from "./pages/Chats";
import { ThemeProvider } from "./providers/ThemeProvider";
import ResetPassword from "./pages/ResetPassword";
import Rentals from "./pages/Rentals";
import User from "./pages/User";
import NotFound from "./pages/NotFound";
import { ToastProvider } from "./providers/ToastProvider";
import { log } from "./utils/logger";
import SupportChats from "./pages/SupportChats";
import Complaints from "./pages/Complaints";
import Loader from "./components/UI/Loader/Loader";

const AppContent = observer(() => {
  const location = useLocation();
  const { store, companyStore } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      log("checkAuth");
      store.checkAuth();
    }
  }, []);

  useEffect(() => {
    if (store.user?.id) {
      companyStore.fetchCompanyData();
    }
  }, [store.user?.id]);

  const hideFooter = ["/chats", "/auth", "/reset-password"].some((path) =>
    location.pathname.startsWith(path)
  );

  if(store.isLoading) {
    return <div className="App"><Loader /></div>
  }

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
  const isSpecialPage = ["/", "/chats", "/chats/:userId", "/auth"].includes(
    location.pathname
  );
  const { store } = useContext(Context);

  return (
    <div className={isSpecialPage ? "" : "content"}>
      <Routes>
        <Route path="/" element={<Home />} />
        {store.isAuth === false && <Route path="/auth" element={<Auth />} />}
        {store.isAuth === true && (
          <Route path="/profile" element={<Profile />} />
        )}
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
        {store.isAuth === true && (
          <Route path="/rentals" element={<Rentals />} />
        )}

        {store.isAuth === true && store.user.role === "Support" && (
          <Route path="/support-chats" element={<SupportChats />} />
        )}
        {store.isAuth === true && (
          <Route path="/complaints" element={<Complaints />} />
        )}

        {store.isAuth === true && (
          <Route path="/user/:userId" element={<User />} />
        )}
        {store.isAuth === true && <Route path="/chats" element={<Chats />} />}
        {store.isAuth === true && (
          <Route path="/chats/:userId" element={<Chats />} />
        )}
        {store.isAuth === false && (
          <Route path="/reset-password" element={<ResetPassword />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
  а;
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
