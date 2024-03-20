import FeedBackIconComponent from "./FeedBackIcon.component";
import typeOfFeedbackWindowParams from "./types/feedbackWindowParams";
import "../../css/feedbackWindow.css";
import { Input, Button, Alert } from "antd";

const FeedbackWindow = ({
  onClickFunction,
  url,
  description,
  setUrl,
  setDescription,
  sendFunction,
}: typeOfFeedbackWindowParams) => {
  return (
    <div>
      <div className="send-feedback-window">
        <Alert
          showIcon
          message="Információ"
          description="Visszajelzés nem csak hiba esetében küldhető, ha bármilyen észrevéte vagy tanácsa van az oldallal kapcsolatban, itt tudja jelezni."
          type="info"
          className="feedback-notification"
        />
        <h3>Hiba bejelentés</h3>
        <label htmlFor="url-of-the-feedback">Bejelentett oldal címe</label>
        <Input
          id="url-of-the-feedback"
          onChange={(e) => setUrl(e.target.value)}
          defaultValue={url}
        />
        <label htmlFor="description-of-issue">Hiba leírása</label>
        <br />
        <textarea
          defaultValue={description}
          onChange={(e) => setDescription(e.target.value)}
          className="feedback-text-area"
          id="description-ofissue"
        ></textarea>
        <Alert
          showIcon
          message="Figyelem"
          description="Csak valódi hiba esetén küldjön visszajelzést"
          type="warning"
          className="feedback-notification"
        />
        <Button
          className="send-feedback-button"
          type="primary"
          size="large"
          onClick={() => sendFunction()}
        >
          Küldés
        </Button>
      </div>
      <FeedBackIconComponent onClickFunction={onClickFunction} />
    </div>
  );
};

export default FeedbackWindow;
