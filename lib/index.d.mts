import * as winston from 'winston';
import express from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import QueryString from 'qs';
import mongoose from 'mongoose';
import redis, { RedisClientOptions } from 'redis';
import * as typeorm from 'typeorm';
import typeorm__default, { DataSource } from 'typeorm';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import cors from 'cors';
import * as nodemailer from 'nodemailer';
import stream from 'stream';
import Mail from 'nodemailer/lib/mailer';

type GenericUser = {
    [key: string]: any;
};
declare global {
    namespace Express {
        interface Request {
            user: GenericUser;
            getUser<T>(): T;
        }
        interface Response {
            continue: () => void;
            switchProtocol: () => void;
            processing: () => void;
            earlyHints: () => void;
            ok: (body: any) => void;
            created: (body: any) => void;
            noContent: () => void;
            partialContent: (body: any) => void;
            multipleChoices: (message?: string) => void;
            movedPermanently: (message?: string) => void;
            seeOther: (message?: string) => void;
            found: (message?: string) => void;
            badRequest: (message?: string) => void;
            unauthorized: (message?: string) => void;
            forbidden: (message?: string) => void;
            notFound: (message?: string) => void;
            requestTimeout: (message?: string) => void;
            conflict: (message?: string) => void;
            unprocessableEntity: (message?: string) => void;
            tooManyRequests: (message?: string) => void;
            internalServerError: (message?: string) => void;
            notImplemented: (message?: string) => void;
            badGateway: (message?: string) => void;
            serviceUnavailable: (message?: string) => void;
        }
    }
}

type ServerOptions = {
    port: number;
    host: string;
    expressInstance?: express.Application;
    services?: {
        sql?: typeorm.DataSourceOptions;
        redis?: RedisClientOptions;
        mongo?: mongoose.ConnectOptions & {
            url: string;
        };
        smtp?: string | SMTPTransport | SMTPTransport.Options;
        auth?: boolean;
    };
    onServiceStartUp?: {
        sql?: () => void;
        redis?: () => void;
        mongo?: () => void;
        smtp?: () => void;
    };
};

type CRUDType<T extends typeorm.BaseEntity> = IndexType<T> | ShowType<T> | StoreType<T> | UpdateType<T> | DeleteType<T>;
type IndexType<T extends typeorm.BaseEntity> = {
    path: string;
    method: 'get';
    beforeFetch: (req: express.Request) => Promise<any>;
    duringFetch: (req: express.Request, selectQueryBuilder: () => typeorm.SelectQueryBuilder<T>, beforeFetchData: any, res: express.Response) => Promise<T[]>;
    afterFetch: (req: express.Request, duringFetchData: T[], res: express.Response) => Promise<void>;
    middlewares: string[];
};
type ShowType<T extends typeorm.BaseEntity> = {
    path: string;
    method: 'get';
    beforeFetch: (req: express.Request) => Promise<any>;
    duringFetch: (req: express.Request, selectQueryBuilder: () => typeorm.SelectQueryBuilder<T>, beforeFetchData: any, res: express.Response) => Promise<T>;
    afterFetch: (req: express.Request, duringFetchData: T, res: express.Response) => Promise<void>;
    middlewares: string[];
};
type StoreType<T extends typeorm.BaseEntity> = {
    path: string;
    method: 'post';
    beforeCreate: (req: express.Request) => Promise<any>;
    duringCreate: (req: express.Request, insertQueryBuilder: () => typeorm.Repository<T>, beforeCreateData: any, res: express.Response) => Promise<T>;
    afterCreate: (req: express.Request, duringCreateData: T, res: express.Response) => Promise<void>;
    middlewares: string[];
};
type UpdateType<T extends typeorm.BaseEntity> = {
    path: string;
    method: 'patch';
    beforeUpdate: (req: express.Request) => Promise<any>;
    duringUpdate: (req: express.Request, updateQueryBuilder: () => typeorm.Repository<T>, beforeUpdateData: any, res: express.Response) => Promise<T>;
    afterUpdate: (req: express.Request, duringUpdateData: T, res: express.Response) => Promise<void>;
    middlewares: string[];
};
type DeleteType<T extends typeorm.BaseEntity> = {
    path: string;
    method: 'delete';
    beforeDelete: (req: express.Request) => Promise<any>;
    duringDelete: (req: express.Request, deleteQueryBuilder: () => typeorm.Repository<T>, beforeDeleteData: any, res: express.Response) => Promise<T>;
    afterDelete: (req: express.Request, duringDeleteData: T, res: express.Response) => Promise<void>;
    middlewares: string[];
};

