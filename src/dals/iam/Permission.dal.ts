import { Transaction } from "sequelize/types";
import { DAL } from "../../helpers/abstracts/DAL";
import { Permission } from "../../helpers/database/Sequelize";

class PermissionDAL implements DAL {

    /**
     * Create Permission
     * 
     * @param {string}      name 
     * @param {string}      type 
     * @param {string}      resource 
     * @param {string}      code 
     * @param {number}      created_by 
     * @param {Transaction} transaction 
     */
    static create(name: string, type: string, resource: string, code: string, created_by: number, transaction?: Transaction): Promise<Permission> {
        return new Promise((resolve, reject) => {
            Permission.create({ 
                code: code,
                name: name, 
                type: type,
                resource: resource,
                created_by: created_by, 
                updated_by: created_by,
            }, { transaction: transaction })
                .then((result: Permission) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Permissions
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static findMany(query: any, order: any, includes: any[]): Promise<Permission[]> {
        return new Promise((resolve, reject) => {
            Permission.findAll({ where: query, order: order, include: includes})
                .then((result: Permission[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Permissions (Pagination)
     * 
     * @param query 
     * @param order 
     * @param includes 
     * @param page 
     * @param limit 
     */
    static findManyPaginate(query: any, order: any, includes: any[], page: number = 1, limit: number = 25): Promise<Permission[]> {
        return new Promise((resolve, reject) => {
            Permission.findAll({ where: query, limit: limit, offset: (page - 1) * limit, order: order, include: includes })
                .then((result: Permission[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Permission
     * 
     * @param query 
     * @param includes 
     */
    static findOne(query: any, order: any, includes: any): Promise<Permission> {
        return new Promise((resolve, reject) => {
            Permission.findOne({ where: query, order: order, include: includes })
                .then((result: Permission) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Count Permissions
     * 
     * @param {any} query 
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            Permission.count({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Update Permission
     * 
     * @param {Permission}      record
     * @param {any}             payload 
     * @param {Transaction}     transaction 
     */
    static update(record: Permission, payload: any, transaction?: Transaction): Promise<Permission> {
        return new Promise(async (resolve, reject) => {
            if (record) {
                record.name = payload.name != null ? payload.name : record.name;
                record.code = payload.code != null ? payload.code : record.code;
                record.type = payload.type != null ? payload.type : record.type;
                record.resource = payload.resource != null ? payload.resource : record.resource;

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
     * Delete Permissions
     * 
     * @param {any} query 
     */
    static delete(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            Permission.destroy({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }
}

export default PermissionDAL;