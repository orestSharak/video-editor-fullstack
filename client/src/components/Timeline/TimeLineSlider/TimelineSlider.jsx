import { usePlayHeadPosition, useSetPlayHeadPosition } from '@/store';
import { Slider } from '@/components';
import { MAX_TIMELINE_DURATION } from '@/constants';

export function TimelineSlider() {
  const playHeadPosition = usePlayHeadPosition();
  const setPlayHeadPosition = useSetPlayHeadPosition();

  return (
    <div className="-ml-[6px]">
      <Slider
        value={[playHeadPosition]}
        max={MAX_TIMELINE_DURATION}
        onValueChange={(vals) => setPlayHeadPosition(vals[0])}
        className="cursor-pointer z-50"
      />
    </div>
  );
}
