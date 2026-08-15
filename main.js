const numbersContainer = document.getElementById("numbers");
const generateButton = document.getElementById("generateButton");
const copyButton = document.getElementById("copyButton");
const clearButton = document.getElementById("clearButton");
const historyList = document.getElementById("historyList");
const toast = document.getElementById("toast");

let currentNumbers = [];
let history = [];

function createLottoNumbers() {
  const numberPool = Array.from({ length: 45 }, (_, index) => index + 1);

  for (let i = numberPool.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [numberPool[i], numberPool[randomIndex]] = [numberPool[randomIndex], numberPool[i]];
  }

  return numberPool.slice(0, 6).sort((a, b) => a - b);
}

function getBallColor(number) {
  if (number <= 10) return "#f3b61f";
  if (number <= 20) return "#4d95e8";
  if (number <= 30) return "#ed6262";
  if (number <= 40) return "#7d8189";
  return "#48a76a";
}

function renderNumbers(numbers) {
  numbersContainer.innerHTML = "";

  numbers.forEach((number, index) => {
    const ball = document.createElement("span");
    ball.className = "ball";
    ball.textContent = number;
    ball.style.background = getBallColor(number);
    ball.style.animationDelay = `${index * 70}ms`;
    ball.setAttribute("aria-label", `${number}번`);
    numbersContainer.appendChild(ball);
  });
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    const empty = document.createElement("li");
    empty.className = "history-empty";
    empty.textContent = "아직 추천 기록이 없습니다.";
    historyList.appendChild(empty);
    return;
  }

  history.forEach((numbers, index) => {
    const item = document.createElement("li");
    item.className = "history-item";

    const label = document.createElement("span");
    label.textContent = `${index + 1}번째 추천`;

    const numberText = document.createElement("span");
    numberText.className = "history-number";
    numberText.textContent = numbers.join(" · ");

    item.append(label, numberText);
    historyList.appendChild(item);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

generateButton.addEventListener("click", () => {
  currentNumbers = createLottoNumbers();
  renderNumbers(currentNumbers);

  history.unshift(currentNumbers);
  history = history.slice(0, 5);
  renderHistory();

  copyButton.disabled = false;
  generateButton.textContent = "🎲 다시 추천받기";
});

copyButton.addEventListener("click", async () => {
  if (currentNumbers.length === 0) return;

  const text = currentNumbers.join(", ");

  try {
    await navigator.clipboard.writeText(text);
    showToast("번호를 복사했습니다.");
  } catch (error) {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = text;
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand("copy");
    temporaryInput.remove();
    showToast("번호를 복사했습니다.");
  }
});

clearButton.addEventListener("click", () => {
  history = [];
  renderHistory();
  showToast("추천 기록을 지웠습니다.");
});
