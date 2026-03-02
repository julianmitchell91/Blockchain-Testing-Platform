import { Router } from "express";
import Problem from "../models/Problem.js";

const router = Router();

const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 };

router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find()
      .select("stepInLevel title difficulty description estimatedMinutes")
      .lean();

    problems.sort((a, b) => {
      const d = DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
      return d !== 0 ? d : a.stepInLevel - b.stepInLevel;
    });

    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select(
      "-solutionCode -testCases.testCode"
    );
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
