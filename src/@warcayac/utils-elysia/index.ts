import { errorMsg } from "../const-elysia";
import { TJMap } from "../types-common/types";


export default function errorHandler(error: TJMap, set: TJMap) {
  const filtered = error.toString().replace(/[\n\r\t]/g, '');
  const regex = /(?<=^|[\w\"]+\:\s+)[^\:]+(?=\s+[\w\"]+\:|$)/;
  const matches = filtered.match(regex);
  const err = matches?.[0].trim() ?? '';
  let msg : string;

  if (err.length === 0) {
    msg = 'UNKNOWN'
  } else {
    if (err[0] === '{') {
      msg = (error as any)['validator']['schema']['error'] ?? 'UNDEFINED'
    } else {
      msg = err;
      if (err === errorMsg.INTERNAL_ERROR) set.status = 500;
    }
  }

  return {
    message: msg,
    code: set.status ?? 'UNIDENTIFIED',
  };
}
