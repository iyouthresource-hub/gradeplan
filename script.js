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

  // Build one session for each hour of weekly study time across each added subject.
  const sessions = [];
  subjects.forEach((subject) => {
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
    const dayIndex = index % weekDays.length;
    const day = weekDays[dayIndex];
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

  const planGrid = document.createElement('div');
  planGrid.className = 'section-grid';

  Object.entries(schedule).forEach(([day, sessions]) => {
    const card = document.createElement('div');
    card.className = 'card';

    const dayTitle = document.createElement('h3');
    dayTitle.textContent = day;
    card.appendChild(dayTitle);

    if (sessions.length === 0) {
      const emptyNote = document.createElement('p');
      emptyNote.className = 'placeholder';
      emptyNote.textContent = 'No study sessions scheduled.';
      card.appendChild(emptyNote);
    } else {
      const list = document.createElement('ul');
      list.style.paddingInlineStart = '1.2rem';
      list.style.margin = '0';

      sessions.forEach((session) => {
        const item = document.createElement('li');
        item.textContent = `${session.subject} (${session.difficulty}) - Exam: ${session.examDate}`;
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
