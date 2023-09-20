import "../../css/errorBox.css";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import AlertTitle from '@mui/material/AlertTitle';

type typeOfErrorParams = {
    title? : string,
    message? : string,
    open : boolean,
    setOpen : Function
}

const Error = ( { title, message, open, setOpen }:typeOfErrorParams ) => {
  return (
    <div className = "notification-box">
    <Collapse in={open}>
    <Alert
      severity="error"
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            setOpen();
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
      sx={{ mb: 2 }}
    >
      {title ? <AlertTitle>{title}</AlertTitle> : ""}
      {message}
    </Alert>
  </Collapse>
  </div>
  );
};


/*
<div className="error-box">
        {closeFunction ? <i style={{cursor: "pointer"}} onClick={e => closeFunction()} className ="fas fa-times"></i> : ""}
        {title ? <h1>{title}</h1> : ""}
      <p>{message}</p>
    </div>*/

export default Error;