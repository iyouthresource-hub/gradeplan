const studentNameInput = document.getElementById('student-name');
const subjectNameInput = document.getElementById('subject-name');
const difficultyInput = document.getElementById('difficulty');
const weeklyHoursInput = document.getElementById('weekly-hours');
const examDateInput = document.getElementById('exam-date');

const addSubjectButton = document.querySelector('section[aria-labelledby="setup-heading"] button');
const generatePlanButton = document.querySelector('section[aria-labelledby="plan-heading"] button');
const subjectsListElement = document.getElementById('subjects-list');
const studyPlanElement = document.getElementById('study-plan');

const subjects = [];
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function createSubjectCard(subject) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div>
      <strong>${subject.name}</strong>
      <p>Difficulty: ${subject.difficulty}</p>
      <p>Weekly hours: ${subject.hours}</p>
      <p>Exam date: ${subject.examDate}</p>
    </div>
    <button type="button" data-id="${subject.id}" class="button-secondary">Remove</button>
  `;

  const removeButton = card.querySelector('button');
  removeButton.addEventListener('click', () => removeSubject(subject.id));

  return card;
}

function renderSubjects() {
  subjectsListElement.innerHTML = '';

  if (subjects.length === 0) {
    subjectsListElement.innerHTML = '<p class="placeholder">No subjects added yet.</p>';
    return;
  }

  const list = document.createElement('div');
  list.className = 'section-grid';

  subjects.forEach((subject) => {
    const card = createSubjectCard(subject);
    list.appendChild(card);
  });

  subjectsListElement.appendChild(list);
}

function removeSubject(subjectId) {
  const index = subjects.findIndex((subject) => subject.id === subjectId);
  if (index === -1) {
    return;
  }

  subjects.splice(index, 1);
  renderSubjects();
  studyPlanElement.innerHTML = '<p class="placeholder">Your generated study plan will appear here.</p>';
}

function validateSubjectInputs() {
  const name = subjectNameInput.value.trim();
  const hours = parseInt(weeklyHoursInput.value, 10);
  const examDate = examDateInput.value;

  if (!name) {
    alert('Please enter a subject name.');
    return false;
  }

  if (!weeklyHoursInput.value || Number.isNaN(hours) || hours < 1) {
    alert('Please enter weekly study hours as a number greater than 0.');
    return false;
  }

  if (!examDate) {
    alert('Please select an exam date.');
    return false;
  }

  return true;
}

function handleAddSubject() {
  if (!validateSubjectInputs()) {
    return;
  }

  const newSubject = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: subjectNameInput.value.trim(),
    difficulty: difficultyInput.value,
    hours: parseInt(weeklyHoursInput.value, 10),
    examDate: examDateInput.value,
  };

  subjects.push(newSubject);
  renderSubjects();
  subjectNameInput.value = '';
  weeklyHoursInput.value = '';
  examDateInput.value = '';
  subjectNameInput.focus();
}

function buildWeeklySchedule() {
  if (subjects.length === 0) {
    alert('Please add at least one subject before generating a study plan.');
    return;
  }

  const sessions = [];
  subjects
    .slice()
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
    .forEach((subject) => {
      for (let i = 0; i < subject.hours; i += 1) {
        sessions.push({
          subject: subject.name,
          difficulty: subject.difficulty,
          examDate: subject.examDate,
        });
      }
    });

  const schedule = weekDays.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {});

  sessions.forEach((session, index) => {
    const dayIndex = Math.floor((index * weekDays.length) / sessions.length);
    const day = weekDays[Math.min(dayIndex, weekDays.length - 1)];
    schedule[day].push(session);
  });

  return schedule;
}

function renderStudyPlan() {
  const schedule = buildWeeklySchedule();
  if (!schedule) {
    return;
  }

  studyPlanElement.innerHTML = '';

  const summaryCard = document.createElement('div');
  summaryCard.className = 'card';
  const studentName = studentNameInput.value.trim() || 'Student';
  const totalHours = subjects.reduce((sum, subject) => sum + subject.hours, 0);
  summaryCard.innerHTML = `
    <h3>Weekly Study Plan for ${studentName}</h3>
    <p>${totalHours} total study hours assigned across ${weekDays.length} days.</p>
  `;
  studyPlanElement.appendChild(summaryCard);

  const planGrid = document.createElement('div');
  planGrid.className = 'section-grid';

  Object.entries(schedule).forEach(([day, sessions]) => {
    const card = document.createElement('div');
    card.className = 'card';

    const dayHeader = document.createElement('div');
    dayHeader.style.display = 'flex';
    dayHeader.style.justifyContent = 'space-between';
    dayHeader.style.alignItems = 'baseline';

    const dayTitle = document.createElement('h3');
    dayTitle.textContent = day;
    dayTitle.style.margin = '0';

    const countLabel = document.createElement('span');
    countLabel.style.color = '#4b5563';
    countLabel.textContent = `${sessions.length} session${sessions.length === 1 ? '' : 's'}`;

    dayHeader.appendChild(dayTitle);
    dayHeader.appendChild(countLabel);
    card.appendChild(dayHeader);

    if (sessions.length === 0) {
      const emptyNote = document.createElement('p');
      emptyNote.className = 'placeholder';
      emptyNote.textContent = 'No study sessions scheduled.';
      card.appendChild(emptyNote);
    } else {
      const list = document.createElement('ol');
      list.style.paddingInlineStart = '1.2rem';
      list.style.margin = '0.75rem 0 0';

      sessions.forEach((session, index) => {
        const item = document.createElement('li');
        item.style.marginBottom = '0.65rem';
        item.textContent = `${session.subject} - ${session.difficulty} (${session.examDate})`;
        list.appendChild(item);
      });

      card.appendChild(list);
    }

    planGrid.appendChild(card);
  });

  studyPlanElement.appendChild(planGrid);
}

addSubjectButton.addEventListener('click', handleAddSubject);
generatePlanButton.addEventListener('click', renderStudyPlan);

renderSubjects();
