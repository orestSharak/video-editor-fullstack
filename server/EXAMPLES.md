# API Usage Examples

This file contains practical examples for using the Mock API Server.

## REST API Examples

### JavaScript/Fetch

```javascript
const API_BASE = 'http://localhost:3000/api';

// Create a new project
async function createProject() {
  const response = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Website Redesign',
      status: 'in-progress',
      owner: 'Jane Doe',
      deadline: '2024-12-31',
      tags: ['design', 'priority'],
      budget: 50000
    })
  });
  
  const project = await response.json();
  console.log('Created project:', project);
  return project;
}

// Get all projects
async function getAllProjects() {
  const response = await fetch(`${API_BASE}/projects`);
  const projects = await response.json();
  console.log('All projects:', projects);
  return projects;
}

// Get single project
async function getProject(id) {
  const response = await fetch(`${API_BASE}/projects/${id}`);
  if (!response.ok) {
    console.error('Project not found');
    return null;
  }
  const project = await response.json();
  console.log('Project:', project);
  return project;
}

// Update a project
async function updateProject(id) {
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Website Redesign',
      status: 'completed',
      owner: 'Jane Doe',
      completedDate: '2024-06-15'
    })
  });
  
  const project = await response.json();
  console.log('Updated project:', project);
  return project;
}

// Delete a project
async function deleteProject(id) {
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE'
  });
  
  if (response.ok) {
    console.log('Project deleted successfully');
  }
}
```

### React Hook Example

```javascript
import { useState, useEffect } from 'react';

function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createProject(projectData) {
    const response = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    const newProject = await response.json();
    setProjects([...projects, newProject]);
    return newProject;
  }

  async function updateProject(id, projectData) {
    const response = await fetch(`http://localhost:3000/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    const updatedProject = await response.json();
    setProjects(projects.map(p => p.id === id ? updatedProject : p));
    return updatedProject;
  }

  async function deleteProject(id) {
    await fetch(`http://localhost:3000/api/projects/${id}`, {
      method: 'DELETE'
    });
    setProjects(projects.filter(p => p.id !== id));
  }

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refresh: fetchProjects
  };
}

export default useProjects;
```

## GraphQL Examples

### JavaScript/Fetch

```javascript
const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

// Helper function for GraphQL requests
async function graphqlRequest(query, variables = {}) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables
    })
  });
  
  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  return result.data;
}

// Get all notes
async function getAllNotes() {
  const query = `
    query {
      notes {
        id
        data
      }
    }
  `;
  
  const data = await graphqlRequest(query);
  console.log('All notes:', data.notes);
  return data.notes;
}

// Get notes for a specific project
async function getNotesByProject(projectId) {
  const query = `
    query GetProjectNotes($projectId: String) {
      notes(projectId: $projectId) {
        id
        data
      }
    }
  `;
  
  const data = await graphqlRequest(query, { projectId });
  console.log('Project notes:', data.notes);
  return data.notes;
}

// Add a new note
async function addNote(projectId, content, priority = 'medium') {
  const mutation = `
    mutation AddNote($data: JSON!) {
      addNote(data: $data) {
        id
        data
      }
    }
  `;
  
  const variables = {
    data: {
      projectId,
      content,
      priority,
      createdAt: new Date().toISOString(),
      author: 'Current User'
    }
  };
  
  const data = await graphqlRequest(mutation, variables);
  console.log('Created note:', data.addNote);
  return data.addNote;
}

// Update a note
async function updateNote(noteId, updates) {
  const mutation = `
    mutation UpdateNote($id: ID!, $data: JSON!) {
      updateNote(id: $id, data: $data) {
        id
        data
      }
    }
  `;
  
  const variables = {
    id: noteId,
    data: {
      ...updates,
      updatedAt: new Date().toISOString()
    }
  };
  
  const data = await graphqlRequest(mutation, variables);
  console.log('Updated note:', data.updateNote);
  return data.updateNote;
}

// Delete a note
async function deleteNote(noteId) {
  const mutation = `
    mutation DeleteNote($id: ID!) {
      deleteNote(id: $id)
    }
  `;
  
  const data = await graphqlRequest(mutation, { id: noteId });
  console.log('Note deleted:', data.deleteNote);
  return data.deleteNote;
}
```

### React Hook Example

```javascript
import { useState, useEffect } from 'react';

