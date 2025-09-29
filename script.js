// Create array of objects to hold events
const events = [
  {
    title: "Local Meetup",
    category: "Community",
    date: "2025-10-10",
    tags: ["networking", "community"],
  },
  {
    title: "Team Lunch",
    category: "Work",
    date: "2025-10-14",
    tags: ["team", "casual"],
  },
  {
    title: "Web Dev Meetup",
    category: "Work",
    date: "2025-11-16",
    tags: ["networking", "react"],
  },
  {
    title: "Final Exam Prep",
    category: "School",
    date: "2025-11-28",
    tags: ["study", "team"],
  },
  {
    title: "WordPress Conf",
    category: "Community",
    date: "2025-12-05",
    tags: ["conference", "community"],
  },
  {
    title: "Book Club",
    category: "Audience",
    date: "2025-12-12",
    tags: ["books", "discussion"],
  },
  {
    title: "React Study Session",
    category: "School",
    date: "2025-10-16",
    tags: ["react", "study"],
  },
  {
    title: "Cinnamon Toast Day",
    category: "Community",
    date: "2025-10-20",
    tags: ["casual", "community"],
  },
  {
    title: "Web Dev Workshop",
    category: "Audience",
    date: "2025-11-02",
    tags: ["react", "conference"],
  },
  {
    title: "Meet and Greet",
    category: "Work",
    date: "2025-11-07",
    tags: ["networking", "team"],
  },
  {
    title: "Client Presentation",
    category: "Work",
    date: "2025-11-11",
    tags: ["conference", "team"],
  },
  {
    title: "Team Building Workshop",
    category: "Work",
    date: "2025-11-13",
    tags: ["team", "casual"],
  },
];

// Get DOM elements for updates
const $ulElement = document.querySelector(".list");
const $emptyElement = document.getElementById("empty");
const $searchElement = document.getElementById("search");
const $amountElement = document.getElementById("amount");
const $formElement = document.getElementById("form");
const $sortElement = document.getElementById("sort");
const $categoryFilter = document.querySelector(".category-filter-container");
const $tagFilter = document.querySelector(".tag-filter-container");

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
    const $tagsContainer = document.createElement("div");
    $tagsContainer.classList.add("tags");

    e.tags.forEach((t) => {
      const $tagElement = document.createElement("span");
      $tagElement.classList.add("tag");
      $tagElement.textContent = t;
      $tagsContainer.appendChild($tagElement);
    });
    const options = { year: "numeric", month: "short", day: "numeric" };

    $h3Element.textContent = e.title;
    $spanElement.textContent = e.category;

    $timeElement.setAttribute("datetime", e.date);
    $timeElement.textContent = new Date(e.date).toLocaleDateString(
      undefined,
      options
    );

    $articleElement.append(
      $h3Element,
      $spanElement,
      $timeElement,
      $tagsContainer
    );
    $liElement.appendChild($articleElement);
    $liElement.classList.add("list-item");

    /// Stagger item animations (each appears 0.1s after the previous)
    $liElement.style.animationDelay = `${i * 0.1}s`;
    frag.appendChild($liElement);
  });

  $ulElement.appendChild(frag);
};

const $tagSelect = document.getElementById("select-tag");
const allTags = events.map((ev) => ev.tags).flat();

const uniqueTags = [...new Set(allTags)].sort();

for (const tag of uniqueTags) {
  $tagSelect.add(new Option(tag));
}

const $categorySelect = document.getElementById("events");

// Extract unique categories from events and sort alphabetically for dropdown
const uniqueCategories = [...new Set(events.map((ev) => ev.category))].sort();

for (const cat of uniqueCategories) {
  $categorySelect.add(new Option(cat));
}

// Prevent form submission (keeps search/filter client-side only)
$formElement.addEventListener("submit", (e) => {
  e.preventDefault();
});

let currCategory = "";
let currSearch = "";
let currTag = "";

// Update UI when tag changes
$tagSelect.addEventListener("change", (evt) => {
  currTag = evt.target.value;
  updateUI();
});

// Update UI when category changes
$categorySelect.addEventListener("change", (evt) => {
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
  new: (a, b) => b.date.localeCompare(a.date),
  old: (a, b) => a.date.localeCompare(b.date),
  az: (a, b) => a.title.localeCompare(b.title),
  za: (a, b) => b.title.localeCompare(a.title),
};

// Filter results by category and search matching only values in current category and items that match search value
function updateUI() {
  const results = events.filter((ev) => {
    const matchCat = !currCategory || ev.category === currCategory;
    const matchTag = !currTag || ev.tags.includes(currTag);
    const matchSearch =
      !currSearch ||
      ev.title.toLowerCase().includes(currSearch) ||
      ev.tags.some((t) => t.toLowerCase().includes(currSearch));
    return matchCat && matchSearch && matchTag;
  });

  const $categoryTab = document.getElementById("category-tab");
  const $tagTab = document.getElementById("tag-tab");

  // Show filters only when category is selected
  $categoryFilter.hidden = !currCategory;
  if (currCategory) $categoryTab.textContent = currCategory;

  $tagFilter.hidden = !currTag;
  if (currTag) $tagTab.textContent = currTag;

  const sortKey = $sortElement.value;

  // Apply sort if comparator exists
  let resultsSorted = results;

  if (comparators[sortKey]) {
    resultsSorted = [...results].sort(comparators[sortKey]);
  }
  // Render filtered and sorted events
  fetchEvents(resultsSorted);
}

function closeFilter(type) {
  if (type === "category") {
    currCategory = "";
    $categorySelect.value = "";
  }
  if (type === "tag") {
    currTag = "";
    $tagSelect.value = "";
  }
  updateUI();
}

const $closeCategory = document.getElementById("close-category");

// Clear category on close and reset select value
$closeCategory.addEventListener("click", () => closeFilter("category"));

const $closeTag = document.getElementById("close-tag");

// Clear tag on close and reset select value
$closeTag.addEventListener("click", () => closeFilter("tag"));

// Render events after DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  fetchEvents(events);
});
