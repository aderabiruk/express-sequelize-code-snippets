import { Sequelize, Model, DataTypes } from 'sequelize';
import { Permission } from '../../helpers/database/Sequelize';

export class Role extends Model {
    public id: number;

    public name: string;
    public description: string;

    public created_by: number;
    public updated_by: number;

    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    public permissions: Permission[];
}

export default (sequelize: Sequelize) => {
    Role.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: true
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
        modelName: "role",
        tableName: "roles"
    });
};