function useNotes(projectId = null) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [projectId]);

  async function fetchNotes() {
    setLoading(true);
    const query = `
      query GetNotes($projectId: String) {
        notes(projectId: $projectId) {
          id
          data
        }
      }
    `;

    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { projectId } })
    });

    const result = await response.json();
    setNotes(result.data.notes);
    setLoading(false);
  }

  async function addNote(noteData) {
    const mutation = `
      mutation AddNote($data: JSON!) {
        addNote(data: $data) {
          id
          data
        }
      }
    `;

    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: mutation,
        variables: { data: noteData }
      })
    });

    const result = await response.json();
    setNotes([...notes, result.data.addNote]);
    return result.data.addNote;
  }

  async function updateNote(id, noteData) {
    const mutation = `
      mutation UpdateNote($id: ID!, $data: JSON!) {
        updateNote(id: $id, data: $data) {
          id
          data
        }
      }
    `;

    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: mutation,
        variables: { id, data: noteData }
      })
    });

    const result = await response.json();
    setNotes(notes.map(n => n.id === id ? result.data.updateNote : n));
  }

  async function deleteNote(id) {
    const mutation = `
      mutation DeleteNote($id: ID!) {
        deleteNote(id: $id)
      }
    `;

    await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation, variables: { id } })
    });

    setNotes(notes.filter(n => n.id !== id));
  }

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    refresh: fetchNotes
  };
}

export default useNotes;
```

## Using Apollo Client (Optional)

If you prefer using Apollo Client for GraphQL:

```bash
npm install @apollo/client graphql
```

```javascript
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache()
});

// Query
const GET_NOTES = gql`
  query GetNotes($projectId: String) {
    notes(projectId: $projectId) {
      id
      data
    }
  }
`;

const result = await client.query({
  query: GET_NOTES,
  variables: { projectId: 'project-123' }
});

// Mutation
const ADD_NOTE = gql`
  mutation AddNote($data: JSON!) {
    addNote(data: $data) {
      id
      data
    }
  }
`;

const { data } = await client.mutate({
  mutation: ADD_NOTE,
  variables: {
    data: {
      projectId: 'project-123',
      content: 'New note'
    }
  }
});
```

## Full Example: Todo List Integration

```javascript
// Complete example: Linking projects and notes
class ProjectManager {
  constructor() {
    this.apiBase = 'http://localhost:3000/api';
    this.graphqlEndpoint = 'http://localhost:3000/graphql';
  }

  // Create a project with initial notes
  async createProjectWithNotes(projectData, notesData) {
    // Create project via REST
    const projectResponse = await fetch(`${this.apiBase}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    const project = await projectResponse.json();

    // Create notes via GraphQL
    const notes = [];
    for (const noteData of notesData) {
      const mutation = `
        mutation AddNote($data: JSON!) {
          addNote(data: $data) {
            id
            data
          }
        }
      `;

      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: mutation,
          variables: {
            data: {
              projectId: project.id,
              ...noteData
            }
          }
        })
      });

      const result = await response.json();
      notes.push(result.data.addNote);
    }

    return { project, notes };
  }

  // Get project with all its notes
  async getProjectWithNotes(projectId) {
    // Get project via REST
    const projectResponse = await fetch(`${this.apiBase}/projects/${projectId}`);
    const project = await projectResponse.json();

    // Get notes via GraphQL
    const query = `
      query GetProjectNotes($projectId: String) {
        notes(projectId: $projectId) {
          id
          data
        }
      }
    `;

    const notesResponse = await fetch(this.graphqlEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { projectId }
      })
    });

    const notesResult = await notesResponse.json();
    
    return {
      project,
      notes: notesResult.data.notes
    };
  }
}

// Usage
const manager = new ProjectManager();

const result = await manager.createProjectWithNotes(
  {
    title: 'Q1 Planning',
    status: 'active'
  },
  [
    { content: 'Schedule kickoff meeting', priority: 'high' },
    { content: 'Review budget allocation', priority: 'medium' },
    { content: 'Assign team members', priority: 'high' }
  ]
);

console.log('Created:', result);
```
