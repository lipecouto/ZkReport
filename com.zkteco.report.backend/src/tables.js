export class Table{
    constructor(tableName, sequelize){
        this._tableName = tableName
        this._tableFields = []
        this._sequelize = sequelize
    }

    //pegando os dados dos campos da tabela.
   async getTablefields(){
        
        const data = async () => {
            const [results, metadata] = await this._sequelize.query('SELECT table_schema, table_name, column_name, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = \''+this._tableName+'\'')
            
            return results
        }

        return  data()  
    }    
}