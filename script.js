// The provided course information.

const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1, 
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

function getLearnerData(course, ag, submissions){
      try {
        
        if (ag.course_id !== course.id) {
            throw new Error("Invalid course_id in AssignmentGroup");
        }

       
        let learnerData = {};

        submissions.forEach(submission => {
            const learnerId = submission.learner_id;
            const assignmentId = submission.assignment_id;
            const score = submission.submission.score;
            const submittedAt = new Date(submission.submission.submitted_at);

            
            const assignment = ag.assignments.find(a => a.id === assignmentId);

            if (!assignment) {
                throw new Error(`Assignment with ID ${assignmentId} not found`);
            }

            const dueAt = new Date(assignment.due_at);
            const pointsPossible = assignment.points_possible;

            //  not yet due
            if (submittedAt > dueAt) {
                           }

            // Deduct 10%  submission is late
            let finalScore = score;
            if (submittedAt > dueAt) {
                finalScore -= pointsPossible * 0.1;
            }

            // Initialize learner data 
            if (!learnerData[learnerId]) {
                learnerData[learnerId] = {
                    id: learnerId,
                    avg: 0,
                    totalPoints: 0,
                    totalPossiblePoints: 0
                };
            }

            // Calculate the percentage score 
            const percentage = (finalScore / pointsPossible) * 100;

            // Add the score 
            learnerData[learnerId][assignmentId] = percentage;

            // weighted average calculation
            learnerData[learnerId].totalPoints += finalScore;
            learnerData[learnerId].totalPossiblePoints += pointsPossible;
        });

        // Calculate the weighted average for each learner
        Object.keys(learnerData).forEach(learnerId => {
            const learner = learnerData[learnerId];
            learner.avg = (learner.totalPoints / learner.totalPossiblePoints) * 100;
            delete learner.totalPoints;
            delete learner.totalPossiblePoints;
        });

       
        return Object.values(learnerData);

    } catch (error) {
        console.error("An error occurred:", error.message);
        return [];
    }
}
function renderResultToHTML(result) {
  const container = document.getElementById('resultsContainer');
  container.innerHTML = ''; 
  
  result.forEach(learner => {
      const learnerDiv = document.createElement('div');
      learnerDiv.className = 'learner';

      let assignmentsHTML = '';
      Object.keys(learner).forEach(key => {
          if (key !== 'id' && key !== 'avg') {
              assignmentsHTML += `<p>Assignment ${key}: ${learner[key].toFixed(2)}%</p>`;
          }
      });

      learnerDiv.innerHTML = `
          <h3>Learner ID: ${learner.id}</h3>
          <p>Average Score: ${learner.avg.toFixed(2)}%</p>
          ${assignmentsHTML}
      `;
      

      container.appendChild(learnerDiv);
  });
}


const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

renderResultToHTML(result);

console.log(result); 
