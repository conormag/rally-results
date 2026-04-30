export default function StagePicker({ stages, currentStage, onSelect }) {
  return (
    <div className="flex gap-3 max-w-5xl overflow-x-auto mb-8 pb-2 pl-10">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full font-bold transition ${!currentStage ? 'bg-red-600' : 'bg-slate-200'}`}
      >
        Overall
      </button>
      {stages?.map(s => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`px-4 py-2 rounded-full font-bold transition ${currentStage === s.id ? 'bg-red-600' : 'bg-slate-200'}`}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}