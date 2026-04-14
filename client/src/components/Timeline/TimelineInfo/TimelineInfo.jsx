import { usePlayHeadPosition } from '@/store';

export function TimelineInfo() {
  const playHeadPosition = usePlayHeadPosition();

  return (
    <div className="mb-4 text-sm font-medium text-muted-foreground mt-3">
      Position: {playHeadPosition}s
    </div>
  );
}
