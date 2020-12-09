import { Transaction } from "sequelize/types";
import { DAL } from "../../helpers/abstracts/DAL";
import { Role } from "../../helpers/database/Sequelize";

class RoleDAL implements DAL {

    /**
     * Create Role
     * 
     * @param {string}      name 
     * @param {string}      description 
     * @param {number}      created_by 
     * @param {Transaction} transaction 
     */
    static create(name: string, description: string, created_by: number, transaction?: Transaction): Promise<Role> {
        return new Promise((resolve, reject) => {
            Role.create({ 
                name: name, 
                created_by: created_by, 
                updated_by: created_by,
                description: description,
            }, { transaction: transaction })
                .then((result: Role) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Roles
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static findMany(query: any, order: any, includes: any[]): Promise<Role[]> {
        return new Promise((resolve, reject) => {
            Role.findAll({ where: query, order: order, include: includes})
                .then((result: Role[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Roles (Pagination)
     * 
     * @param query 
     * @param order 
     * @param includes 
     * @param page 
     * @param limit 
     */
    static findManyPaginate(query: any, order: any, includes: any[], page: number = 1, limit: number = 25): Promise<Role[]> {
        return new Promise((resolve, reject) => {
            Role.findAll({ where: query, limit: limit, offset: (page - 1) * limit, order: order, include: includes })
                .then((result: Role[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Role
     * 
     * @param query 
     * @param includes 
     */
    static findOne(query: any, order: any, includes: any): Promise<Role> {
        return new Promise((resolve, reject) => {
            Role.findOne({ where: query, include: includes })
                .then((result: Role) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Count Roles
     * 
     * @param {any} query 
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            Role.count({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Update Role
     * 
     * @param {Role}        record
     * @param {any}         payload 
     * @param {Transaction} transaction 
     */
    static update(record: Role, payload: any, transaction?: Transaction): Promise<Role> {
        return new Promise(async (resolve, reject) => {
            if (record) {
                record.name = payload.name != null ? payload.name : record.name;
                record.description = payload.description != null ? payload.description : record.description;

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
     * Delete Roles
     * 
     * @param {any} query 
     */
    static delete(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            Role.destroy({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }
}

export default RoleDAL;