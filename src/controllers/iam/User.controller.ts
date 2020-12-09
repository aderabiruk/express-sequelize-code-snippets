import _ from 'lodash';
import { Op } from 'sequelize';
import evalidate from 'evalidate';
import { Request, Response } from 'express';

import Messages from '../../errors/Messages';
import { User } from "../../helpers/database/Sequelize";
import UserService from '../../services/iam/User.service';
import { ImagePathResolver } from '../../helpers/upload/PathResolver';
import { IPaginationResponse } from '../../helpers/adapters/Pagination';
import { Error, BadRequestError, NotFoundError } from '../../errors/Errors';


class UserController {
    
    /**
     * Create User
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static create(request: Request, response: Response, next: Function) {
        const Schema = new evalidate.schema({
            name: evalidate.string().required(Messages.USER_NAME_REQUIRED),
            user_type_id: evalidate.string().required(Messages.USER_TYPE_REQUIRED),
            username: evalidate.string().required(Messages.USER_USERNAME_REQUIRED),
            password: evalidate.string().required(Messages.USER_PASSWORD_REQUIRED)
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
            let profile_picture: string = null;
            if (request.file) {
                profile_picture = ImagePathResolver(request.file);
            }
            let user_code = (<User> request.user).id;
            UserService.create(request.body.user_type_id, request.body.name, request.body.username, request.body.password, request.body.email, profile_picture, user_code)
                .then((result: User) => {
                    response.status(200).json(result);
                })
                .catch((error: Error) => {
                    next(error);
                });
        }
        else {
            let error = new BadRequestError(result.errors);
            next(error);
        }
    }

    /**
     * Activate User
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static activateAccount(request: Request, response: Response, next: Function) {
        UserService.activate(request.params.id)
            .then((result: User) => {
                response.status(200).json(result);
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Lock User
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static lockAccount(request: Request, response: Response, next: Function) {
        UserService.lock(request.params.id)
            .then((result: User) => {
                response.status(200).json(result);
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Unlock User
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static unlockAccount(request: Request, response: Response, next: Function) {
        UserService.unlock(request.params.id)
            .then((result: User) => {
                response.status(200).json(result);
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Deactivate User
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static deactivateAccount(request: Request, response: Response, next: Function) {
        UserService.deactivate(request.params.id)
            .then((result: User) => {
                response.status(200).json(result);
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Assign Role
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static assignRole(request: Request, response: Response, next: Function) {
        const Schema = new evalidate.schema({
            role_id: evalidate.string().required(Messages.POLICY_ROLE_REQUIRED),
            user_code: evalidate.string().required(Messages.POLICY_USER_REQUIRED),
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
            let user_code = (<User> request.user).id;
            UserService.assignRole(request.body.user_code, request.body.role_id, user_code)
                .then((result: User) => {
                    response.status(200).json(result);
                })
                .catch((error: Error) => {
                    next(error);
                });
        }
        else {
            let error = new BadRequestError(result.errors);
            next(error);
        }
    }

    /**
     * Remove Role
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static removeRole(request: Request, response: Response, next: Function) {
        const Schema = new evalidate.schema({
            user_code: evalidate.string().required(Messages.POLICY_USER_REQUIRED),
            role_id: evalidate.string().required(Messages.POLICY_ROLE_REQUIRED),
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
            UserService.removeRole(request.body.user_code, request.body.role_id)
                .then((result: boolean) => {
                    response.status(200).json({ status: result });
                })
                .catch((error: Error) => {
                    next(error);
                });
        }
        else {
            let error = new BadRequestError(result.errors);
            next(error);
        }
    }

    /**
     * Change Password
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static changePassword(request: Request, response: Response, next: Function) {
        const Schema = new evalidate.schema({
            new_password: evalidate.string().required(Messages.NEW_PASSWORD_REQUIRED),
            current_password: evalidate.string().required(Messages.CURRENT_PASSWORD_REQUIRED),
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
            let user = (<User> request.user);
            UserService.changePassword(_.toString(user.id), request.body.current_password, request.body.new_password)
                .then((result: User) => {
                    response.status(200).json(result);
                })
                .catch((error: Error) => {
                    next(error);
                });
        }
        else {
            let error = new BadRequestError(result.errors);
            next(error);
        }
    }

    /**
     * Change Profile Pciture
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static changeProfilePicture(request: Request, response: Response, next: Function) {
        let user = (<User> request.user);
        let image: string = ImagePathResolver(request.file);
        UserService.update(_.toString(user.id), { profile_picture: image })
            .then((result: User) => {
                response.status(200).json(result);
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Search Users
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static search(request: Request, response: Response, next: Function) {
        let queries: any[] = [];
        if (request.body.payload?.query) {
            queries = [ ...queries, { [Op.or]: [
                { name: { [Op.like]: `%${request.body.payload?.query}%` } },
                { username: { [Op.like]: `%${request.body.payload?.query}%` } },
            ] } ];
        }
        let query = { [Op.and]: [ queries ] };
        UserService.findMany(query)
            .then((result: User[]) => response.json(result))
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Search Users (Paginate)
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static searchPaginate(request: Request, response: Response, next: Function) {
        let queries: any[] = [];
        if (request.body.payload?.query) {
            queries = [ ...queries, { [Op.or]: [
                { name: { [Op.like]: `%${request.body.payload?.query}%` } },
                { username: { [Op.like]: `%${request.body.payload?.query}%` } },
            ] } ];
        }
        let query = { [Op.and]: [ queries ] };
        
        let page = request.body.metadata?.page ? request.body.metadata?.page : 1;
        let limit = request.body.metadata?.limit ? request.body.metadata?.limit : 25;

        UserService.findManyPaginate(query, page, limit)
            .then((result: IPaginationResponse) => response.json(result))
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Find User By Id
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findById(request: Request, response: Response, next: Function) {
        UserService.findById(request.params.id)
            .then((result: User) => {
                if (result) {
                    response.json(result)
                }
                else {
                    let error: Error = new NotFoundError(Messages.USER_NOT_FOUND);
                    next(error);
                }
            })
            .catch((error: Error) => {
                next(error);
            });
    }

    /**
     * Update User
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response, next: Function) {
        UserService.update(request.params.id, request.body)
            .then((result: User) => response.json(result))
            .catch((error: Error) => {
                next(error);
            });
    }

};

export default UserController;