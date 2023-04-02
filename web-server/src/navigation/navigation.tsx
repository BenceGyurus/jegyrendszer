import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "../components/admin/adminLogin.component";
import Index from "../components/mainSite/mainSite.component";
import EventPage from "../components/event-page/event-page";
import ErrorPage from "../components/error-page/error-page";
import Welcome from "../components/admin/adminComponents/welcome.component";
import AdminPage from "../components/admin/adminPage.component";
import Venues from "../components/admin/adminComponents/venues.component"
import NewVenue from "../components/admin/operation/new_Room.component"
import Main from "../components/admin/operation/edit-users/main";



function Navigation() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="event/*" element={<EventPage/>} />
          <Route path = "/admin" element = {<AdminPage component = {<Welcome />}/>}/>
          <Route path = "/admin/termek" element = {<AdminPage component = {<Venues />}/>}/>
          <Route path = "/admin/felhasznalok" element = {<AdminPage component = {<Main />}/>}/>
          <Route path = "/uj-terem" element = {<NewVenue />}/>
          <Route path = "/admin/terem-szerkesztes/*" element = {<NewVenue />}/>
          <Route path= "*" element = {<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Navigation;