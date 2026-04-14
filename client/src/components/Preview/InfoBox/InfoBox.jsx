import { useClips, usePlayHeadPosition } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components';
import { useMemo } from 'react';

export function InfoBox() {
  const clips = useClips();
  const playHeadPosition = usePlayHeadPosition();

  const activeClips = useMemo(
    () =>
      clips.filter(
        (clip) =>
          playHeadPosition >= clip.startTime && playHeadPosition < clip.startTime + clip.duration,
      ),
    [clips, playHeadPosition],
  );

  return (
    <Card className="h-80 w-80 bg-white">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {activeClips.length ? 'Currently Playing' : 'No Active Clips'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {activeClips.map((clip) => (
          <div key={clip.id} className="bg-primary/20 px-3 py-1 rounded border text-sm">
            {clip.name}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
