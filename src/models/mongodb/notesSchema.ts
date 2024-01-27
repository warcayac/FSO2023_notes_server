import mongoose from 'mongoose';


export const notesSchema = new mongoose.Schema(
  {
    content: {type: String, required: true, minlength: 5, unique: true},
    important: {type: Boolean, required: false, default: false},
  },
  {
    collection: 'notes',
    strictQuery: 'throw',
    strict: true,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
    }
  }
);

export type TNote = mongoose.InferSchemaType<typeof notesSchema>;
export const Note = mongoose.model('Note', notesSchema);
