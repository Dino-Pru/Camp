// Preload images to avoid flickering
const bgImages = Array.from({ length: 7 }, (_, i) => `images/${i + 1}.jpeg`);
let currentBgIndex = 0;

function preloadImages() {
  bgImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function startApp() {
  preloadImages();
  rotateBackground();
  showTab("home");
  loadSavedEstimate();
}

function rotateBackground() {
  const imgElement = document.getElementById("carouselImage");
  setInterval(() => {
    currentBgIndex = (currentBgIndex + 1) % bgImages.length;
    imgElement.style.opacity = 0;
    setTimeout(() => {
      imgElement.src = bgImages[currentBgIndex];
      imgElement.style.opacity = 1;
    }, 500);
  }, 4000);
}

function showTab(tabId) {
  document
    .querySelectorAll(".tab-panel")
    .forEach((el) => el.classList.remove("show"));
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) selectedTab.classList.add("show");

  document
    .querySelectorAll(".tab-bar button")
    .forEach((btn) => btn.classList.remove("active"));
  const selectedBtn = document.getElementById(`tab-${tabId}`);
  if (selectedBtn) selectedBtn.classList.add("active");

  if (window.innerWidth <= 768) {
    const menu = document.getElementById("tabMenu");
    menu.classList.remove("show");
    menu.style.right = "-100%";
  }
}

function toggleMenu() {
  const menu = document.getElementById("tabMenu");
  menu.classList.toggle("show");
  menu.style.right = menu.classList.contains("show") ? "0" : "-100%";
}

function calculateCosts() {
  const total = parseInt(document.getElementById("totalPersons").value, 10);
  const under5 = parseInt(document.getElementById("under5").value, 10) || 0;

  if (isNaN(total) || total < 1) {
    alert("Please enter a valid number of people (minimum 1).");
    return;
  }

  if (under5 > total) {
    alert("Number of kids under 5 cannot exceed total people.");
    return;
  }

  const foodPerPerson = 70 * 5; // R70 per meal, 5 meals
  const foodCost = (total - under5) * foodPerPerson; // Kids under 5 don't pay for food
  const entertainmentCost = total * 200;
  const nights = 2;

  const costMap = {
    1: 800,
    2: 800,
    3: 1050,
    4: 1300,
    5: 1550,
    6: 1800,
    7: 2050,
    8: 2300,
  };

  const baseRate = costMap[total] || 2300 + (total - 8) * 300;
  const accommodation = baseRate * nights;
  const totalEstimate = foodCost + entertainmentCost + accommodation;

  const html = `
    <h3>Estimated Costs</h3>
    <p>Food (R70 x 5 meals for ${
      total - under5
    } people): <strong>R${foodCost.toFixed(2)}</strong></p>
    <p>Entertainment Fee (R200 per person for ${total} people): <strong>R${entertainmentCost.toFixed(
    2
  )}</strong></p>
    <p>Accommodation (High Season x ${nights} nights for ${total} people): <strong>R${accommodation.toFixed(
    2
  )}</strong></p>
    <hr />
    <p><strong>Total Estimate: R${totalEstimate.toFixed(2)}</strong></p>
  `;

  document.getElementById("results").innerHTML = html;

  localStorage.setItem(
    "campingEstimate",
    JSON.stringify({
      total,
      under5,
      foodCost,
      entertainmentCost,
      accommodation,
      totalEstimate,
    })
  );
}

function loadSavedEstimate() {
  const saved = localStorage.getItem("campingEstimate");
  if (saved) {
    const { total, under5 } = JSON.parse(saved);
    document.getElementById("totalPersons").value = total;
    document.getElementById("under5").value = under5;
    calculateCosts();
  }
}

// Event delegation for tab clicks
document.getElementById("tabMenu").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const tabId = e.target.id.replace("tab-", "");
    showTab(tabId);
  }
});

// Initialize app
document.addEventListener("DOMContentLoaded", startApp);

