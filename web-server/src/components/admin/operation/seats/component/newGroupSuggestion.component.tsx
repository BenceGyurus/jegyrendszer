import "../../../../../css/suggestedGroupsPopupwindow.css";
import * as React from 'react';
import createAutoGroups from "../createAutomaticallyGroups";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import seatOfType from "../type/seat";
import groupType from "../type/group";
type typeOfSuggestNewGroupsParams = {
    suggestedGroups : Array<Array<string>>,
    seats : Array<seatOfType>,
    changeSeatsFunctions:Function,
    addGroupsFunction:Function,
    groups : Array<groupType>,
    open : boolean,
    setOpen : Function
};
const SuggestNewGroups = ({suggestedGroups, seats, changeSeatsFunctions, addGroupsFunction, groups, open, setOpen }:typeOfSuggestNewGroupsParams)=>{

    const action = (
        <React.Fragment>
          <Button color="secondary" size="small" onClick={e =>{createAutoGroups(suggestedGroups, seats, changeSeatsFunctions, addGroupsFunction, groups)}}>
            LÉTREHOZÁS
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={()=>{setOpen(false)}}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );
    
      return (
        <div>
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={()=>{setOpen(false)}}
            message={`${suggestedGroups.length} csoport létrehozása ajánlott`}
            action={action}
          />
        </div>
      );
}

export default SuggestNewGroups;