# Mock API Server

A simple, flexible mock API server for frontend development. Provides both REST and GraphQL endpoints with zero configuration and no authentication required.

## Features

- ✅ **Zero Configuration** - Works out of the box
- ✅ **REST API** - Full CRUD operations for projects
- ✅ **GraphQL API** - Query and mutate notes with filtering
- ✅ **Flexible Data Model** - No schema enforcement, frontend decides structure
- ✅ **JSON File Database** - Easy to inspect and modify
- ✅ **CORS Enabled** - Ready for local frontend development
- ✅ **GraphiQL Interface** - Interactive GraphQL playground

## Quick Start

### Installation

```bash
npm install
```

### Start Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## REST API

Base path: `/api`

### Projects Endpoints

All project data is stored in a flexible `data` field. The frontend decides the structure.

#### Get All Projects
```http
GET /api/projects
```

**Response:**
```json
[
  {
    "id": "uuid-here",
    "data": {
      "name": "My Project",
      "description": "Project details",
      "customField": "any value"
    }
  }
]
```

#### Get Project by ID
```http
GET /api/projects/:id
```

#### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "name": "New Project",
  "anyField": "anyValue",
  "nested": {
    "field": "works too"
  }
}
```

**Response:**
```json
{
  "id": "generated-uuid",
  "data": {
    "name": "New Project",
    "anyField": "anyValue",
    "nested": {
      "field": "works too"
    }
  }
}
```

#### Update Project
```http
PUT /api/projects/:id
Content-Type: application/json

{
  "name": "Updated Project",
  "status": "active"
}
```

#### Delete Project
```http
DELETE /api/projects/:id
```

### Example REST Usage

```javascript
// Create a project
const response = await fetch('http://localhost:3000/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Project',
    status: 'draft',
    tags: ['important', 'urgent']
  })
});
const project = await response.json();

// Get all projects
const projects = await fetch('http://localhost:3000/api/projects')
  .then(res => res.json());

// Update a project
await fetch(`http://localhost:3000/api/projects/${project.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Updated Title',
    status: 'published'
  })
});

// Delete a project
await fetch(`http://localhost:3000/api/projects/${project.id}`, {
  method: 'DELETE'
});
```

## GraphQL API

Endpoint: `/graphql`

Interactive GraphiQL UI: Open `http://localhost:3000/graphql` in your browser

### Schema

Notes are flexible entities with a `data` field that can contain any structure. You can use a `projectId` field inside `data` to associate notes with projects.

```graphql
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
```

### Query Examples

#### Get All Notes
```graphql
query {
  notes {
    id
    data
  }
}
```

#### Get Notes for a Specific Project
```graphql
query {
  notes(projectId: "project-uuid-here") {
    id
    data
  }
}
```

#### Get a Single Note
```graphql
query {
  note(id: "note-uuid-here") {
    id
    data
  }
}
```

### Mutation Examples

#### Add a Note
```graphql
mutation {
  addNote(data: {
    projectId: "project-uuid-here"
    content: "This is a note"
    priority: "high"
    tags: ["important", "review"]
  }) {
    id
    data
  }
}
```

#### Update a Note
```graphql
mutation {
  updateNote(
    id: "note-uuid-here"
    data: {
      projectId: "project-uuid-here"
      content: "Updated content"
      priority: "medium"
    }
  ) {
    id
    data
  }
}
```

#### Delete a Note
```graphql
mutation {
  deleteNote(id: "note-uuid-here")
}
```

### Example GraphQL Usage (JavaScript)

```javascript
// Query notes
const query = `
  query {
    notes(projectId: "project-123") {
      id
      data
    }
  }
`;

const response = await fetch('http://localhost:3000/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
});
const result = await response.json();

// Add a note
const mutation = `
  mutation($data: JSON!) {
    addNote(data: $data) {
      id
      data
    }
  }
`;

const variables = {
  data: {
    projectId: "project-123",
    text: "My note",
    author: "John Doe"
  }
};

await fetch('http://localhost:3000/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: mutation, variables })
});
```

## Data Model Philosophy

This mock server is designed to be a **generic storage layer**:

- ✅ No schema validation
- ✅ No data type enforcement
- ✅ Frontend decides data structure
- ✅ Any JSON structure is accepted

All entities follow this pattern:
```json
{
  "id": "auto-generated-uuid",
  "data": {
    // ... whatever the frontend sends ...
  }
}
```

## Database

Data is stored in `src/db/db.json` as plain JSON:

```json
{
  "projects": [],
  "clips": [],
  "notes": []
}
```

You can manually edit this file while the server is running. Changes will be picked up on the next request.

## Project Structure

```
/mock-api
  /src
    /rest
      projects.js        # REST CRUD for projects
    /graphql
      schema.js          # GraphQL schema definition
      resolvers.js       # GraphQL resolvers for notes
    /db
      db.json            # JSON database file
      db.js              # Database helper functions
    server.js            # Main server entry point
  package.json
  README.md
```

## Troubleshooting

### Port already in use
If port 3000 is already in use, set a different port:
```bash
PORT=4000 npm start
```

### CORS issues
CORS is enabled for all origins by default. If you still experience issues, check your browser's console for specific error messages.

### Data not persisting
Make sure the `src/db/db.json` file is writable and not open in another process.

## Notes for Frontend Developers

1. **No Authentication** - This is a mock server. Don't implement auth logic.
2. **Data Flexibility** - Send any JSON structure you need. The server won't validate it.
3. **IDs are UUIDs** - The server generates random UUIDs for new entities.
4. **Relationships** - To link notes to projects, include a `projectId` in the note's `data` field.
5. **GraphiQL** - Use the interactive UI at `/graphql` to test queries and mutations.

## License

MIT
