import { Transaction } from "sequelize/types";
import { DAL } from "../../helpers/abstracts/DAL";
import { RolePermission } from "../../helpers/database/Sequelize";

class RolePermissionDAL implements DAL {

    /**
     * Create Role Permission
     * 
     * @param {number}      role_id 
     * @param {number}      permission_id 
     * @param {number}      created_by 
     * @param {Transaction} transaction 
     */
    static create(role_id: number, permission_id: number, created_by: number, transaction?: Transaction): Promise<RolePermission> {
        return new Promise((resolve, reject) => {
            RolePermission.create({ 
                role_id: role_id, 
                created_by: created_by, 
                updated_by: created_by,
                permission_id: permission_id,
            }, { transaction: transaction })
                .then((result: RolePermission) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Role Permissions
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static findMany(query: any, order: any, includes: any[]): Promise<RolePermission[]> {
        return new Promise((resolve, reject) => {
            RolePermission.findAll({ where: query, order: order, include: includes})
                .then((result: RolePermission[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Role Permissions (Pagination)
     * 
     * @param query 
     * @param order 
     * @param includes 
     * @param page 
     * @param limit 
     */
    static findManyPaginate(query: any, order: any, includes: any[], page: number = 1, limit: number = 25): Promise<RolePermission[]> {
        return new Promise((resolve, reject) => {
            RolePermission.findAll({ where: query, limit: limit, offset: (page - 1) * limit, order: order, include: includes })
                .then((result: RolePermission[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find RolePermission
     * 
     * @param query 
     * @param includes 
     */
    static findOne(query: any, order: any, includes: any): Promise<RolePermission> {
        return new Promise((resolve, reject) => {
            RolePermission.findOne({ where: query, include: includes })
                .then((result: RolePermission) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Count Role Permissions
     * 
     * @param {any} query 
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            RolePermission.count({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Update RolePermission
     * 
     * @param {RolePermission}      record
     * @param {any}         payload 
     * @param {Transaction} transaction 
     */
    static update(record: RolePermission, payload: any, transaction?: Transaction): Promise<RolePermission> {
        return new Promise(async (resolve, reject) => {
            if (record) {
                record.role_id = payload.role_id != null ? payload.role_id : record.role_id;
                record.permission_id = payload.permission_id != null ? payload.permission_id : record.permission_id;

                try {
                    await record.save({ transaction: transaction });
                    resolve(record);
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                resolve(null);
            }
        });
    }

    /**
     * Delete RolePermissions
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static delete(query: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            RolePermission.destroy({ where: query })
                .then(() => resolve(true))
                .catch((error: any) => reject(error));
        });
    }
}

export default RolePermissionDAL;