type EditIndexType<T extends typeorm.BaseEntity> = {
    beforeFetch?: (req: express.Request) => Promise<any>;
    duringFetch?: (req: express.Request, queryBuilder: () => typeorm.SelectQueryBuilder<T>, beforeFetchData: any, res: express.Response) => Promise<T[]>;
    afterFetch?: (req: express.Request, duringFetchData: T[], res: express.Response) => Promise<void>;
    middlewares?: string[];
};
type EditShowType<T extends typeorm.BaseEntity> = {
    beforeFetch?: (req: express.Request) => Promise<any>;
    duringFetch?: (req: express.Request, queryBuilder: typeorm.SelectQueryBuilder<T>, beforeFetchData: any, res: express.Response) => Promise<T>;
    afterFetch?: (req: express.Request, duringFetchData: T, res: express.Response) => Promise<void>;
    middlewares?: string[];
};
type EditStoreType<T extends typeorm.BaseEntity> = {
    beforeCreate?: (req: express.Request) => Promise<any>;
    duringCreate?: (req: express.Request, queryBuilder: typeorm.SelectQueryBuilder<T>, beforeCreateData: any, res: express.Response) => Promise<T> | Promise<T[]>;
    afterCreate?: (req: express.Request, duringCreateData: T | T[], res: express.Response) => Promise<void>;
    middlewares?: string[];
};
type EditUpdateType<T extends typeorm.BaseEntity> = {
    beforeUpdate?: (req: express.Request) => Promise<any>;
    duringUpdate?: (req: express.Request, queryBuilder: typeorm.SelectQueryBuilder<T>, beforeUpdateData: any, res: express.Response) => Promise<T> | Promise<T[]>;
    afterUpdate?: (req: express.Request, duringUpdateData: T | T[], res: express.Response) => Promise<void>;
    middlewares?: string[];
};
type EditDeleteType<T extends typeorm.BaseEntity> = {
    beforeDelete?: (req: express.Request) => Promise<any>;
    duringDelete?: (req: express.Request, queryBuilder: typeorm.SelectQueryBuilder<T>, beforeDeleteData: any, res: express.Response) => Promise<T> | Promise<T[]>;
    afterDelete?: (req: express.Request, duringDeleteData: T | T[], res: express.Response) => Promise<void>;
    middlewares?: string[];
};

declare class Mailer {
    private mailer;
    private fromEmail;
    constructor(nodemailer: nodemailer.Transporter);
    setGlobalFromEmail(email: string): void;
    sendMail(to: string, subject: string, text: string | Buffer | stream.Readable | Mail.AttachmentLike | undefined, failOnError?: boolean, from?: string): Promise<void>;
}

declare class Server {
    protected app: express.Application;
    protected services: ServerOptions['services'];
    middlewares: Record<string, express.RequestHandler>;
    protected cruds: Map<new () => typeorm__default.BaseEntity, Record<string, CRUDType<typeorm__default.BaseEntity>>>;
    port: number;
    host: string;
    mailer: Mailer;
    sql: DataSource;
    redisClient: redis.RedisClientType;
    mongoClient: mongoose.Mongoose;
    private constructor();
    static create(serverOptions?: ServerOptions): Promise<Server>;
    start(cb?: () => void): void;
    /**
     * @description - The handler will be executed before every request
     * @param handler
     * @returns
     */
    registerGlobalMiddleware(handler: express.RequestHandler): Promise<void>;
    /**
     * @description - The handler to register as a middleware that can be used in CRUD operations, if name is not provided, function name will be used instead
     * @param handler
     * @param name
     * @returns
     */
    registerMiddleware(handlerData: {
        handler: express.RequestHandler;
        name?: string;
    }): Promise<void>;
    /**
     * @description - Creates basic CRUD operations for a given entity
     * @description - The entity must be a typeorm EntitySchema
     * @description - Creates an index, show, create, update, and delete operation
     * @param entity - The entity to create CRUD operations for
     */
    makeCRUD<T extends typeorm__default.BaseEntity>(entity: new () => T): void;
    /**
     * @description - Customize the index CRUD operation for a given entity with custom hooks
     * @param type Hook to customize the base CRUD operations
     */
    customizeIndexCRUD<T extends typeorm__default.BaseEntity>(entity: new () => T, editIndexCrud: EditIndexType<T>): void;
    /**
     * @description - Customize the show CRUD operation for a given entity with custom hooks
     * @param type Hook to customize the base CRUD operations
     */
    customizeShowCRUD<T extends typeorm__default.BaseEntity>(entity: new () => T, editShowCrud: EditShowType<T>): void;
    /**
     * @description - Customize the store CRUD operation for a given entity with custom hooks
     * @param type Hook to customize the base CRUD operations
     */
    customizeStoreCRUD<T extends typeorm__default.BaseEntity>(entity: new () => T, editStoreCrud: EditStoreType<T>): void;
    /**
     * @description - Customize the update CRUD operation for a given entity with custom hooks
     * @param type Hook to customize the base CRUD operations
     */
    customizeUpdateCRUD<T extends typeorm__default.BaseEntity>(entity: new () => T, editUpdateCrud: EditUpdateType<T>): void;
    /**
     * @description - Customize the delete CRUD operation for a given entity with custom hooks
     * @param type Hook to customize the base CRUD operations
     */
    customizeDeleteCRUD<T extends typeorm__default.BaseEntity>(entity: new () => T, editDeleteCrud: EditDeleteType<T>): void;
    rawExpressApp(): express.Application;
    router(): express.Router;
    use(...handlers: express.RequestHandler<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>[]): express.Application;
    useCors(corsOptions?: cors.CorsOptions): express.Application;
    protected registerCRUDRoutes<T extends typeorm__default.BaseEntity>(cruds: Record<string, CRUDType<T>>, entity: new () => typeorm__default.BaseEntity): void;
    protected updateCRUDRoutes<T extends typeorm__default.BaseEntity>(cruds: Record<string, CRUDType<T>>, entity: new () => typeorm__default.BaseEntity): void;
    protected parseMiddlewares(middlewares: string[]): express.RequestHandler[];
    protected removeRouteByMethodAndPath(app: express.Application, method: string, path: string): any[];
}

declare const _default: {
    Logger: winston.Logger;
    Server: typeof Server;
    createServer: typeof Server.create;
};

export { _default as default };
