import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "../css/cookie.css";
import CookieIcon from "@mui/icons-material/Cookie";
import { v4 as uuid } from "uuid";
import { Button } from "antd";

const Cookies = () => {
  const [isCookiesAccepted, setIsCookiesAccepted] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies([
    "use-cookies",
    "token",
  ]);
  const [question, setQuestion] = useState(true);

  const acceptCookies = () => {
    setCookie("use-cookies", true);
    setIsCookiesAccepted(true);
    setQuestion(false);
  };

  const declineCookies = () => {
    setCookie("use-cookies", false);
    setIsCookiesAccepted(false);
    setQuestion(false);
  };

  useEffect(() => {
    setIsCookiesAccepted(!!cookies["use-cookies"]);
    setQuestion(
      cookies["use-cookies"] === false || cookies["use-cookies"] === true
        ? false
        : true,
    );
    if (isCookiesAccepted) {
      if (!cookies["token"]) setCookie("token", uuid());
    }
  }, [isCookiesAccepted]);

  return question ? (
    <div className="CookiePopUpWindow">
      <div className="cookies-accept-content-holder">
        <div className="cookies-accept-content cookies-accept-description">
          <div className="cookies-accept-content">
            <CookieIcon fontSize="large" />
          </div>
          <div>
            <h2 className="cookies-accept-content">Sütik engedélyzése</h2>
            <p className="cookies-accept-content">
              Ez az oldal sütiket használ a működéséhez
            </p>
          </div>
        </div>
        <div className="cookies-accept-content">
          <Button
            className="accept-cookie-button cookie-button"
            type="primary"
            onClick={() => acceptCookies()}
          >
            Engedélyezés
          </Button>
          <Button className="cookie-button" onClick={() => declineCookies()}>
            Letiltás
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Cookies;
