import { buildSchema } from 'graphql';

/**
 * GraphQL schema for notes
 * - Note structure is flexible with an ID and a JSON data field
 * - The data field can contain any structure (including projectId)
 */
export const schema = buildSchema(`
  scalar JSON

  type Note {
    id: ID!
    data: JSON
  }

  type Query {
    notes(projectId: String): [Note]
    note(id: ID!): Note
  }

  type Mutation {
    addNote(data: JSON!): Note
    updateNote(id: ID!, data: JSON!): Note
    deleteNote(id: ID!): Boolean
  }
`);

export default schema;
