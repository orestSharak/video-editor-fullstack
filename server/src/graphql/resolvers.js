import { randomUUID } from 'crypto';
import { GraphQLScalarType, Kind } from 'graphql';
import { getAll, getById, create, update, remove } from '../db/db.js';

const COLLECTION = 'notes';

/**
 * Custom JSON scalar type to handle arbitrary JSON data
 */
const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'Arbitrary JSON value',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.INT:
      case Kind.FLOAT:
        return parseFloat(ast.value);
      case Kind.OBJECT: {
        const value = Object.create(null);
        ast.fields.forEach(field => {
          value[field.name.value] = JSONScalar.parseLiteral(field.value);
        });
        return value;
      }
      case Kind.LIST:
        return ast.values.map(JSONScalar.parseLiteral);
      default:
        return null;
    }
  }
});

/**
 * GraphQL resolvers for notes
 */
export const resolvers = {
  JSON: JSONScalar,
  
  /**
   * Query: Get all notes, optionally filtered by projectId
   */
  notes({ projectId }) {
    console.log('GraphQL Query: notes', { projectId });
    const allNotes = getAll(COLLECTION);
    
    if (!projectId) {
      return allNotes;
    }
    
    // Filter by projectId if provided
    return allNotes.filter(note => {
      return note.data && note.data.projectId === projectId;
    });
  },
  
  /**
   * Query: Get a single note by ID
   */
  note({ id }) {
    console.log('GraphQL Query: note', { id });
    return getById(COLLECTION, id);
  },
  
  /**
   * Mutation: Add a new note
   */
  addNote({ data }) {
    console.log('GraphQL Mutation: addNote', data);
    
    const newNote = {
      id: randomUUID(),
      data: data || {}
    };
    
    return create(COLLECTION, newNote);
  },
  
  /**
   * Mutation: Update an existing note
   */
  updateNote({ id, data }) {
    console.log('GraphQL Mutation: updateNote', { id, data });
    
    const existing = getById(COLLECTION, id);
    
    if (!existing) {
      throw new Error('Note not found');
    }
    
    const updatedNote = {
      id,
      data: data || {}
    };
    
    return update(COLLECTION, id, updatedNote);
  },
  
  /**
   * Mutation: Delete a note
   */
  deleteNote({ id }) {
    console.log('GraphQL Mutation: deleteNote', { id });
    
    const success = remove(COLLECTION, id);
    
    if (!success) {
      throw new Error('Note not found');
    }
    
    return true;
  }
};

export default resolvers;
