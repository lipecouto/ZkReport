import axios from "axios";
import useRequest from "../../hooks/request";
import {
    Grid,
    Box,
    Typography,
    Popover,
    TextField,
    ListItemButton,
    FormControlLabel,
    List,
    Collapse,
    Checkbox ,
    ListSubheader,
    Button,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    Backdrop 
} from '@mui/material'
import { useState, useEffect } from "react";
import { createTheme, keyframes, ThemeProvider } from '@mui/material/styles';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Label, SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { AdapterDayjs, Dayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import HelpIcon from '@mui/icons-material/Help';
import { read, utils, writeFile } from "xlsx";
import PdfTest from "../Pdf/pdfViewer";
import dayjs from "dayjs";
import 'dayjs/locale/en-gb';


const today = dayjs();

const useTheme = createTheme({
    typography: {
     "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
     "fontSize": 11,
    }
 });

const table_translate = {'acc_transaction' : 'Registros de Pessoas',
                        'att_person' : 'Cadastro de pessoas',
                        'vis_visitor' : 'Lista de visitantes',
                        'vis_transaction' : 'Registro de Visitas',
                        'park_car_number': 'Cadastro de Veículos',
                        'park_transaction' : 'Registro de Veículos'
                        }
        
    

export default function Steps( props ){
    const { makeRequest } = useRequest();
    const [ tablesList, setTablesList ] = useState([])
    const [ tableColumn, setTableColumn ] = useState([])
    // Flag para controlar se o useEffect deve ser acionado
    const [ executeEffect, setExecuteEffect ] = useState(false);
    const [ openItems, setOpenItems ] = useState([]);
    const [ dateIni, setDateIni] = useState();
    const [ dateFin, setDateFin] = useState();
    const [ passConfirmation, setPassConfirmation ] = useState(false);
    const [ tableName, setTableName ] = useState();    
    const [ selectedColumn, setSelectedColumn ] = useState({ table_fields: [] });
    const [ reportResponse, setReportResponse ] = useState(null);
    const [ anchorEl, setAnchorEl] = useState(null);
    const [ lines, setLines ] = useState(30);
 
    const [ pdf, setpdf ] = useState();


    //Controle do backdrop e PopOver
    const [open, setOpen] = useState(false);

    const handleMouseHelpClick = (event) => {
        
        setAnchorEl(event.currentTarget);
         
    };
    
    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleOpen = () => {
      setOpen(true);
    };

    const PopOverOpen = Boolean(anchorEl);
    const popid = open ? 'popover' : undefined;
    //Fim do controle do backdrop e PopOver
   
    const [ modelBuilder, setModeBuilder ] = useState([{
                                                            "table_name": "",
                                                            "table_fields": [ 
                                                                            {
                                                                                "field": "", 
                                                                                "data_type": ""
                                                                            }                               
                                                                            ],
                                                            "filters": {
                                                                "fields": [
                                                                            {
                                                                            "name": "create_time",
                                                                            "type": "datetime",
                                                                            "period": {
                                                                                    "start_time": "2023-04-10T12:16:53.608Z",
                                                                                    "end_time": "2023-04-20T12:16:53.608Z"
                                                                                    },
                                                                            "notnull": false,
                                                                            "null": false
                                                                            }
                                                                        ],
                                                                "limit": 0
                                                            }
                                                        }
                                                    ]);
    const { method, request, execEffect } = props.params;
    
    useEffect(() => {

        setExecuteEffect(execEffect);

        const callRequest = async (req_param) => {
            handleOpen()
            const response = await makeRequest(req_param);
            if(request === 1){

                const valoresEncontrados = response.data.filter(chave => table_translate.hasOwnProperty(chave)).map(chave => {
                    const valorTraduzido = table_translate[chave];
                    return valorTraduzido;
                });
                  
                const data_translate = valoresEncontrados.map(chave => table_translate.hasOwnProperty(chave) ? table_translate[chave] : chave);
                
                setTablesList(data_translate)
               
            }
            if(request === 2){
                setTableColumn(response.data);
                  
            }
            if( request === 3){
                setReportResponse(response)
                setpdf(<PdfTest data={response} /> )
            }
            handleClose()
        };
    
        // Lógica condicional para determinar o URL com base no valor de 'request'
        if (executeEffect || execEffect) {
            
            setExecuteEffect(false)
            let url = '';
            let data = '';
            let meth = '';
            if (request === 1) {
              
                url = { url: 'http://localhost:8000/tables'};
                meth = method;
            }else if(request === 2){
                
                props.params.method = 'post';
                url = { url: 'http://localhost:8000/fields'};
                data = tableName;
                meth = 'POST';
            }else if (request === 3){
               
                props.params.method = 'post';
                url = { url: 'http://localhost:8000/report'};
                data = modelBuilder;
                meth = 'POST';
                props.params.request = 0; 
            }else{
                handleClose();
                return;
            }
            
            
            if (url) {    
                const req_param = {
                    url: url,
                    request: request,
                    method: meth,
                    data: { data }

                };
           
                callRequest(req_param);
            }
        }
        
      }, [request, execEffect]);
    

    const handleClick = (el) => {
        
        if(openItems.length === 0){
            const table_name = Object.entries(table_translate).find(([chave, valorTraduzido]) => valorTraduzido === el);
             
            setTableName({...tableName, 'table_name': table_name[0] })
            props.params.request = 2;
            setOpenItems((prevOpenItems) => [...prevOpenItems, el]);
        }else {
            props.params.request = 0;
            // Remove o item atual do estado de expansão
            setOpenItems((prevOpenItems) =>
                prevOpenItems.filter((item) => item !== el)
            );
          }
    };

    const handleCheckBox = (el) => {
        
        const fieldValue = el.target.id; // Obtém o valor do campo do Checkbox
        const dataTypeValue = el.target.dataset.datatype; // Obtém o valor do atributo personalizado 'data-datatype'
        
        setSelectedColumn((prevState) => {
            // Verifica se o Checkbox está marcado ou desmarcado           
            if (el.target.checked) {
               
                // Checkbox marcado: adiciona o novo objeto à matriz table_fields
                const newTableFields = [
                    ...prevState.table_fields, // Copia os objetos existentes
                    { field: fieldValue, data_type: dataTypeValue.split(' ')[0] } // Adiciona o novo objeto
                ];

                return { ...prevState, table_fields: newTableFields };
            } else {
            // Checkbox desmarcado: remove o objeto correspondente da matriz table_fields
                const newTableFields = prevState.table_fields.filter(
                    (item) => item.field !== fieldValue
                );

                return { ...prevState, table_fields: newTableFields };
            }
        });
        props.params.request = 0;
    };
    
    const handlePassConf = (el) => {
        setPassConfirmation(!passConfirmation);
    }

    const handleReport = () => {
         
        const IniDate = `${dateIni.$y}-${dateIni.$M.toString().length === 1 ? '0'+dateIni.$M : dateIni.$M.length}-${dateIni.$D.toString().length === 1 ? '0'+dateIni.$D : dateIni.$D}T00:00:00.608Z`;
        const FinDate = `${dateFin.$y}-${dateFin.$M.toString().length === 1 ? '0'+dateFin.$M : dateFin.$M.length}-${dateFin.$D.toString().length === 1 ? '0'+dateFin.$D : dateFin.$D}T00:00:00.608Z`;
       
        const filters = {"fields": [
                                        {
                                        "name": "create_time",
                                        "type": "datetime",
                                        "period": {
                                                "start_time": IniDate,
                                                "end_time": FinDate
                                                },
                                        "notnull": false,
                                        "null": false
                                        }
                                    ],
                         "limit": 20
                        }

        setModeBuilder([{
            table_name: tableName.table_name,
            table_fields: selectedColumn.table_fields,
            filters
            
        }]);

        props.params.request = 3;
    }   

    const handleLines = (el) =>{
        setLines(el.target.value);
    }

    const handleReportXLS = () => {
        const workbook = utils.book_new();

        // Cria uma nova planilha com os dados
        const worksheet = utils.json_to_sheet(reportResponse);

        // Adiciona a planilha ao workbook
        utils.book_append_sheet(workbook, worksheet, 'Relatório');

        // Salva o workbook como arquivo XLS
        writeFile(workbook, 'relatorio.xls');
    }

    return (
        <ThemeProvider theme={useTheme}>
            <Grid container display={'flex'} flexDirection={'column'}>
                <Grid container spacing={1} textAlign={'left'} alignContent={'space-between'}>

                    <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                        component="nav"
                        aria-labelledby="nested-list-tables"
                        subheader={
                            <ListSubheader component="div" id="nested-list-tables">
                                Tabelas
                            </ListSubheader>
                        }
                    >
                        {tablesList.map((el, index) => {
                                const isItemOpen = openItems.includes(el);
                                return (<>
                                        <ListItemButton onClick={() => handleClick(el)} id={el} key={el}>                            
                                            <ListItemText primary={el}
                                            />
                                            {isItemOpen ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={isItemOpen} timeout="auto" unmountOnExit>
                                            <List component="div" id="itens" disablePadding sx={{width: '100%', height: '60vh', display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'stretch'}}>
                                                {
                                                    tableColumn.map((el, index) => {
                                                        
                                                        return (<ListItemButton sx={{ pl: 4, height: '16px'}}  key={index}>                                     
                                                                    <ListItemText primary={<FormControlLabel key={el+index}                                    
                                                                                                            labelPlacement="end"
                                                                                                            control={<Checkbox size="small" id={el.column}  inputProps={{ 'data-datatype': `${el.data_type}` }} onChange={handleCheckBox}/>}
                                                                                                            label={el.column}
                                                                                                            sx={{ fontSize: '0.825rem' }} />} />
                                                                </ListItemButton>
                                                                )                                                
                                                    })                                         
                                                }
                                            </List>
                                        </Collapse>
                                        </>
                                        )
                            
                        })}                        
                    </List>
                    <Grid item lg={8} sx={{marginLeft: '50px' }} >
                        <Grid item lg={12} display={'flex'} flexDirection={'row'} marginBottom={'10px'}>
                            <Typography>
                                Report Filters 
                            </Typography>
                        </Grid>
                        <Grid item lg={12} display={'flex'} flexDirection={'row'} marginBottom={'10px'}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
                                <DatePicker label="Data inicial" slotProps={{ textField: { size: 'small' } }} onChange={value => setDateIni(value)}  />                                             
                            </LocalizationProvider>
                            <Box padding={1}><Typography>até</Typography></Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
                                <DatePicker label="Date final" maxDateTime={today}  slotProps={{ textField: { size: 'small' } }} onChange={value => setDateFin(value)}/>
                            </LocalizationProvider>
                            <Grid paddingLeft={'15px'}>
                               
                            
                                <TextField  size="small" id={'lines'}  variant="outlined" onChange={handleLines} label={'Quantidade de linhas'}/>                
                                <HelpIcon 
                                    onClick={handleMouseHelpClick}
                                    aria-describedby={popid}
                                />
                                <FormControlLabel key={'passConfirmation'}                                    
                                    labelPlacement="end"
                                    control={<Checkbox size="small" id={'passConfirmation'} onChange={handlePassConf} label="Confirmação de passagem?"/>}
                                    label={'Confirmação de passagem?'}
                                    sx={{ fontSize: '0.825rem', marginLeft: '10px'}} />
                                <Popover
                                    id={popid}
                                    open={PopOverOpen}
                                    anchorEl={anchorEl}
                                    onClose={handleClosePopover}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    >
                                    <Typography sx={{ p: 2 }}>Por padrão o valor será de 30 linhas, caso o campo esteja em branco</Typography>
                                </Popover>
                            </Grid>
                            
                            
                        </Grid>
                        
                        <Grid paddingTop={'15px'} marginBottom={'10px'}>
                            <Button size="small" variant="contained" sx={{ height: '40px' }} onClick={handleReport} disabled={(dateFin ? false : true)}>
                                    <Typography sx={{ fontSize: '0.695rem' }} >Gerar relatório</Typography>
                            </Button>

                            <Button size="small" variant="contained" sx={{ height: '40px' }} onClick={handleReportXLS} disabled={(dateFin ? false : true)}>
                                    <Typography sx={{ fontSize: '0.695rem' }} >Gerar relatório em XLS</Typography>
                            </Button>
                        </Grid>

                        { pdf && pdf}

                    </Grid>                      
                </Grid>               
            </Grid>                
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </ThemeProvider>
      );
}