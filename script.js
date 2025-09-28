// Create array of objects to hold events
const events = [
  { title: "Local Meetup", category: "Community", date: "2025-10-10" },
  { title: "Team Lunch", category: "Work", date: "2025-10-14" },
  { title: "Web Dev Meetup", category: "Work", date: "2025-11-16" },
  { title: "Final Exam Prep", category: "School", date: "2025-11-28" },
  { title: "WordPress Conf", category: "Community", date: "2025-12-05" },
  { title: "Book Club", category: "Audience", date: "2025-12-12" },
  { title: "React Study Session", category: "School", date: "2025-10-16" },
  { title: "Cinnamon Toast Day", category: "Community", date: "2025-10-20" },
  { title: "Web Dev Workshop", category: "Audience", date: "2025-11-02" },
  { title: "Meet and Greet", category: "Work", date: "2025-11-07" },
  { title: "Client Presentation", category: "Work", date: "2025-11-11" },
  { title: "Team Building Workshop", category: "Work", date: "2025-11-13" },
];

// Get DOM elements for updates
const $ulElement = document.querySelector(".list");
const $emptyElement = document.getElementById("empty");
const $searchElement = document.getElementById("search");
const $amountElement = document.getElementById("amount");
const $formElement = document.getElementById("form");
const $sortElement = document.getElementById("sort");
const $filterTab = document.querySelector(".close-filter-tab");

const fetchEvents = (arr) => {
  const frag = document.createDocumentFragment();
  $ulElement.textContent = "";

  // Show "No results" message if array is empty
  if (!arr.length) {
    $emptyElement.hidden = false;
    $amountElement.textContent = "0 results";
    return;
  }

  $emptyElement.hidden = true;

  const n = arr.length;
  $amountElement.textContent = `${n} result${n === 1 ? "" : "s"}`;

  // Loop through events to create card structure and add content from events array into html elements
  arr.forEach((e, i) => {
    const $liElement = document.createElement("li");
    const $articleElement = document.createElement("article");
    const $h3Element = document.createElement("h3");
    const $spanElement = document.createElement("span");
    const $timeElement = document.createElement("time");

    const options = { year: "numeric", month: "short", day: "numeric" };

    $h3Element.textContent = e.title;
    $spanElement.textContent = e.category;

    $timeElement.setAttribute("datetime", e.date);
    $timeElement.textContent = new Date(e.date).toLocaleDateString(
      undefined,
      options
    );

    $articleElement.append($h3Element, $spanElement, $timeElement);
    $liElement.appendChild($articleElement);
    $liElement.classList.add("list-item");

    /// Stagger item animations (each appears 0.1s after the previous)
    $liElement.style.animationDelay = `${i * 0.1}s`;
    frag.appendChild($liElement);
  });

  $ulElement.textContent = "";
  $ulElement.appendChild(frag);
};

const $selectElement = document.getElementById("events");

// Extract unique categories from events and sort alphabetically for dropdown
const categories = [...new Set(events.map((ev) => ev.category))].sort();

for (const cat of categories) {
  $selectElement.add(new Option(cat));
}

// Prevent form submission (keeps search/filter client-side only)
$formElement.addEventListener("submit", (e) => {
  e.preventDefault();
});

let currCategory = "";
let currSearch = "";

// Update UI when category changes
$selectElement.addEventListener("change", (evt) => {
  currCategory = evt.target.value;
  updateUI();
});

// Update UI on search input
$searchElement.addEventListener("input", (evt) => {
  currSearch = evt.target.value.trim().toLowerCase();
  updateUI();
});

// Update UI on sort

$sortElement.addEventListener("change", () => {
  updateUI();
});

// Create comparator functions for sort options
const comparators = {
  new: (a, b) => new Date(b.date) - new Date(a.date),
  old: (a, b) => new Date(a.date) - new Date(b.date),
  az: (a, b) => a.title.localeCompare(b.title),
  za: (a, b) => b.title.localeCompare(a.title),
};

// Filter results by category and search matching only values in current category and items that match search value
function updateUI() {
  const results = events.filter((ev) => {
    const matchCat = !currCategory || ev.category === currCategory;
    const matchSearch =
      !currSearch || ev.title.toLowerCase().includes(currSearch);
    return matchCat && matchSearch;
  });

  const $categoryTab = document.getElementById("category-tab");

  // Show filter only when category is selected
  $filterTab.hidden = !currCategory;
  if (currCategory) $categoryTab.textContent = currCategory;

  const sortKey = $sortElement.value;

  // Apply sort if comparator exists
  let resultsSorted = results;

  if (comparators[sortKey]) {
    resultsSorted = [...results].sort(comparators[sortKey]);
  }
  // Render filtered and sorted events
  fetchEvents(resultsSorted);
}

const $close = document.getElementById("close");

// Clear category on close and reset select value
$close.addEventListener("click", () => {
  currCategory = "";
  $selectElement.value = "";
  updateUI();
});

// Render events after DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  fetchEvents(events);
});
