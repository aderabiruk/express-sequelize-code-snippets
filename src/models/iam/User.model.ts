import { v4 as uuidv4 } from 'uuid';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { Role } from '../../helpers/database/Sequelize';

export class User extends Model {
    public id: number;
    public user_type_id: number;

    public company_id: number;
    public company_type: string;

    public code: string;
    public name: string;
    public email: string;
    public username: string;
    public password: string;

    public last_seen: Date;
    public is_active: boolean;
    public is_locked: boolean;
    public profile_picture: string;
    public last_password_change_date: string;

    public roles: Role[];
    
    public created_by: number;
    public updated_by: number;

    public readonly createdAt: Date;
    public readonly updatedAt: Date;
}

export default (sequelize: Sequelize) => {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        user_type_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true 
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        is_locked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        profile_picture: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        last_seen: {
            type: DataTypes.DATE,
            defaultValue: Date.now
        },
        last_password_change_date: {
            type: DataTypes.DATE,
            defaultValue: Date.now
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
        modelName: "user",
        tableName: "users",
        hooks: {
            beforeValidate: async (instance: User) => {
                if (!instance.code) {
                    instance.code = uuidv4();
                }
            }
        }
    });
};