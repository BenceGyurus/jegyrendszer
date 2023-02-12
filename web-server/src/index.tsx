import ReactDOM from 'react-dom/client';
import "./css/style.css";
import Navigation from "./navigation/navigation";
import CookiePopUp from './components/cookies/cookies.component';
import Header from "./components/siteElements/header.component";
import Footer from "./components/siteElements/footer.component";

//const ds = "A két felvonásos, lendületes és rendkívül látványos zenés darab amellett, hogy ragyogó szórakozást ígér, segíthet újra felfedezni, új oldaláról megismerni a mára közismert név mögött rejtőző csodálatos zseni elméjét és életének rejtélyeit!";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <div>
        <Header />
        <Navigation />
        <Footer/>
    </div>
);