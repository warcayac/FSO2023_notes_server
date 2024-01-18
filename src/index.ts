import Elysia, { t } from "elysia";
import cors from "@elysiajs/cors";

import { contentType } from "./utils/constants";
import wlogger from "./plugins/wac-logger";


let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const paramIdParser = {
  params: t.Object({
    id: t.String({ 
      pattern: /^\d+$/.source, 
      maxLength: 5,
    })
  }),
  error: () => 'Invalid parameter',
}

function getNote(id: string) {
  return notes.find(n => n.id === Number(id));
}

function generateNewId() {
  return notes.length === 0 
    ? 0
    : Math.max(...notes.map(n => n.id)) + 1
  ;
}

const app = new Elysia()
  .use(cors({methods: '*'}))
  .use(wlogger(true))
  .group(
    '/api/notes',
    (router) => router
      .onError(
        ({code, set:{status}}) => Response.json(
          `Error: ${code}`, 
          { status: Number(status) ?? -1 }
        )
      )
      .get(
        '/',
        () => Response.json(notes),
      )
      .get(
        '/:id',
        ({params}) => {
          const result = getNote(params.id);
          return result ? Response.json(result) : new Response('Not found', {status: 404})
        },
        paramIdParser,
      )
      .delete(
        '/:id',
        ({params}) => {
          const result = getNote(params.id);
          
          if (result) {
            notes = notes.filter(n => n !== result);
            return new Response(null, {status: 204})
          }
          
          return new Response('Not found', {status: 404})
        },
        paramIdParser,
      )
      .post(
        '/',
        async (req) => {
          const newNote = {...req.body, id: generateNewId()};
          notes.push(newNote);
          return Response.json(newNote);
        },
        {
          body: t.Object({
            content: t.String(),
            important: t.Boolean(),
            id: t.Optional(t.Number())
          }),
          error: (details) => JSON.parse(details.error.message)['message']
        }
      )
      .put(
        '/:id',
        req => {
          const id = req.body.id;
          const index = notes.findIndex(e => e.id == id);
          
          if (index < 0) Response.json({message: 'Not found'}, {status: 404});
          
          notes[index].important = !notes[index].important;
          return Response.json(notes[index]);
        },
        {
          ...paramIdParser,
          body: t.Object({
            content: t.String(),
            important: t.Boolean(),
            id: t.Number(),
          }),
          error: (details) => JSON.parse(details.error.message)['message']
        },
      )
  )
  .get(
    '/', 
    () => new Response('<h1>Hello World!</h1', { headers: contentType.HTML }),
  )
  .listen(3001)
;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
