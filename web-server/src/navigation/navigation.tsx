import { BrowserRouter, Route, Routes } from "react-router-dom";
import AfterBuy from "../components/afterBuy/afterBuy.component";
import Aszf from "../components/aszf/aszf.component";
import BuyTicketMainPage from "../components/buy-ticket/buy-ticket-main-page.component";
import ErrorPage from "../components/error-page/error-page";
import EventPage from "../components/event-page/event-page";
import Index from "../components/mainSite/mainSite.component";
import Monitor from "../components/monitor/monitor.component";

function Navigation() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path="/rendezveny/*" element={<EventPage />} />
          <Route path="/jegyvasarlas/*" element={<BuyTicketMainPage />} />
          <Route path="/aszf" element={<Aszf />} />
          <Route path="/vasarlas/*" element={<AfterBuy />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/statusz" element={<AfterBuy />} />
          <Route path="/*" element={<ErrorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Navigation;
