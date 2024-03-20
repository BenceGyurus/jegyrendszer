import { BrowserRouter, Route, Routes } from "react-router-dom";
import Venues from "../components/admin/adminComponents/venues.component";
import Welcome from "../components/admin/adminComponents/welcome.component";
import AdminLogin from "../components/admin/adminLogin.component";
import AdminPage from "../components/admin/adminPage.component";
import Ads from "../components/admin/operation/ads/ads.component";
import CompaniesMain from "../components/admin/operation/companies/companiesMain";
import EditAszf from "../components/admin/operation/edit-aszf/edit-aszf.component";
import EditMail from "../components/admin/operation/edit-mail/edit-mail.component";
import Main from "../components/admin/operation/edit-users/main";
import Create_Event_Main from "../components/admin/operation/events/main";
import LocalDiscountMain from "../components/admin/operation/local-discount/local-discount-main.component";
import LocalSaleMain from "../components/admin/operation/local-sale/local-sale-main";
import Local_Sale_Event from "../components/admin/operation/local-sale/opend-event.component";
import EditProfileMain from "../components/admin/operation/profile/main";
import ReferalMain from "../components/admin/operation/referals/main";
import Registration from "../components/admin/operation/registrationNewUser.component";
import Show_Events_Main from "../components/admin/operation/show-events/main";
import Statistics from "../components/admin/operation/statistics/statistics.component";
import TicketSalesMain from "../components/admin/operation/ticket-sales/main";
import Aszf from "../components/aszf/aszf.component";
import LoadSeatMap from "../components/createSeatMap/loadSeatMap.component";
import ErrorPage from "../components/error-page/error-page";

function Navigation() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={<AdminPage component={<Welcome />} />}
          />
          <Route
            path="/admin/termek"
            element={<AdminPage component={<Venues />} />}
          />
          <Route
            path="/admin/felhasznalok"
            element={<AdminPage component={<Main />} />}
          />
          <Route
            path="/admin/profil"
            element={<AdminPage component={<EditProfileMain />} />}
          />
          <Route path="/admin/uj-terem" element={<LoadSeatMap />} />
          <Route path="/admin/uj-profil/*" element={<Registration />} />
          <Route path="/admin/rendezveny/*" element={<Create_Event_Main />} />
          <Route path="/admin/terem-szerkesztes/*" element={<LoadSeatMap />} />
          <Route
            path="/admin/rendezvenyek"
            element={<AdminPage component={<Show_Events_Main />} />}
          />
          <Route
            path="/admin/kuponok"
            element={<AdminPage component={<ReferalMain />} />}
          />
          <Route path="*" element={<ErrorPage />} />
          <Route
            path="/admin/helyi-eladas"
            element={<AdminPage component={<LocalSaleMain />} />}
          />
          <Route
            path="/admin/eladas/*"
            element={<AdminPage component={<Local_Sale_Event />} />}
          />
          <Route
            path="/admin/jegy-eladasok"
            element={<AdminPage component={<TicketSalesMain />} />}
          />
          <Route path="/aszf" element={<Aszf />} />
          <Route
            path="/admin/edit-aszf"
            element={<AdminPage component={<EditAszf />} />}
          />
          <Route
            path="/admin/cegek"
            element={<AdminPage component={<CompaniesMain />} />}
          />
          <Route
            path="/admin/edit-email"
            element={<AdminPage component={<EditMail />} />}
          />
          <Route
            path="/admin/helyi-kedvezmenyek"
            element={<AdminPage component={<LocalDiscountMain />} />}
          />
          <Route
            path="/admin/monitor"
            element={<AdminPage component={<Ads />} />}
          />
          <Route
            path="/admin/statisztika"
            element={<AdminPage component={<Statistics />} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Navigation;
