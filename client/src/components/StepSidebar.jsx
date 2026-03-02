import { Link, useParams } from "react-router-dom";

const sectionConfig = {
  easy: { label: "Easy", color: "text-emerald-400" },
  medium: { label: "Medium", color: "text-amber-400" },
  hard: { label: "Hard", color: "text-red-400" },
};

function groupByDifficulty(problems) {
  return {
    easy: problems
      .filter((p) => p.difficulty === "easy")
      .sort((a, b) => a.stepInLevel - b.stepInLevel),
    medium: problems
      .filter((p) => p.difficulty === "medium")
      .sort((a, b) => a.stepInLevel - b.stepInLevel),
    hard: problems
      .filter((p) => p.difficulty === "hard")
      .sort((a, b) => a.stepInLevel - b.stepInLevel),
  };
}

function isUnlockedCheck(problem, levelProblems, completedSteps) {
  if (problem.stepInLevel === 1) return true;
  const prev = levelProblems.find(
    (p) => p.stepInLevel === problem.stepInLevel - 1
  );
  return prev && completedSteps.includes(prev._id);
}

export default function StepSidebar({ problems, completedSteps }) {
  const { id } = useParams();
  const grouped = groupByDifficulty(problems);

  return (
    <div className="w-64 shrink-0 border-r border-gray-800 bg-gray-900/50 overflow-y-auto custom-scrollbar">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Challenges
        </h2>
        <nav className="space-y-4">
          {["easy", "medium", "hard"].map((difficulty) => {
            const levelProblems = grouped[difficulty];
            const cfg = sectionConfig[difficulty];

            return (
              <div key={difficulty}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  <span className="text-xs text-gray-700">
                    {levelProblems.filter((p) => completedSteps.includes(p._id)).length}
                    /{levelProblems.length}
                  </span>
                </div>
                <div className="space-y-1">
                  {levelProblems.map((problem) => {
                    const isCompleted = completedSteps.includes(problem._id);
                    const unlocked = isUnlockedCheck(
                      problem,
                      levelProblems,
                      completedSteps
                    );
                    const isActive = id === problem._id;

                    return (
                      <Link
                        key={problem._id}
                        to={unlocked ? `/problem/${problem._id}` : "#"}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                          isActive
                            ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                            : unlocked
                              ? "text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent"
                              : "text-gray-600 cursor-not-allowed border border-transparent"
                        }`}
                        onClick={(e) => !unlocked && e.preventDefault()}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                            isCompleted
                              ? "bg-emerald-500/20 text-emerald-400"
                              : isActive
                                ? "bg-violet-500/20 text-violet-400"
                                : unlocked
                                  ? "bg-gray-800 text-gray-400"
                                  : "bg-gray-800/50 text-gray-700"
                          }`}
                        >
                          {isCompleted ? "\u2713" : problem.stepInLevel}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate">{problem.title}</div>
                          <div className="text-xs text-gray-600">
                            {problem.estimatedMinutes
                              ? `~${problem.estimatedMinutes}m`
                              : ""}
                          </div>
                        </div>
                        {!unlocked && (
                          <svg
                            className="w-3.5 h-3.5 ml-auto text-gray-700 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
