import { Op } from 'sequelize';
import evalidate from 'evalidate';
import { Request, Response } from 'express';

import Messages from '../../errors/Messages';
import { Role, User } from "../../helpers/database/Sequelize";
import RoleService from '../../services/iam/Role.service';
import { IPaginationResponse } from '../../helpers/adapters/Pagination';
import { Error, BadRequestError, NotFoundError } from '../../errors/Errors';

class RoleController {
    
    /**
     * Create Role
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static create(request: Request, response: Response, next: Function) {
        const Schema = new evalidate.schema({
            name: evalidate.string().required(Messages.ROLE_NAME_REQUIRED)
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
            let user_code = (<User> request.user).id;
            RoleService.create(request.body.name, request.body.description, user_code)
                .then((result: Role) => {
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
     * Assign Permission
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static assignPermission(request: Request, response: Response, next: Function) {
        const Schema = new evalidate.schema({
            role_id: evalidate.string().required(Messages.ROLE_PERMISSION_ROLE_REQUIRED),
            permission_id: evalidate.string().required(Messages.ROLE_PERMISSION_PERMISSION_REQUIRED),
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
            let user_code = (<User> request.user).id;
            RoleService.assignPermission(request.body.role_id, request.body.permission_id, user_code)
                .then((result: Role) => {
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
     * Remove Permission
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static removePermission(request: Request, response: Response, next: Function) {
        const Schema = new evalidate.schema({
            role_id: evalidate.string().required(Messages.ROLE_PERMISSION_ROLE_REQUIRED),
            permission_id: evalidate.string().required(Messages.ROLE_PERMISSION_PERMISSION_REQUIRED),
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
            RoleService.removeRole(request.body.role_id, request.body.permission_id)
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
     * Search Roles
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static search(request: Request, response: Response, next: Function) {
        let queries: any[] = [];
        if (request.body.payload?.query) {
            queries = [ ...queries, { name: { [Op.like]: `%${request.body.payload?.query}%` } } ];
        }
        let query = { [Op.and]: [ queries ] };
        RoleService.findMany(query)
            .then((result: Role[]) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Search Roles
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static searchPaginate(request: Request, response: Response, next: Function) {
        let queries: any[] = [];
        if (request.body.payload?.query) {
            queries = [ ...queries, { name: { [Op.like]: `%${request.body.payload?.query}%` } } ];
        }
        let query = { [Op.and]: [ queries ] };

        let page = request.body.metadata?.page ? request.body.metadata?.page : 1;
        let limit = request.body.metadata?.limit ? request.body.metadata?.limit : 25;
        RoleService.findManyPaginate(query, page, limit)
            .then((result: IPaginationResponse) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Find Role By Id
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findById(request: Request, response: Response, next: Function) {
        RoleService.findById(request.params.id)
            .then((result: Role) => {
                if (result) {
                    response.json(result)
                }
                else {
                    let error: Error = new NotFoundError(Messages.ROLE_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
            })
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Update Role
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response, next: Function) {
        RoleService.update(request.params.id, request.body)
            .then((result: Role) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }
};

export default RoleController;