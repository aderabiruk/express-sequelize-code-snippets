import { Transaction } from "sequelize/types";
import { DAL } from "../../helpers/abstracts/DAL";
import { User } from "../../helpers/database/Sequelize";

class UserDAL implements DAL {

    /**
     * Create User
     * 
     * @param {number}      user_type_id 
     * @param {string}      name
     * @param {string}      username 
     * @param {string}      password 
     * @param {string}      profile_picture 
     * @param {number}      created_by 
     * @param {Transaction} transaction 
     */
    static create(user_type_id: number, name: string, username: string, password: string, email: string, profile_picture: string, created_by: number, transaction?: Transaction): Promise<User> {
        return new Promise((resolve, reject) => {
            User.create({ 
                name: name,
                email: email,
                username: username,
                password: password,
                created_by: created_by, 
                updated_by: created_by,
                user_type_id: user_type_id, 
                profile_picture: profile_picture,
            }, { transaction: transaction })
                .then((result: User) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Users
     * 
     * @param query 
     * @param order 
     * @param includes 
     */
    static findMany(query: any, order: any, includes: any[]): Promise<User[]> {
        return new Promise((resolve, reject) => {
            User.findAll({ where: query, order: order, include: includes})
                .then((result: User[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find Many Users (Pagination)
     * 
     * @param query 
     * @param order 
     * @param includes 
     * @param page 
     * @param limit 
     */
    static findManyPaginate(query: any, order: any, includes: any[], page: number = 1, limit: number = 25): Promise<User[]> {
        return new Promise((resolve, reject) => {
            User.findAll({ where: query, limit: limit, offset: (page - 1) * limit, order: order, include: includes })
                .then((result: User[]) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Find User
     * 
     * @param query 
     * @param includes 
     */
    static findOne(query: any, order: any, includes: any): Promise<User> {
        return new Promise((resolve, reject) => {
            User.findOne({ where: query, include: includes })
                .then((result: User) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Count Users
     * 
     * @param {any} query 
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            User.count({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }

    /**
     * Update User
     * 
     * @param {User}            record
     * @param {any}             payload 
     * @param {Transaction}     transaction 
     */
    static update(record: User, payload: any, transaction?: Transaction): Promise<User> {
        return new Promise(async (resolve, reject) => {
            if (record) {
                record.code = payload.code != null ? payload.code : record.code;
                record.email = payload.email != null ? payload.email : record.email;
                record.password = payload.password != null ? payload.password : record.password;
                record.username = payload.username != null ? payload.username : record.username;
                record.user_type_id = payload.user_type_id != null ? payload.user_type_id : record.user_type_id;
                record.profile_picture = payload.profile_picture != null ? payload.profile_picture : record.profile_picture;
                
                record.company_id = payload.company_id != null ? payload.company_id : record.company_id;
                record.company_type = payload.company_type != null ? payload.company_type : record.company_type;

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
     * Delete Users
     * 
     * @param {any} query 
     */
    static delete(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            User.destroy({ where: query })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(error));
        });
    }
    
}

export default UserDAL;