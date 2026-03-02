import Markdown from "react-markdown";

const difficultyColors = {
  easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function ProblemDescription({ problem, hints, showHints }) {
  if (!problem) return null;

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Step {problem.stepInLevel}
          {problem.estimatedMinutes ? ` · ~${problem.estimatedMinutes} min` : ""}
        </span>
        <span
          className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${difficultyColors[problem.difficulty]}`}
        >
          {problem.difficulty}
        </span>
      </div>

      <div className="prose prose-invert prose-sm max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-li:text-gray-300 prose-code:text-violet-300 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-strong:text-gray-100">
        <Markdown>{problem.description}</Markdown>
      </div>

      {problem.hints && problem.hints.length > 0 && (
        <div className="mt-6">
          <button
            onClick={showHints}
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
          >
            Show Hints
          </button>
          {hints && (
            <ul className="mt-3 space-y-2">
              {problem.hints.map((hint, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm text-gray-400 bg-gray-900/50 rounded-lg p-3 border border-gray-800"
                >
                  <span className="text-violet-400 font-medium shrink-0">
                    {i + 1}.
                  </span>
                  {hint}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
