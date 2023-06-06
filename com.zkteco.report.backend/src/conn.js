
import { Sequelize } from 'sequelize';

let sequelize;

async function  connector(cb){

    const connect = new Sequelize(`postgres://${process.env.PGUSER}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`);
    
    sequelize = await connect

    cb();
}

export{
    sequelize,
    connector
};