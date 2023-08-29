import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = [
    "Jegyek kiválasztása",
    "Adatok megadása",
    "Adatok ellenőrzése",
    "Fizetés"
]

type typeOfBuyingStepperParams = {
    active : number
}

const BuyingStepper = ({active}:typeOfBuyingStepperParams)=>{

    return <Box sx={{ width: '100%' }}>
    <Stepper activeStep={active} alternativeLabel>
      {steps.map((label, index) => (
        <Step key={label} completed = {index < active}>
          <StepLabel>{label}</StepLabel>
        </Step>
        ))}
    </Stepper>
  </Box>
}

export default BuyingStepper;