import express from 'express';

type GenericUser = {
  [key: string]: any;
};

declare global {
  namespace Express {
    interface Request {
      user: GenericUser;
      getUser<T>(): T;
    }

    export interface Response {
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

express.request.user = {};

/**
 *
 * @param User - Optional parameter to specify the type of user, can also be passed as a generic
 * @returns
 */
express.request.getUser = function <T>(User?: new () => T) {
  return this.user as T;
};

express.response.continue = function () {
  return this.status(100).send();
};

express.response.switchProtocol = function () {
  return this.status(101).send();
};

express.response.processing = function () {
  return this.status(102).send();
};

express.response.earlyHints = function () {
  return this.status(103).send();
};

express.response.ok = function (body: any) {
  return this.status(200).send(body);
};

express.response.created = function (body: any) {
  return this.status(201).send(body);
};

express.response.noContent = function () {
  return this.status(204).send();
};

express.response.partialContent = function (body: any) {
  return this.status(206).send(body);
};

express.response.multipleChoices = function (message?: string) {
  return this.status(300).send(message);
};

express.response.movedPermanently = function (message?: string) {
  return this.status(301).send(message);
};

express.response.seeOther = function (message?: string) {
  return this.status(303).send(message);
};

express.response.found = function (message?: string) {
  return this.status(302).send(message);
};

express.response.badRequest = function (message?: string) {
  return this.status(400).send(message);
};

express.response.unauthorized = function (message?: string) {
  return this.status(401).send(message);
};

express.response.forbidden = function (message?: string) {
  return this.status(403).send(message);
};

express.response.notFound = function (message?: string) {
  return this.status(404).send(message);
};

express.response.requestTimeout = function (message?: string) {
  return this.status(408).send(message);
};

express.response.conflict = function (message?: string) {
  return this.status(409).send(message);
};

express.response.unprocessableEntity = function (message?: string) {
  return this.status(422).send(message);
};

express.response.tooManyRequests = function (message?: string) {
  return this.status(429).send(message);
};

express.response.internalServerError = function (message?: string) {
  return this.status(500).send(message);
};

express.response.notImplemented = function (message?: string) {
  return this.status(501).send(message);
};

express.response.badGateway = function (message?: string) {
  return this.status(502).send(message);
};

express.response.serviceUnavailable = function (message?: string) {
  return this.status(503).send(message);
};

export default express;