export default function TestResults({ results, loading }) {
  if (loading) {
    return (
      <div className="p-4 flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-400">
          Compiling and running tests...
        </span>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Submit your code to see test results.
      </div>
    );
  }

  if (!results.compiled) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-sm font-medium text-red-400">
            Compilation Failed
          </span>
        </div>
        <div className="space-y-2">
          {results.errors?.map((err, i) => (
            <pre
              key={i}
              className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap"
            >
              {err.message}
            </pre>
          ))}
        </div>
      </div>
    );
  }

  const passCount = results.testResults.filter((t) => t.passed).length;
  const total = results.testResults.length;
  const allPassed = results.allPassed;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${allPassed ? "bg-emerald-500" : "bg-red-500"}`}
          />
          <span
            className={`text-sm font-medium ${allPassed ? "text-emerald-400" : "text-red-400"}`}
          >
            {allPassed ? "All Tests Passed!" : "Some Tests Failed"}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {passCount}/{total} passed
        </span>
      </div>

      {results.warnings?.length > 0 && (
        <div className="mb-3 space-y-1">
          {results.warnings.map((w, i) => (
            <div
              key={i}
              className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2"
            >
              {w}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {results.testResults.map((test, i) => (
          <div
            key={i}
            className={`rounded-lg border p-3 ${
              test.passed
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-red-500/5 border-red-500/20"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {test.passed ? (
                  <span className="text-emerald-400">PASS</span>
                ) : (
                  <span className="text-red-400">FAIL</span>
                )}
              </span>
              <span className="text-sm text-gray-300">{test.name}</span>
            </div>
            {test.error && (
              <pre className="mt-2 text-xs text-red-300 bg-red-500/10 rounded p-2 overflow-x-auto whitespace-pre-wrap">
                {test.error}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
