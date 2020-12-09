import { Transaction } from "sequelize/types";
import { DAL } from "../../helpers/abstracts/DAL";
import { Policy } from "../../helpers/database/Sequelize";

class PolicyDAL implements DAL {

    /**
     * Create Policy
     * 
     * @param {number}      role_id 
     * @param {number}      user_id 
     * @param {number}      created_by 
     * @param {Transaction} transaction 
     */
    static create(role_id: number, user_id: number, created_by: number, transaction?: Transaction): Promise<Policy> {
        return new Promise((resolve, reject) => {
            Policy.create({ 
                role_id: role_id, 
                user_id: user_id,
                created_by: created_by, 
                updated_by: created_by,
            }, { transaction: transaction })
                .then((result: Policy) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Policies
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static findMany(query: any, order: any, includes: any[]): Promise<Policy[]> {
        return new Promise((resolve, reject) => {
            Policy.findAll({ where: query, order: order, include: includes})
                .then((result: Policy[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Policies (Pagination)
     * 
     * @param query 
     * @param order 
     * @param includes 
     * @param page 
     * @param limit 
     */
    static findManyPaginate(query: any, order: any, includes: any[], page: number = 1, limit: number = 25): Promise<Policy[]> {
        return new Promise((resolve, reject) => {
            Policy.findAll({ where: query, limit: limit, offset: (page - 1) * limit, order: order, include: includes })
                .then((result: Policy[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Policy
     * 
     * @param query 
     * @param includes 
     */
    static findOne(query: any, order: any, includes: any): Promise<Policy> {
        return new Promise((resolve, reject) => {
            Policy.findOne({ where: query, include: includes })
                .then((result: Policy) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Count Policies
     * 
     * @param {any} query 
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            Policy.count({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Update Policy
     * 
     * @param {Policy}      record
     * @param {any}         payload 
     * @param {Transaction} transaction 
     */
    static update(record: Policy, payload: any, transaction?: Transaction): Promise<Policy> {
        return new Promise(async (resolve, reject) => {
            if (record) {
                record.user_id = payload.user_id != null ? payload.user_id : record.user_id;
                record.role_id = payload.role_id != null ? payload.role_id : record.role_id;

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
     * Delete Policys
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static delete(query: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            Policy.destroy({ where: query })
                .then(() => resolve(true))
                .catch((error: any) => reject(error));
        });
    }
}

export default PolicyDAL;