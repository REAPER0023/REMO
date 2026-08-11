import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout() {
  const location = useLocation();

  const isChatPage = location.pathname === "/chat";

  return (
    <>
      <Navbar />
      <Outlet />
      {!isChatPage && <Footer />}
    </>
  );
}

export default MainLayout;