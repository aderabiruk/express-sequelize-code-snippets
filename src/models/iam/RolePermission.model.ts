import { Sequelize, Model, DataTypes } from 'sequelize';

export class RolePermission extends Model {
    public id: number;
    public role_id: number;
    public permission_id: number;

    public created_by: number;
    public updated_by: number;

    public readonly createdAt: Date;
    public readonly updatedAt: Date;
}

export default (sequelize: Sequelize) => {
    RolePermission.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        permission_id: {
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
        modelName: "role_permission",
        tableName: "role_permissions"
    });
};