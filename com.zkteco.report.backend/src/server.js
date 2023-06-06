
import express, { request } from "express"
import { connector, sequelize } from './conn.js'
import { Table } from './tables.js'
import ModelBuilder from './modelBuilder.js';
import { format, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import  cors  from 'cors';

import 'dotenv/config';
//Envairoment config
const PORT = process.env.APPPORT || 8000;

const app = express();
app.use(express.json());

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.get('/hello', (req, res) => {
    res.send('hello!');
});

app.get('/tables', (req, res) =>{

    const getAllTables = async () => {
        
        const data = await sequelize.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_type = \'BASE TABLE\'');
     
        const result = data.map((el) => {
            return el.map((el) =>{
                return el
            }).join(',')
        });

        const response = {'result': 'OK', 'err_code': 0, 'data': result}
        res.send(response)
    };
    
    getAllTables();
});

app.post('/fields', async (req, res) => {

    console.log(req.body.data.table_name);
    const _tabela = new Table(req.body.data.table_name, sequelize)
    
    const data = await _tabela.getTablefields()
    
    const result = data.map((el) =>{
        return {
                table: req.body.data.table_name, 
                column: el.column_name, 
                data_type: el.data_type
            }
    }) ;

    const response = {'result': 'OK', 'err_code': 0, 'data': result}
    res.send(response)
});


app.post('/report', async (req, res) => {
    try {
      const request_data = req.body;
  
      const models = [];
  
      for (const table of request_data.data) {
        const fields = table.table_fields.map((field) => {
          return {
            field: field.field,
            data_type: field.data_type,
          };
        });
  
        const model = new ModelBuilder(table.table_name, table.table_name, fields, sequelize).buildModel();
  
        const where = {};
  
        table.filters.fields.map((el) => {
          if (el.type === 'datetime') {
            where[el.name] = {
              [Op.between]: [el.period.start_time, el.period.end_time],
            };
          }
        });
  
        const resp = await model.findAll({
          where,
          limit: table.filters.limit,
        });
  
        // Formatação das datas usando a biblioteca date-fns
        const formattedData = resp.map((item) => {
            if (item.dataValues.hasOwnProperty('create_time')) {
               
                const formattedDate = format(item.create_time, 'dd/MM/yyyy');
                const formattedTimer = format(item.create_time, 'HH:mm:ss');
                return {
                  ...item.dataValues,
                  create_time: formattedDate,
                  create_timer: formattedTimer
                };
              } else {
                return item.dataValues;
              }
            });

        models.push(formattedData);
      }
  
      res.send(models);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao processar o relatório');
    }
});


connector(() => {
    console.log('Successfully connected to database!');
    app.listen(8000, () => {
        console.log('Server is listening on port 8000');
    });
})