import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProblems, getProblem, submitSolution } from "../services/api";
import CodeEditor from "../components/CodeEditor";
import ProblemDescription from "../components/ProblemDescription";
import StepSidebar from "../components/StepSidebar";
import TestResults from "../components/TestResults";

export default function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(() =>
    JSON.parse(localStorage.getItem("completedSteps") || "[]")
  );

  useEffect(() => {
    getProblems().then(setProblems).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    setResults(null);
    setShowHints(false);
    getProblem(id)
      .then((p) => {
        setProblem(p);
        const savedCode = localStorage.getItem(`code_${id}`);
        setCode(savedCode || p.starterCode);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleCodeChange = useCallback(
    (value) => {
      setCode(value);
      localStorage.setItem(`code_${id}`, value);
    },
    [id]
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    setResults(null);
    try {
      const result = await submitSolution(id, code);
      setResults(result);

      if (result.allPassed && !completedSteps.includes(id)) {
        const updated = [...completedSteps, id];
        setCompletedSteps(updated);
        localStorage.setItem("completedSteps", JSON.stringify(updated));
      }
    } catch (err) {
      setResults({
        compiled: false,
        errors: [
          {
            message:
              err.response?.data?.message || "Server error. Is the backend running?",
          },
        ],
        testResults: [],
        allPassed: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (problem) {
      setCode(problem.starterCode);
      localStorage.removeItem(`code_${id}`);
      setResults(null);
    }
  };

  const sameLevelProblems = useMemo(() => {
    if (!problem) return [];
    return problems
      .filter((p) => p.difficulty === problem.difficulty)
      .sort((a, b) => a.stepInLevel - b.stepInLevel);
  }, [problems, problem]);

  const nextInLevel = useMemo(() => {
    if (!problem) return null;
    return sameLevelProblems.find(
      (p) => p.stepInLevel === problem.stepInLevel + 1
    );
  }, [sameLevelProblems, problem]);

  const handleNextStep = () => {
    if (nextInLevel) {
      navigate(`/problem/${nextInLevel._id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Problem not found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <StepSidebar problems={problems} completedSteps={completedSteps} />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-1 min-h-0">
          <div className="w-1/2 border-r border-gray-800 overflow-hidden">
            <ProblemDescription
              problem={problem}
              hints={showHints}
              showHints={() => setShowHints(true)}
            />
          </div>

          <div className="w-1/2 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/50">
              <span className="text-xs text-gray-500 font-medium">
                Contract.sol
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors cursor-pointer"
                >
                  {submitting ? "Testing..." : "Submit"}
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor value={code} onChange={handleCodeChange} />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 bg-gray-900/50 max-h-64 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between px-4 pt-3 pb-0">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Test Results
            </span>
            {results?.allPassed && nextInLevel && (
              <button
                onClick={handleNextStep}
                className="px-4 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer"
              >
                Next Challenge →
              </button>
            )}
          </div>
          <TestResults results={results} loading={submitting} />
        </div>
      </div>
    </div>
  );
}
