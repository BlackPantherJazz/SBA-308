// CourseInfo
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// AssignmentGroup
const AssignmentGroup = {
  id: 125,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    { id: 1, name: "Declare a Variable", due_at: "2023-01-25", points_possible: 50 },
    { id: 2, name: "Write a Function",   due_at: "2023-02-27", points_possible: 150 },
    { id: 3, name: "Code the World",     due_at: "3500-11-15", points_possible: 500 }
  ]
};

// LearnerSubmissions
const LearnerSubmissions = [
  { learner_id: 125, assignment_id: 1, submission: { submitted_at: "2023-01-25", score: 47 } },
  { learner_id: 125, assignment_id: 2, submission: { submitted_at: "2023-02-12", score: 150 } },
  { learner_id: 125, assignment_id: 3, submission: { submitted_at: "2023-01-25", score: 400 } },
  { learner_id: 132, assignment_id: 1, submission: { submitted_at: "2023-01-24", score: 39 } },
  { learner_id: 132, assignment_id: 2, submission: { submitted_at: "2023-03-07", score: 140 } }
];

function getLearnerData(course, ag, submissions) {                             
  if (ag.course_id !== course.id) {
    throw new Error("AssignmentGroup does not belong to this course.");
  }
  const today = new Date();

  // Helper: is this assignment due yet?
  function isDue(assignment) {
    return new Date(assignment.due_at) <= today;
  }
  function getAdjustedScore(submission, assignment) {
    let score = submission.submission.score;
    const submittedAt = new Date(submission.submission.submitted_at);
    const dueAt = new Date(assignment.due_at);

    if (submittedAt > dueAt) {
      score -= assignment.points_possible * 0.10; // 10% penalty
    }
    return score;
  }
  function getPercentage(score, pointsPossible) {
    if (pointsPossible === 0) {
      console.error("points_possible cannot be 0. skipping assignment.");
      return null;
    }
    return score / pointsPossible;
  }
  const results = {};

  for (const sub of submissions) {
    // Find the matching assignment
    let assignment = null;
    for (let i = 0; i < ag.assignments.length; i++) {
      if (ag.assignments[i].id === sub.assignment_id) {
        assignment = ag.assignments[i];
        break; 
      }
    }

    // Skip if assignment not found or not yet due
    if (!assignment || !isDue(assignment)) continue;

    // Try/catch for unexpected bad data
    try {
      const adjustedScore = getAdjustedScore(sub, assignment);
      const pct = getPercentage(adjustedScore, assignment.points_possible);
      if (pct === null) continue;

      const id = sub.learner_id;

      // Initialize learner object if we haven't seen them yet
      if (!results[id]) {
        results[id] = { id: id, totalScore: 0, totalPossible: 0 };
      }

      results[id][sub.assignment_id] = pct;
      results[id].totalScore += adjustedScore;
      results[id].totalPossible += assignment.points_possible;

    } catch (err) {
      console.error("Error processing submission:", err);
    }
  }
  const output = [];

  for (const learnerId in results) {
    const learner = results[learnerId];
    const avg = learner.totalScore / learner.totalPossible;

    // Build the final object — remove internal tracking props
    const learnerResult = { id: learner.id, avg: avg };

    for (const key in learner) {
      if (key !== "id" && key !== "totalScore" && key !== "totalPossible") {
        learnerResult[key] = learner[key];
      }
    }

    output.push(learnerResult);
  }

  return output;

}
try {
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  console.log(result);
} catch (err) {
  console.error(err.message);
}