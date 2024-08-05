const cardsAll = document.querySelector(".cards-all");
const btnContainer = document.querySelector(".btn-container");
const clearBtn = document.querySelector(".clear");
const filteredCard = document.querySelector(".filtered-card");

let dataArray = [];
let filteredCardBtnsArray = []; // Change const to let here

// Fetch the data
const fetchData = async () => {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    dataArray.push(...data);
    displayMainCards();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const displayMainCards = () => {
  dataArray.map((item) => {
    const card = document.createElement("div");
    card.setAttribute("class", "card container");
    card.innerHTML = `<div class="card-main">
        <div class="logo">
          <img src=${item.logo} alt="" />
        </div>
        <div class="card-main-top">
          <div class="company">${item.company}</div>
        </div>
        <div class="card-main-position position">
          <h1>${item.position}</h1>
        </div>
        <div class="card-main-bottom">
          <div class="postedAt">${item.postedAt}</div>
          <div class="dot"></div>
          <div class="contract">${item.contract}</div>
          <div class="dot"></div>
          <div class="location">${item.location}</div>
        </div>
      </div>
      <div class="card-languages">
        ${item.new ? `<button class="btn-new">new!</button>` : ''}
        ${item.featured ? `<button class="btn-featured">Featured</button>` : ''}
        ${[item.role, item.level, ...item.languages, ...item.tools].map(type => `
          <button class="btn-main-card" data-type="${type}">${type}</button>
        `).join('')}
      </div>`;

    cardsAll.appendChild(card);
  });

  // Attach click event listeners to buttons
  const btns = Array.from(document.querySelectorAll(".btn-main-card"));
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const thisBtn = btn.dataset.type;
      if (!filteredCardBtnsArray.includes(thisBtn)) {
        filteredCardBtnsArray.push(thisBtn);
        displayFilteredCard();
      }
      updateMainCard();
    });
  });
};

const displayFilteredCard = () => {
  btnContainer.innerHTML = "";
  filteredCardBtnsArray.forEach((selectedBtn) => {
    const btnFiltered = document.createElement("div");
    btnFiltered.setAttribute("class", "btn-filtered");
    btnFiltered.innerHTML = `<div>${selectedBtn}</div>
            <button class="btn-remove">
              <img src="images/icon-remove.svg" alt="" />
            </button>`;
    btnContainer.appendChild(btnFiltered);
  });

  filteredCard.style.visibility = filteredCardBtnsArray.length ? "visible" : "hidden";

  // Add event listeners for remove buttons
  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const btnText = btn.parentElement.querySelector('div').textContent;
      filteredCardBtnsArray = filteredCardBtnsArray.filter(text => text !== btnText);
      displayFilteredCard();
      updateMainCard();
    });
  });
};

const updateMainCard = () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const mainCardBtns = card.querySelectorAll(".btn-main-card");
    const arrayOfAllBtnsInMainCard = Array.from(mainCardBtns).map(btn => btn.dataset.type);

    const shouldShow = filteredCardBtnsArray.every(btn => arrayOfAllBtnsInMainCard.includes(btn));
    card.classList.toggle("remove", !shouldShow);
  });
};

clearBtn.addEventListener("click", () => {
  filteredCardBtnsArray = []; // Clear the filter array
  btnContainer.innerHTML = ""; // Clear out the btnContainer
  filteredCard.style.visibility = "hidden"; // Hide the filtered card
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.classList.remove("remove"); // Remove the remove class from all cards
  });
});

fetchData();
