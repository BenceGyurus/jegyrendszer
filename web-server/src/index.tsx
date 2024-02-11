import ReactDOM from "react-dom/client";
import "./css/style.css";
import Navigation from "./navigation/navigation";
/*import CookiePopUp from './components/cookies/cookies.component';*/
import Header from "./components/siteElements/header.component";
import Footer from "./components/siteElements/footer.component";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./css/card.css";
import Cookies from "./cookies/cookie";
import { CookiesProvider } from "react-cookie";
import FeedBack from "./components/feedback/Feedback.component";

//const ds = "A két felvonásos, lendületes és rendkívül látványos zenés darab amellett, hogy ragyogó szórakozást ígér, segíthet újra felfedezni, új oldaláról megismerni a mára közismert név mögött rejtőző csodálatos zseni elméjét és életének rejtélyeit!";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <CookiesProvider defaultSetOptions={{ path: "/" }}>
    <div>
      <Header
        listOfNavMenu={[
          { title: "Főoldal", link: "/" },
          { title: "Admin", link: "/admin" },
        ]}
      />
      <Cookies />
      <div className="mainDiv">
        <Navigation />
        <FeedBack />
      </div>
      <Footer />
    </div>
  </CookiesProvider>,
);
