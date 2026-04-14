import { MAX_TIMELINE_DURATION } from '@/constants';

export function TimeRuler() {
  const steps = [];
  // Generate time grid for each 5s
  for (let i = 0; i <= MAX_TIMELINE_DURATION; i += 5) {
    steps.push(i);
  }

  return (
    <div className="relative h-6 w-full border-b bg-white overflow-hidden select-none">
      {steps.map((step) => (
        <div
          key={step}
          className="absolute top-0 h-full border-l border-slate-300 flex flex-col justify-end"
          style={{ left: `${(step / MAX_TIMELINE_DURATION) * 100}%` }}
        >
          <span
            className={`text-[10px] mb-0.5 text-slate-500 ${
              step === 0 ? 'ml-1' : step === MAX_TIMELINE_DURATION ? '-ml-5' : '-ml-2'
            }`}
          >
            {step}s
          </span>
        </div>
      ))}
    </div>
  );
}
