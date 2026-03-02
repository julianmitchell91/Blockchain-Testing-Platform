import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    testCode: { type: String, required: true },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    stepInLevel: { type: Number, required: true },
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    estimatedMinutes: { type: Number, required: true },
    description: { type: String, required: true },
    starterCode: { type: String, required: true },
    solutionCode: { type: String, required: true },
    constructorArgs: { type: [mongoose.Schema.Types.Mixed], default: [] },
    testCases: [testCaseSchema],
    hints: [String],
  },
  { timestamps: true }
);

problemSchema.index({ difficulty: 1, stepInLevel: 1 }, { unique: true });

export default mongoose.model("Problem", problemSchema);
