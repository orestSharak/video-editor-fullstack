import { PROJECT_API } from '@/constants.js';

export const createProjectSlice = (set, get) => ({
  currentProjectId: null,
  status: 'idle', // 'idle' | 'loading' | 'saving' | 'error'
  error: null,

  fetchProjects: async () => {
    // Prevent double fetching during initial loading
    const { status, clips } = get();
    if (status === 'loading' || clips.length > 0) return;

    set({ status: 'loading' });
    try {
      const response = await fetch(PROJECT_API);
      const projects = await response.json();

      if (projects.length > 0) {
        const firstProject = projects[0];
        set({
          clips: firstProject.data.clips || [],
          currentProjectId: firstProject.id,
          status: 'idle',
        });
      } else {
        set({ status: 'idle' });
      }
    } catch (err) {
      set({ error: err.message, status: 'error' });
    }
  },

  saveProject: async () => {
    const { clips, currentProjectId } = get();

    if (clips.length === 0) return;

    set({ status: 'saving', error: null });

    try {
      let response;

      if (!currentProjectId) {
        // Create project
        response = await fetch(PROJECT_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clips }),
        });

        const newProject = await response.json();
        setTimeout(() => set({ currentProjectId: newProject.id }), 1000);
      } else {
        // Update project
        response = await fetch(`${PROJECT_API}/${currentProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clips }),
        });
      }

      if (!response.ok) throw new Error('Failed to save project');
      setTimeout(() => set({ status: 'idle' }), 1000);
    } catch (err) {
      set({ error: err.message, status: 'error' });
    }
  },

  deleteProject: async () => {
    const { currentProjectId } = get();

    if (!currentProjectId) {
      set({ clips: [], past: [], future: [], error: null });
      return;
    }

    set({ status: 'loading', error: null });
    try {
      const response = await fetch(`${PROJECT_API}/${currentProjectId}`, {
        method: 'DELETE',
      });

      if (!response.ok && response.status !== 204) throw new Error('Delete failed');
      setTimeout(() => {
        set({
          clips: [],
          currentProjectId: null,
          past: [],
          future: [],
          status: 'idle',
          selectedClipId: null,
          playHeadPosition: 0,
        });
        get().clearNotes();
      }, 1000);
    } catch (err) {
      set({ error: err.message, status: 'error' });
    }
  },
});
