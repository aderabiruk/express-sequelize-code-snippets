import { Sequelize, Model, DataTypes } from 'sequelize';

export class Policy extends Model {
    public id: number;
    public role_id: number;
    public user_id: number;

    public created_by: number;
    public updated_by: number;

    public readonly createdAt: Date;
    public readonly updatedAt: Date;
}

export default (sequelize: Sequelize) => {
    Policy.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
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
        modelName: "policy",
        tableName: "policies"
    });
};