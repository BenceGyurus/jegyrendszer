import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "../components/admin/adminLogin.component";
import Index from "../components/mainSite/mainSite.component";
import EventPage from "../components/event-page/event-page";
import ErrorPage from "../components/error-page/error-page";



function Navigation() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="event/*" element={<EventPage/>} />
          <Route path= "*" element = {<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Navigation;