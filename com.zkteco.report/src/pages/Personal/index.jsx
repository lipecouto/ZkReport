import { React, useState, useEffect } from 'react';
import useRequest from '../../hooks/request';
import {
    Grid,
    Container,
    Fade,
    Box,
    Typography,
    Modal,
    FormControl,
    FormControlLabel,
    FormLabel,
    Checkbox ,
    Button,
    Paper,
    Stack,
    styled 
} from '@mui/material'
import Steps from '../../components/Steps';

const steps = ['Select table', 'Select fields', 'Create Report'];

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default function RelatorioBuilder(){

    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
  
    const isStepOptional = (step) => {
      return step === 1;
    };
  
    const isStepSkipped = (step) => {
      return skipped.has(step);
    };
  
    const handleNext = () => {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
  
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const handleSkip = () => {
      if (!isStepOptional(activeStep)) {
        // You probably want to guard against something like this,
        // it should never occur unless someone's actively trying to break something.
        throw new Error("You can't skip a step that isn't optional.");
      }
  
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped((prevSkipped) => {
        const newSkipped = new Set(prevSkipped.values());
        newSkipped.add(activeStep);
        return newSkipped;
      });
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };


    const [value, setValue] = useState('female');
    const [openModal, setOpenModal] = useState(true);

    const handleClose = () => setOpenModal(false)
    const [autoPass, setAutoPass] = useState({
        table_name: false,
      })
      
    const style = {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        overflowY: 'scroll',
        height: '400px',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      };
    
    
    const handleCheckBox = (el) => {
        
        setValue(el.target.value);
          
    }

 
    return (
        <Grid container spacing={0} sx={{ minHeight: '100vh' }}> 
       
            <Grid
                container
                direction="row"
                justifyContent="space-around"
                sx={{
                    minHeight: '100vh',
                    
                }}
            >
                 <Grid container 
                    direction="row" 
                    justifyContent="space-around"
                    margin={1}     
                >

                   <Grid item lg={12} xs={12}>
                        <Grid item xs={12} lg={12} 
                                                    sx={{
                                                        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px'
                                                    }}
                            >
                            
                            <Item>
                                <Grid container direction="column" margin={0}>
                                    <Grid container spacing={0} sx={{paddingBottom: '20px'}} >
                                        <Steps params={{method: 'GET', request: 1, execEffect:true}} /> 
                                    </Grid>
                                </Grid>
                            </Item>
                        </Grid>
                             
                        
                    </Grid>
                </Grid>                
            </Grid>
        </Grid>
    )
}
