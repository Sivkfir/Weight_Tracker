const targetWeightElement = document.getElementById('targetWeight');
const progress = JSON.parse(localStorage.getItem('progress')) || {};

// Load target weight from localStorage or default to 60
let targetWeight = parseFloat(localStorage.getItem('targetWeight')) || 60;
updateTargetWeightDisplay();

function updateProgress() {
  const nameInput = document.getElementById('name').value.trim();
  const weightLossInput = document.getElementById('weightLoss').value;
  const weekInput = document.getElementById('week').value;

  if (!nameInput) {
    alert('נא להזין שם');
    return;
  }
  if (!weightLossInput || weightLossInput <= 0) {
    alert('נא להזין כמות ירידה חיובית');
    return;
  }
  if (!weekInput || weekInput <= 0) {
    alert('נא לבחור שבוע חיובי');
    return;
  }

  const weightLoss = parseFloat(weightLossInput);
  const week = parseInt(weekInput, 10);

  // Ensure progress structure for the name
  if (!progress[nameInput]) {
    progress[nameInput] = [];
  }
  progress[nameInput][week - 1] = (progress[nameInput][week - 1] || 0) + weightLoss;
  localStorage.setItem('progress', JSON.stringify(progress));

  // Update target weight
  targetWeight = 60 - Object.values(progress)
    .flat()
    .reduce((acc, curr) => acc + (curr || 0), 0);
  updateTargetWeightDisplay();

  // Update feedback
  const feedback = document.getElementById('feedback');
  feedback.textContent = `כל הכבוד, ${nameInput}! ירדת ${weightLoss.toFixed(1)} ק"ג בשבוע ${week}!`;
  feedback.style.color = 'green';

  // Update history
  updateHistory();
}

function resetProgress() {
  // Reset target weight and progress
  targetWeight = 60;
  Object.keys(progress).forEach(name => {
    progress[name] = [];
  });
  localStorage.setItem('progress', JSON.stringify(progress));
  localStorage.setItem('targetWeight', targetWeight);

  // Update UI
  updateTargetWeightDisplay();
  updateHistory();

  const feedback = document.getElementById('feedback');
  feedback.textContent = 'האיפוס הושלם!';
  feedback.style.color = 'blue';
}

function updateTargetWeightDisplay() {
  targetWeightElement.textContent = targetWeight.toFixed(1);
  localStorage.setItem('targetWeight', targetWeight.toFixed(1));
}

function updateHistory() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  Object.entries(progress).forEach(([name, values]) => {
    values.forEach((loss, index) => {
      if (loss > 0) {
        const listItem = document.createElement('li');
        listItem.textContent = `${name} - שבוע ${index + 1}: ירידה של ${loss.toFixed(1)} ק"ג`;
        historyList.appendChild(listItem);
      }
    });
  });
}

// Initialize app
updateHistory();
