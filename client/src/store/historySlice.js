import * as R from 'ramda';
import { DEFAULT_HISTORY_STEPS } from '@/constants.js';

export const createHistorySlice = (set, get) => ({
  past: [],
  future: [],

  saveToHistory: (state) => {
    const currentState = get();

    if (!currentState || !currentState.clips) return {};
    // pipe: Creates a left-to-right execution flow
    // append: Pushes the current state of clips to the end of the 'past' array
    // takeLast: Truncates the array to keep only the most recent N steps, preventing memory leaks

    return {
      past: R.pipe(R.append(state.clips), R.takeLast(DEFAULT_HISTORY_STEPS))(state.past),
      future: [],
    };
  },

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;
      // last: Safely extracts the very last element of the 'past' array
      const previousClips = R.last(state.past);
      // init: Returns a new array containing everything except the last element
      const newPast = R.init(state.past);

      return {
        past: newPast,
        clips: previousClips,
        // prepend: Inserts the current, 'to-be-undone' state at the very beginning of the 'future' array
        future: R.prepend(state.clips, state.future),
        selectedClipId: null,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;

      // head: Safely extracts the very first element of the 'future' array
      const nextClips = R.head(state.future);
      // tail: Returns a new array containing everything except the first element
      const newFuture = R.tail(state.future);

      return {
        // append: Pushes the current state back onto the end of the 'past' array
        past: R.append(state.clips, state.past),
        clips: nextClips,
        future: newFuture,
        selectedClipId: null,
      };
    }),
});
