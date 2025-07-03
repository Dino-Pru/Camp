let currentBgIndex = 0;
let bgImages = [];

function startApp() {
  for (let i = 1; i <= 7; i++) {
    bgImages.push(`images/${i}.jpeg`);
  }
  rotateBackground();
  showTab("home");
}

function rotateBackground() {
  const imgElement = document.getElementById("carouselImage");
  setInterval(() => {
    currentBgIndex = (currentBgIndex + 1) % bgImages.length;
    imgElement.src = bgImages[currentBgIndex];
  }, 4000);
}

function showTab(tabId) {
  document
    .querySelectorAll(".tab-panel")
    .forEach((el) => el.classList.remove("show"));
  document.querySelector(`#${tabId}`).classList.add("show");

  document
    .querySelectorAll(".tab-bar button")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`tab-${tabId}`).classList.add("active");
}

function toggleMenu() {
  document.getElementById("tabMenu").classList.toggle("show");
}

function calculateCosts() {
  const total = parseInt(document.getElementById("totalPersons").value);
  const under5 = parseInt(document.getElementById("under5").value);

  if (isNaN(total) || total < 1) {
    alert("Please enter number of people.");
    return;
  }

  const foodPerPerson = 70 * 5; // R70 per meal, 5 meals = R350
  const foodCost = total * foodPerPerson;

  const entertainmentCost = total * 200;

  const nights = 2;
  const costMap = {
    1: 580,
    2: 580,
    3: 810,
    4: 1040,
    5: 1270,
    6: 1500,
    7: 1730,
    8: 1960,
  };
  const baseRate = costMap[total] || 1960 + (total - 8) * 230;
  const accommodation = baseRate * nights;

  const totalEstimate = foodCost + entertainmentCost + accommodation;

  const html = `
    <h3>Estimated Costs</h3>
    <p>Food (R70 x 5 meals per person): <strong>R${foodCost.toFixed(
      2
    )}</strong></p>
    <p>Entertainment Fee (R200 per person): <strong>R${entertainmentCost.toFixed(
      2
    )}</strong></p>
    <p>Accommodation (2 nights): <strong>R${accommodation.toFixed(
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
