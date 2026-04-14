import { useState, useEffect } from 'react';
import { useNotes, useAddNote, useFetchNotes, useStatus, useCurrentProjectId } from '@/store';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components';

export function NotesSection() {
  const [text, setText] = useState('');
  const notes = useNotes();
  const addNote = useAddNote();
  const fetchNotes = useFetchNotes();
  const status = useStatus();
  const currentProjectId = useCurrentProjectId();

  useEffect(() => {
    if (currentProjectId) {
      fetchNotes();
    }
  }, [currentProjectId, fetchNotes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addNote(text);

    setText('');
  };

  return (
    <Card className="h-80 bg-slate-50">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Project Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <form onSubmit={handleSubmit} className="flex gap-2 my-3">
          <Input
            aria-label="Type a note"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a note..."
            className="bg-white"
          />
          <Button disabled={text.length === 0 || status === 'saving'} type="submit">
            {status === 'saving' ? 'Adding...' : 'Add note'}
          </Button>
        </form>
        <div className="space-y-2 mb-4 h-40 overflow-y-auto">
          {notes.length === 0 && <p className="text-xs text-slate-400 mt-2">No notes yet.</p>}
          {notes.map((note) => (
            <div key={note.id} className="p-2 bg-white border rounded text-sm shadow-sm">
              {note.text}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
