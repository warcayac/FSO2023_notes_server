import { httpResponse } from '../../../@warcayac/const-elysia';
import { Note, TNote } from './../../../models/mongodb/notesSchema';


 /* ------------------------------------------------------------------------------------------ */
 export async function getNotes() {
  const data = await Note.find();
  return Response.json(data);
}

 /* ------------------------------------------------------------------------------------------ */
 export async function getOneNote(id: string) {
  const data = await Note.findById(id);
  return data !== null
    ? Response.json(data) 
    : new Response('Not found', {status: 404})
  ;
}

 /* ------------------------------------------------------------------------------------------ */
 export async function deleteOneNote(id: string) {
  const response = await Note.findByIdAndDelete(id);
  
  return response !== null
    ? httpResponse.SUCCESS(204)
    : httpResponse.NOT_FOUND()
  ;
}

 /* ------------------------------------------------------------------------------------------ */
 export async function addOneNote(body: TNote) {
  body.important ??= false;

  const newNote = new Note(body);
  const response = await newNote.save();

  return Response.json(response);
}

 /* ------------------------------------------------------------------------------------------ */
 export async function updateOneNoteImportant(id: string, important: boolean) {
  const response = await Note.findByIdAndUpdate(
    id, 
    {important}, 
    {new: true, runValidators: true}
  );

  return response !== null
    ? Response.json(response)
    : httpResponse.NOT_FOUND()
  ;
}