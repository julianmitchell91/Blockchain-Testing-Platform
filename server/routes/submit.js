import { Router } from "express";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import { runTests } from "../services/testRunner.js";

const router = Router();

router.post("/:id/submit", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ message: "Code is required" });
    }

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const result = await runTests(
      code,
      problem.testCases,
      problem.constructorArgs
    );

    await Submission.create({
      problemId: problem._id,
      code,
      passed: result.allPassed,
      testResults: result.testResults,
    });

    res.json({
      compiled: result.compiled,
      errors: result.errors || [],
      warnings: result.warnings || [],
      testResults: result.testResults,
      allPassed: result.allPassed,
    });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ message: "Internal server error during testing" });
  }
});

export default router;
