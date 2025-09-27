//Create array of objects to hold events
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
//Retrieve necessary elements to manipulate
const $ulElement = document.querySelector(".list");
const $emptyElement = document.getElementById("empty");
const $searchElement = document.getElementById("search");
const $amountElement = document.getElementById("amount");
const $formElement = document.getElementById("form");
const $sortElement = document.getElementById("sort");

const fetchEvents = (arr) => {
  $ulElement.textContent = "";
  //Show "No results" message if array is empty
  if (!arr.length) {
    $emptyElement.hidden = false;
    $amountElement.innerText = 0;
    return;
  }
  $emptyElement.hidden = true;
  $amountElement.innerText = arr.length;

  //Loop through events to create card structure and add content from events array into html elements
  arr.forEach((e, i) => {
    const $liElement = document.createElement("li");
    const $articleElement = document.createElement("article");
    const $h3Element = document.createElement("h3");
    const $spanElement = document.createElement("span");
    const $timeElement = document.createElement("time");

    $h3Element.textContent = e.title;
    $spanElement.textContent = e.category;
    $timeElement.setAttribute("datetime", e.date);
    $timeElement.textContent = e.date;
    $articleElement.append($h3Element, $spanElement, $timeElement);
    $liElement.appendChild($articleElement);
    $liElement.classList.add("list-item");
    //Add delay prior to loading list items
    $liElement.style.animationDelay = `${i * 0.1}s`;
    $ulElement.append($liElement);
  });
};

const $selectElement = document.getElementById("events");

//Create unique array of categories before sorting
const categories = [...new Set(events.map((ev) => ev.category))].sort();

for (const cat of categories) {
  $selectElement.add(new Option(cat));
}
//Prevent form submission (keeps search/filter client-side only)
$formElement.addEventListener("submit", (e) => {
  e.preventDefault();
});

let currCategory = "";
let currSearch = "";

//Update UI when category changes
$selectElement.addEventListener("change", (evt) => {
  currCategory = evt.target.value;
  updateUI();
});

//Update UI on search input
$searchElement.addEventListener("input", (evt) => {
  currSearch = evt.target.value.trim().toLowerCase();
  updateUI();
});

//Update UI on sort
$sortElement.addEventListener("change", () => {
  updateUI();
});

//Filter results by category and search matching only values in current category and items that match search value
function updateUI() {
  const results = events.filter((ev) => {
    const matchCat = !currCategory || ev.category === currCategory;
    const matchSearch =
      !currSearch || ev.title.toLowerCase().includes(currSearch);
    return matchCat && matchSearch;
  });

  const sortKey = $sortElement.value;
  //Create comparator functions for sort options
  const comparators = {
    new: (a, b) => new Date(b.date) - new Date(a.date),
    old: (a, b) => new Date(a.date) - new Date(b.date),
    az: (a, b) => a.title.localeCompare(b.title),
    za: (a, b) => b.title.localeCompare(a.title),
  };

  //Apply sort if comparator exists
  let resultsSorted = results;
  if (comparators[sortKey]) {
    resultsSorted = [...results].sort(comparators[sortKey]);
  }
  //Render filtered and sorted events
  fetchEvents(resultsSorted);
}
//Render events after DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  fetchEvents(events);
});
