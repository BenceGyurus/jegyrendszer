import "../../css/feedbackIcon.css";
import { Tooltip, Badge } from "antd";
import typeOfFeedbackIconParams from "./types/feedbackIconParams";

export const FeedBackIconComponent = ({
  onClickFunction,
}: typeOfFeedbackIconParams) => {
  return (
    <div className="feedback-icon" onClick={() => onClickFunction()}>
      <Badge dot={true}>
        <div className="feedback-icon-tooltip">
          <i className="fas fa-bug"></i>
        </div>
      </Badge>
    </div>
  );
};

export default FeedBackIconComponent;
