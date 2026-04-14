import { graphqlRequest } from '../lib/graphql';

export const createNotesSlice = (set, get) => ({
  notes: [],

  clearNotes: () => set({ notes: [] }),

  fetchNotes: async () => {
    const { currentProjectId } = get();

    if (!currentProjectId) {
      console.warn('No currentProjectId');
      return;
    }

    const GET_NOTES_QUERY = `
      query GetNotes($projectId: String!) {
        notes(projectId: $projectId) {
          id
          data
        }
      }
    `;

    try {
      const data = await graphqlRequest(GET_NOTES_QUERY, { projectId: currentProjectId });
      const formattedNotes = data.notes.map((note) => ({
        id: note.id,
        text: note.data.text,
      }));

      set({ notes: formattedNotes });
    } catch (err) {
      console.error('GraphQL Query Error:', err);
    }
  },

  addNote: async (text) => {
    const { currentProjectId } = get();

    if (!currentProjectId) return;

    const ADD_NOTE_MUTATION = `
      mutation AddNote($data: JSON!) {
        addNote(data: $data) {
          id
          data
        }
      }
    `;

    set({ status: 'saving' });
    try {
      const notePayload = {
        projectId: currentProjectId,
        text,
      };

      const data = await graphqlRequest(ADD_NOTE_MUTATION, {
        data: notePayload,
      });

      const newNote = {
        id: data.addNote.id,
        text: data.addNote.data.text,
      };

      set((state) => ({
        notes: [...state.notes, newNote],
        status: 'idle',
      }));
    } catch (err) {
      set({ error: err.message, status: 'error' });
    }
  },
});
