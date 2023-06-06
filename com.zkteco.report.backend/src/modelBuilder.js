
import { Sequelize, DataTypes } from 'sequelize';

class ModelBuilder {
    constructor(modelName, tableName, fields, sequelize) {
      this._modelName = modelName;
      this._tableName = tableName;
      this._fields = fields;
      this._sequelize = sequelize;
    }
  
    buildModel() {
        const fields = {}
     
        for (let fieldName in this._fields) {
           
            const field = this._fields[fieldName]
            
            const fieldType = this.getDataType(field.data_type);
            
            let primary = false
            if (field.field === 'id'){
                fields[field.field] = {
                  
                    type: fieldType,
                    primaryKey: true,
                    allowNull: field.allowNull || true,
                };
            }else{ 
                if (fieldType) {
                    fields[field.field] = {
                            type: fieldType,
                            allowNull: field.allowNull || true,
                    };
                } else {
                    throw new Error(`Invalid data type for field ${field.table}`);
                }
            }
        }
        
        const model = this._sequelize.define(this._modelName, fields, {
            tableName: this.tableName,
            freezeTableName: true,
            timestamps: false // impede que o Sequelize pluralize o nome da tabela
          });
        
        return model;
    }
  
    getDataType(typeName) {
        const DataTypes = Sequelize.DataTypes;
        const typeMap = {
          string: DataTypes.STRING,
          character: DataTypes.STRING,
          integer: DataTypes.INTEGER,
          float: DataTypes.FLOAT,
          boolean: DataTypes.BOOLEAN,
          timestamp: DataTypes.DATE,
          date: DataTypes.DATE,
          text: DataTypes.TEXT,
          smallint: DataTypes.SMALLINT,
        };
        
        return typeMap[typeName];
    }
  }
  
  export default ModelBuilder;