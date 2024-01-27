import { t } from "elysia";

import { errorMsg, parsers } from './../../../@warcayac/const-elysia';


 /* ------------------------------------------------------------------------------------------ */
export const paramIdParser = parsers.paramObjectId

 /* ------------------------------------------------------------------------------------------ */
export const bodyPersonParser = {
  body: t.Object(
    {
      content: t.String(),
      important: t.Optional(t.Boolean()),
    },
    {
      error: errorMsg.MISSING_PROPERTY
    }
  ),
}

 /* ------------------------------------------------------------------------------------------ */
export const idAndBodyPersonParser = {
  ...parsers.paramObjectId,
  body: t.Object(
    {
      important: t.Boolean(),
      content: t.Optional(t.String()),
      id: t.Optional(t.String()),
    },
    {
      error: errorMsg.MISSING_PROPERTY
    }
  ),
}
