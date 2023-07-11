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
import Registration from "../components/admin/operation/registrationNewUser.component";
import Create_Event_Main from "../components/admin/operation/events/main";
import Show_Events_Main from "../components/admin/operation/show-events/main";
import EditProfileMain from "../components/admin/operation/profile/main";
import BuyTicketMainPage from "../components/buy-ticket/buy-ticket-main-page.component";
import ReferalMain from "../components/admin/operation/referals/main";
import LocalSaleMain from "../components/admin/operation/local-sale/local-sale-main";
import Local_Sale_Event from "../components/admin/operation/local-sale/opend-event.component";
import TicketSalesMain from "../components/admin/operation/ticket-sales/main";



function Navigation() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/rendezveny/*" element={<EventPage/>} />
          <Route path="/jegyvasarlas/*" element={<BuyTicketMainPage/>} />
          <Route path = "/admin" element = {<AdminPage component = {<Welcome />}/>}/>
          <Route path = "/admin/termek" element = {<AdminPage component = {<Venues />}/>}/>
          <Route path = "/admin/felhasznalok" element = {<AdminPage component = {<Main />}/>}/>
          <Route path = "/admin/profil" element = {<AdminPage component = {<EditProfileMain />} /> } />
          <Route path = "/uj-terem" element = {<NewVenue />}/>
          <Route path = "/uj-profil/*" element = {<Registration />}/>
          <Route path = "/admin/rendezveny/*" element = {<Create_Event_Main />} />
          <Route path = "/admin/terem-szerkesztes/*" element = {<NewVenue />}/>
          <Route path = "/admin/rendezvenyek" element = {<AdminPage component = {<Show_Events_Main />} />} />
          <Route path = "/admin/kuponok" element = {<AdminPage component = {<ReferalMain />}/>} />
          <Route path= "*" element = {<ErrorPage />} />
          <Route path = "/admin/helyi-eladas" element = {<AdminPage component = {<LocalSaleMain />} />} />
          <Route path = "/admin/eladas/*" element = {<AdminPage component = {<Local_Sale_Event />}/>} />
          <Route path = "/admin/jegy-eladasok" element={<AdminPage component = {<TicketSalesMain />} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Navigation;