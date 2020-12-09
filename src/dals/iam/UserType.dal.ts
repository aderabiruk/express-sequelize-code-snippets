import { Transaction } from "sequelize/types";
import { DAL } from "../../helpers/abstracts/DAL";
import { UserType } from "../../helpers/database/Sequelize";

class UserTypeDAL implements DAL {

    /**
     * Create UserType
     * 
     * @param {string}      name 
     * @param {string}      description 
     * @param {number}      created_by 
     * @param {Transaction} transaction 
     */
    static create(name: string, description: string, created_by: number, transaction?: Transaction): Promise<UserType> {
        return new Promise((resolve, reject) => {
            UserType.create({ 
                name: name, 
                created_by: created_by, 
                updated_by: created_by,
                description: description,
            }, { transaction: transaction })
                .then((result: UserType) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many User Types
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static findMany(query: any, order: any, includes: any[]): Promise<UserType[]> {
        return new Promise((resolve, reject) => {
            UserType.findAll({ where: query, order: order, include: includes})
                .then((result: UserType[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many User Types (Pagination)
     * 
     * @param query 
     * @param order 
     * @param includes 
     * @param page 
     * @param limit 
     */
    static findManyPaginate(query: any, order: any, includes: any[], page: number = 1, limit: number = 25): Promise<UserType[]> {
        return new Promise((resolve, reject) => {
            UserType.findAll({ where: query, limit: limit, offset: (page - 1) * limit, order: order, include: includes })
                .then((result: UserType[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find User Type
     * 
     * @param query 
     * @param includes 
     */
    static findOne(query: any, order: any, includes: any): Promise<UserType> {
        return new Promise((resolve, reject) => {
            UserType.findOne({ where: query, include: includes })
                .then((result: UserType) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Count User Types
     * 
     * @param {any} query 
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            UserType.count({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Update UserType
     * 
     * @param {UserType}    record
     * @param {any}         payload 
     * @param {Transaction} transaction 
     */
    static update(record: UserType, payload: any, transaction?: Transaction): Promise<UserType> {
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
     * Delete User Types
     * 
     * @param {any} query 
     */
    static delete(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            UserType.destroy({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }
}

export default UserTypeDAL;