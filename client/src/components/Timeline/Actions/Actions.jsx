import {
  useAddClip,
  useCanRedo,
  useCanUndo,
  useClips,
  usePlayHeadPosition,
  useRedo,
  useSelectedClipId,
  useSplitClip,
  useUndo,
} from '@/store';
import { DEFAULT_CLIP_DURATION } from './constants';
import { Button, TooltipTrigger, Tooltip, TooltipContent } from '@/components';
import { Redo2, Undo2 } from 'lucide-react';

export function Actions() {
  const clips = useClips();
  const playHeadPosition = usePlayHeadPosition();
  const selectedClipId = useSelectedClipId();
  const addClip = useAddClip();
  const splitClip = useSplitClip();
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const handleAddClip = () => {
    addClip({
      id: `clip-${Date.now()}`,
      name: `Clip-${clips.length + 1}`,
      startTime: playHeadPosition,
      duration: DEFAULT_CLIP_DURATION,
    });
  };

  return (
    <div className="flex gap-3 mb-4 align-middle">
      <div className="flex items-center border-r pr-3 gap-1">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={undo}
              disabled={!canUndo}
              aria-label="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Undo</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={redo}
              disabled={!canRedo}
              aria-label="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Redo</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex gap-2">
        <Button onClick={splitClip} disabled={!selectedClipId} size="sm">
          Split Clip
        </Button>
        <Button onClick={handleAddClip} size="sm">
          Add Clip
        </Button>
      </div>
    </div>
  );
}
