import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: { type: String, required: true },
    passed: { type: Boolean, required: true },
    testResults: [
      {
        name: String,
        passed: Boolean,
        error: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
