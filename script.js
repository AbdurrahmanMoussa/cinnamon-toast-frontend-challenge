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
const DOM = {
  $ulElement: document.querySelector(".list"),
  $emptyElement: document.getElementById("empty"),
  $searchElement: document.getElementById("search"),
  $amountElement: document.getElementById("amount"),
  $formElement: document.getElementById("form"),
  $sortElement: document.getElementById("sort"),
  $categoryFilter: document.querySelector(".category-filter-container"),
  $tagFilter: document.querySelector(".tag-filter-container"),
  $tagSelect: document.getElementById("select-tag"),
  $categorySelect: document.getElementById("events"),
  $closeCategory: document.getElementById("close-category"),
  $closeTag: document.getElementById("close-tag"),
  $categoryTab: document.getElementById("category-tab"),
  $tagTab: document.getElementById("tag-tab"),
};

// Show "No results" message if array is empty
const renderEmptyState = () => {
  DOM.$ulElement.textContent = "";
  DOM.$emptyElement.hidden = false;
  DOM.$amountElement.textContent = "0 results";
};

// Update result count and hide empty message
const updateResultsCount = (count) => {
  DOM.$emptyElement.hidden = true;
  DOM.$amountElement.textContent = `${count} result${count === 1 ? "" : "s"}`;
};

// Create a single tag element
const createTagElement = (tag) => {
  const $tag = document.createElement("span");
  $tag.classList.add("tag");
  $tag.textContent = tag;
  return $tag;
};

// Create container for all tags in an event
const createTagsContainer = (tags) => {
  const $container = document.createElement("div");
  $container.classList.add("tags");
  tags.forEach((tag) => {
    $container.appendChild(createTagElement(tag));
  });
  return $container;
};

// Format date string to localized format
const options = { year: "numeric", month: "short", day: "numeric" };
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

// Create the full event DOM structure
// Loop through events to create card structure and add content from events array into html elements
const createEventElement = (event, index) => {
  const $li = document.createElement("li");
  $li.classList.add("list-item");

  /// Stagger item animations (each appears 0.1s after the previous)
  $li.style.animationDelay = `${index * 0.1}s`;

  const $article = document.createElement("article");
  const $h3 = document.createElement("h3");
  const $span = document.createElement("span");
  const $time = document.createElement("time");
  const $tags = createTagsContainer(event.tags);

  $h3.textContent = event.title;
  $span.textContent = event.category;

  $time.setAttribute("datetime", event.date);
  $time.textContent = formatDate(event.date);

  $article.append($h3, $span, $time, $tags);
  $li.appendChild($article);

  return $li;
};

// render all events
const renderEvents = (events) => {
  const frag = document.createDocumentFragment();
  DOM.$ulElement.textContent = "";

  if (!events.length) {
    renderEmptyState();
    return;
  }

  updateResultsCount(events.length);

  events.forEach((event, index) => {
    const $eventElement = createEventElement(event, index);
    frag.appendChild($eventElement);
  });

  DOM.$ulElement.appendChild(frag);
};

const allTags = events.map((ev) => ev.tags).flat();

const uniqueTags = [...new Set(allTags)].sort();

for (const tag of uniqueTags) {
  DOM.$tagSelect.add(new Option(tag));
}

// Extract unique categories from events and sort alphabetically for dropdown
const uniqueCategories = [...new Set(events.map((ev) => ev.category))].sort();

for (const cat of uniqueCategories) {
  DOM.$categorySelect.add(new Option(cat));
}

// Prevent form submission (keeps search/filter client-side only)
DOM.$formElement.addEventListener("submit", (e) => {
  e.preventDefault();
});

let currCategory = "";
let currSearch = "";
let currTag = "";

// Update UI when tag changes
DOM.$tagSelect.addEventListener("change", (evt) => {
  currTag = evt.target.value;
  updateUI();
});

// Update UI when category changes
DOM.$categorySelect.addEventListener("change", (evt) => {
  currCategory = evt.target.value;
  updateUI();
});

// Update UI on search input
DOM.$searchElement.addEventListener("input", (evt) => {
  currSearch = evt.target.value.trim().toLowerCase();
  updateUI();
});

// Update UI on sort

DOM.$sortElement.addEventListener("change", () => {
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

  // Show filters only when category is selected
  DOM.$categoryFilter.hidden = !currCategory;
  if (currCategory) DOM.$categoryTab.textContent = currCategory;

  DOM.$tagFilter.hidden = !currTag;
  if (currTag) DOM.$tagTab.textContent = currTag;

  const sortKey = DOM.$sortElement.value;

  // Apply sort if comparator exists
  let resultsSorted = results;

  if (comparators[sortKey]) {
    resultsSorted = [...results].sort(comparators[sortKey]);
  }
  // Render filtered and sorted events
  renderEvents(resultsSorted);
}

function closeFilter(type) {
  if (type === "category") {
    currCategory = "";
    DOM.$categorySelect.value = "";
  }
  if (type === "tag") {
    currTag = "";
    DOM.$tagSelect.value = "";
  }
  updateUI();
}

// Clear category on close and reset select value
DOM.$closeCategory.addEventListener("click", () => closeFilter("category"));

// Clear tag on close and reset select value
DOM.$closeTag.addEventListener("click", () => closeFilter("tag"));

// Render events after DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  renderEvents(events);
});
