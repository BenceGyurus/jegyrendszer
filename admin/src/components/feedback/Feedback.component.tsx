import { useState } from "react";
import { FeedBackIconComponent } from "./FeedBackIcon.component";
import FeedbackWindow from "./FeedbackWindow.component";
import postDataJson from "../connection/postDataJson";

const FeedBack = () => {
  const [opened, setOpened] = useState<boolean>(false);
  const [url, setUrl] = useState<string>(window.location.pathname);
  const [description, setdescription] = useState<string>("");

  const sendFeedback = () => {
    postDataJson("/feedback", { description: description, url: url }).then(
      (response) => {
        if (!response.error) {
          setOpened(false);
          setdescription("");
        }
      },
    );
  };

  return !opened ? (
    <FeedBackIconComponent
      onClickFunction={() => {
        setOpened(true);
      }}
    />
  ) : (
    <FeedbackWindow
      sendFunction={sendFeedback}
      description={description}
      url={url}
      setUrl={setUrl}
      setDescription={setdescription}
      onClickFunction={() => setOpened(false)}
    />
  );
};

export default FeedBack;
