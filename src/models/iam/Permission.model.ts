import { Sequelize, Model, DataTypes } from 'sequelize';

export class Permission extends Model {
    public id: number;
    
    public name: string;
    public code: string;
    public type: string;
    public resource: string;

    public created_by: number;
    public updated_by: number;

    public readonly createdAt: Date;
    public readonly updatedAt: Date;
}

export default (sequelize: Sequelize) => {
    Permission.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        resource: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        paranoid: true,
        modelName: "permission",
        tableName: "permissions"
    });
};