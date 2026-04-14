import { useSaveProject, useStatus, useClips, useDeleteProject } from '@/store';
import { Button } from '@/components';
import { Loader2, Save, Trash2 } from 'lucide-react';

export function Header() {
  const clips = useClips();
  const saveProject = useSaveProject();
  const deleteProject = useDeleteProject();
  const status = useStatus();

  const isPending = status === 'saving' || status === 'loading';
  const canSave = clips.length > 0 && !isPending;

  const handleDelete = async () => {
    // Show confirm modal
    if (window.confirm('Are you sure want to delete this project?')) {
      await deleteProject();
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <h1 className="font-bold text-xl tracking-tight text-slate-900">VideoEditor</h1>
      <div className="flex items-center gap-2">
        {status === 'saving' && (
          <span className="text-xs text-muted-foreground animate-pulse mr-2 flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
          </span>
        )}
        <Button size="sm" onClick={saveProject} disabled={!canSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={handleDelete}
          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </header>
  );
}
