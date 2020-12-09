import config from 'config';
import { Sequelize } from 'sequelize';
import logger from '../logger/Winston';

/**
 * IAM Modules
 */
import UserFactory, { User } from '../../models/iam/User.model';
import RoleFactory, { Role } from '../../models/iam/Role.model';
import PolicyFactory, { Policy } from '../../models/iam/Policy.model';
import UserTypeFactory, { UserType } from '../../models/iam/UserType.model';
import PermissionFactory, { Permission } from '../../models/iam/Permission.model';
import RolePermissionFactory, { RolePermission } from '../../models/iam/RolePermission.model';


let sequelize: Sequelize;

/**
 * IAM Module Initialization
 * 
 * @param {Sequelize}   sequelize 
 * @param {string}      onDelete 
 */
const IAMModuleInitalization = (sequelize: Sequelize, onDelete: string) => {
    UserFactory(sequelize);
    RoleFactory(sequelize);
    PolicyFactory(sequelize);
    UserTypeFactory(sequelize);
    PermissionFactory(sequelize);
    RolePermissionFactory(sequelize);
};


/**
 * IAM Module Relationship Initialization
 * 
 * @param {Sequelize}   sequelize 
 * @param {string}      onDelete  
 */
const IAMModuleRelationshipInitialization = (sequelize: Sequelize, onDelete: string) => {
    // Policy
    User.belongsToMany(Role, { through: Policy, foreignKey: "user_id" });
    Role.belongsToMany(User, { through: Policy, foreignKey: "role_id" });

    Policy.belongsTo(Role);
    Policy.belongsTo(User);

    Role.hasMany(Policy);
    User.hasMany(Policy);

    // Role Permission
    Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "role_id" });
    Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permission_id" });

    RolePermission.belongsTo(Role,{ foreignKey: "role_id", onDelete: onDelete });
    RolePermission.belongsTo(Permission,{ foreignKey: "permission_id", onDelete: onDelete });

    Role.hasMany(RolePermission,{ foreignKey: "role_id", onDelete: onDelete });
    Permission.hasMany(RolePermission,{ foreignKey: "permission_id", onDelete: onDelete });

    // User
    UserType.hasMany(User, { foreignKey: "user_type_id", onDelete: onDelete });
    User.belongsTo(UserType, { foreignKey: "user_type_id", onDelete: onDelete });

};



export default async () => {
    let dbHost: string = config.get('database.host');
    let dbName: string = config.get('database.name');
    let dbUser: string = config.get('database.user');
    let dbLogging: boolean = config.get("database.logging");
    let dbPassword: string = config.get('database.password');
    let dbPort: number = parseInt(config.get('database.port'));

    const ON_DELETE = process.env.NODE_ENV === "test" ? "CASCADE" : "RESTRICT";

    sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        port: dbPort,
        dialect: 'mysql',
        logging: dbLogging
    });

    IAMModuleInitalization(sequelize, ON_DELETE);
    IAMModuleRelationshipInitialization(sequelize, ON_DELETE);

    sequelize.sync({ force: false })
        .then(() => {
            logger.info('Database connection has been established successfully.');
        })
        .catch((error: any) => {
            logger.error(`Database connection error: ${error}`);
        })
};

export {
    sequelize,

    /**
     * IAM Module
     */
    User,
    Role,
    Policy,
    UserType,
    Permission,
    RolePermission,

};