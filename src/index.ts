import Elysia from "elysia";
import cors from "@elysiajs/cors";
import staticPlugin from "@elysiajs/static";
import mongoose from "mongoose";

import wlogger from "./@warcayac/wlogger";
import { doConnection } from "./@warcayac/utils-mongodb";
import notesRoutes from "./plugins/paths/notes/notesRoutes";
import { httpResponse } from "./@warcayac/const-elysia";


declare module "bun" {
  interface Env {
    MONGODB_URI: string;
  }
}

async function main() {
  await doConnection();
  await mongoose.connect(process.env.MONGODB_URI);
  
  const app = new Elysia()
    .use(cors({methods: '*'}))
    .use(wlogger(true))
    .use(staticPlugin({assets: 'dist', prefix: '/', alwaysStatic: true}))
    .group('/api', app => app.use(notesRoutes))
    .get('/', () => Bun.file('./dist/index.html'))
    .all('*', () => httpResponse[404]('Path name not found'))
    .listen(process.env.PORT || 3001)
  ;

  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);  
}

main();