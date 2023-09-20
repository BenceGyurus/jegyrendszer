import "../../css/loader.css";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
const Loader = ()=>{
    return (<Box sx={{ display: 'flex', alignItems : "center", justifyContent : "center", height : "70vh" }}>
      <CircularProgress />
    </Box>
)
}

export default Loader;