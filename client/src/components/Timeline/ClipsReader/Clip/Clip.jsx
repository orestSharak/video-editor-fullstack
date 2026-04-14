import { Tooltip, TooltipContent, TooltipTrigger } from '@/components';
import { useSelectedClipId, useSetSelectedClipId } from '@/store';
import { MAX_TIMELINE_DURATION } from '@/constants';
import { memo } from 'react';

export const Clip = memo(function Clip({ id, name, startTime, duration, track }) {
  const selectedClipId = useSelectedClipId();
  const isSelected = selectedClipId === id;
  const setSelectedClipId = useSetSelectedClipId();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedClipId(id);
    }
  };

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <div
          tabIndex="0"
          onClick={() => setSelectedClipId(id)}
          // Accessibility: Allow selection via Keyboard (Space or Enter)
          onKeyDown={(e) => handleKeyDown(e, id)}
          className={`absolute h-12 rounded flex items-center justify-center text-sm cursor-pointer transition-all select-none overflow-hidden
                ${
                  isSelected
                    ? 'bg-primary/40 ring-2 ring-inset ring-primary hover:opacity-80 focus:outline-none z-20'
                    : 'bg-primary/20 border border-primary/40 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary z-10'
                }
              `}
          style={{
            left: `${(startTime / MAX_TIMELINE_DURATION) * 100}%`,
            width: `${(duration / MAX_TIMELINE_DURATION) * 100}%`,
            // 8px (base top padding) + track * 52px (48px clip height [h-12] + 4px gap)
            top: `${(track || 0) * 52 + 8}px`,
          }}
        >
          <span className="truncate px-2">{name}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">{name}</TooltipContent>
    </Tooltip>
  );
});
