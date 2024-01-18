import process from 'process';
import Elysia from "elysia";

import { TJMap } from './utils/types';
import WInfo from './utils/WInfo'


const wlogger = (showBody: boolean = false) => new Elysia()
  .onRequest((context) => {
    context.store = { 
      ...context.store, 
      _info: new WInfo(
        context.request.method,
        new URL(context.request.url).pathname,
        process.hrtime.bigint(),
        new Date().toISOString(),
        showBody,
      ),
    }
  })
  .onBeforeHandle(context => {
    const info : WInfo = (context.store as TJMap)['_info'];
    if (info.method === 'POST' && context.body && info.showPostBody) {
      info.body = ' 🚨 ' + JSON.stringify(context.body);
    }
  })
  .onAfterHandle(context => {
    const info : WInfo = (context.store as TJMap)['_info'];
    info.status = ((context as TJMap)['response'] as TJMap)['status'];
  })
  .onError(context => {
    const info : WInfo = (context.store as TJMap)['_info'];
    if (Object.keys(context.error).find(e => e === 'status') !== undefined) {
      info.status = (context.error as TJMap)['status'];
      console.log(info.getLog());
    }
  })
  .onResponse((context) => {
    const info : WInfo = (context.store as TJMap)['_info'];
    info.status = info.status ?? (context as TJMap)['set']['status'];
    console.log(info.getLog());
  })
;

export default wlogger;