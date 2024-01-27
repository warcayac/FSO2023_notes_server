import Elysia from "elysia";

import * as h from "./handlers";
import * as k from './hooks'
import errorHandler from "../../../@warcayac/utils-elysia";


const notesRoutes = new Elysia({ prefix: '/notes'})
  .onError(({error, set}) => errorHandler(error, set))
  .get('/', h.getNotes)
  .get('/:id', ({params: {id}}) => h.getOneNote(id), k.paramIdParser)
  .delete('/:id', ({params: {id}}) => h.deleteOneNote(id), k.paramIdParser)
  .post('/', ({body}) => h.addOneNote(body), k.bodyPersonParser)
  .put(
    '/:id', 
    ({body, params: {id}}) => h.updateOneNoteImportant(id, body.important),
    k.idAndBodyPersonParser,
  )
;

export default notesRoutes;