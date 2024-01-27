import { t } from "elysia";

import { TJMap } from "../types-common/types";


export const contentType = {
  JSON : { "Content-Type": "application/json" },
  HTML : { "Content-Type": "text/html" },
  TEXT : { "Content-Type": "text/plain" },
}

export function jsonResponse(message: string, code: number = 200, other?: TJMap) {
  return Response.json({message, status: code, ...other}, {status: code});
}

export const httpResponse = {
  200 : (other?: TJMap) => jsonResponse('Success', 200, other),
  400 : (message?: string) => jsonResponse(message ?? 'Bad Request', 400),
  404 : (message?: string) => jsonResponse(message ?? 'Not Found', 404),
  OK : (other?: TJMap) => jsonResponse('Success', 200, other),
  SUCCESS: (code?: number, other?: TJMap) => jsonResponse('Success', code ?? 200, other),
  NOT_FOUND : (message?: string) => jsonResponse(message ?? 'Not Found', 404),
  BAD_REQUEST : (message?: string) => jsonResponse(message ?? 'Bad Request', 400),
  UNKNOWN : () => jsonResponse('Unknown', 500), // Internal Server Error
  INTERNAL_ERROR : () => jsonResponse('Internal Error', 500),
}

export const patterns = {
  objectId: /^[A-Za-z0-9]{24}$/.source,
}

// elementos que pueden emplearse para componer un parser
export const parserItems = {
  objectId: { id: t.String({ pattern: patterns.objectId, error: 'Id malformatted' }) }
}

// usado por los handlers de peticiones
export const parsers = {
  paramObjectId: {
    params: t.Object(parserItems.objectId)
  }
}

export const errorMsg = {
  MISSING_PROPERTY : 'Body malformatted or missing property',
  INTERNAL_ERROR : 'Internal Error',
}
