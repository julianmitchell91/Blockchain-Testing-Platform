import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProblems } from "../services/api";

const difficultyConfig = {
  easy: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/10",
    header: "text-emerald-400",
    label: "Easy",
  },
  medium: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    glow: "group-hover:shadow-amber-500/10",
    header: "text-amber-400",
    label: "Medium",
  },
  hard: {
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
    glow: "group-hover:shadow-red-500/10",
    header: "text-red-400",
    label: "Hard",
  },
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

function isUnlocked(problem, levelProblems, completedSteps) {
  if (problem.stepInLevel === 1) return true;
  const prev = levelProblems.find(
    (p) => p.stepInLevel === problem.stepInLevel - 1
  );
  return prev && completedSteps.includes(prev._id);
}

export default function HomePage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const completedSteps = JSON.parse(
    localStorage.getItem("completedSteps") || "[]"
  );

  useEffect(() => {
    getProblems()
      .then(setProblems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8">
          <h2 className="text-lg font-semibold text-red-400 mb-2">
            Failed to Load Challenges
          </h2>
          <p className="text-sm text-gray-400">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            Make sure the API server is running.
          </p>
        </div>
      </div>
    );
  }

  const grouped = groupByDifficulty(problems);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
          Blockchain Developer
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}
            Challenges
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Sharpen your Solidity skills with hands-on smart contract challenges.
          Each difficulty level is independent — complete steps sequentially
          within a level. Your progress is saved locally.
        </p>
      </div>

      <div className="prose prose-2xl flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          <span className="text-xs text-gray-500">
            Completed ({completedSteps.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-500/50" />
          <span className="text-xs text-gray-500">Unlocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-700" />
          <span className="text-xs text-gray-500">Locked</span>
        </div>
      </div>

      <div className="space-y-10">
        {["easy", "medium", "hard"].map((difficulty) => {
          const levelProblems = grouped[difficulty];
          const config = difficultyConfig[difficulty];

          return (
            <section key={difficulty}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className={`text-xl font-bold ${config.header}`}>
                  {config.label}
                </h2>
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-xs text-gray-600">
                  {levelProblems.filter((p) => completedSteps.includes(p._id)).length}
                  /{levelProblems.length} completed
                </span>
              </div>

              <div className="space-y-3">
                {levelProblems.map((problem) => {
                  const isCompleted = completedSteps.includes(problem._id);
                  const unlocked = isUnlocked(
                    problem,
                    levelProblems,
                    completedSteps
                  );

                  return (
                    <Link
                      key={problem._id}
                      to={unlocked ? `/problem/${problem._id}` : "#"}
                      onClick={(e) => !unlocked && e.preventDefault()}
                      className={`group block rounded-xl border transition-all duration-200 ${
                        isCompleted
                          ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
                          : unlocked
                            ? "bg-gray-900/50 border-gray-800 hover:border-violet-500/40 hover:bg-gray-900"
                            : "bg-gray-900/30 border-gray-800/50 opacity-60 cursor-not-allowed"
                      } ${unlocked ? `hover:shadow-lg ${config.glow}` : ""}`}
                    >
                      <div className="flex items-center gap-4 p-5">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                            isCompleted
                              ? "bg-emerald-500/20 text-emerald-400"
                              : unlocked
                                ? "bg-gray-800 text-gray-300"
                                : "bg-gray-800/50 text-gray-700"
                          }`}
                        >
                          {isCompleted ? (
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            problem.stepInLevel
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-white truncate">
                              {problem.title}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 text-xs font-medium rounded-full border shrink-0 ${config.badge}`}
                            >
                              {problem.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            Step {problem.stepInLevel} of{" "}
                            {levelProblems.length}
                            {problem.estimatedMinutes &&
                              ` · ~${problem.estimatedMinutes} min`}
                            {isCompleted && " — Completed"}
                          </p>
                        </div>

                        {!unlocked && (
                          <svg
                            className="w-5 h-5 text-gray-700 shrink-0"
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

                        {unlocked && !isCompleted && (
                          <svg
                            className="w-5 h-5 text-gray-600 group-hover:text-violet-400 transition-colors shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
