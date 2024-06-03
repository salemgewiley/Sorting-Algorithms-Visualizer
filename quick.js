// Get references to the HTML elements
let randomize_array = document.getElementById("randomize_array_btn");
let sort_btn = document.getElementById("sort_btn");
let bars_container = document.getElementById("bars_container");
let bars_slider = document.getElementById("bars_slider");
let bars_count_label = document.getElementById("bars_count");
let speed_slider = document.getElementById("speed_slider");
let speed_value_label = document.getElementById("speed_value");

let minRange = 2;
let maxRange = 30;
let numberOfBars = parseInt(bars_slider.value);
let sortingSpeed = parseInt(speed_slider.value);

let heightFactor = 10;

// Create an empty array for unsorted numbers
let unsorted_array = new Array(numberOfBars);

// Generate a random number
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create a random array
function createRandomArray() {
  unsorted_array = new Array(numberOfBars); // Reinitialize the array with the new number of bars
  for (let i = 0; i < numberOfBars; i++) {
    unsorted_array[i] = randomNum(minRange, maxRange);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  createRandomArray();
  renderBars(unsorted_array);
});

// Render bars
function renderBars(array) {
  bars_container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    let bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = array[i] * heightFactor + "px";
    bar.innerText = array[i];
    bar.style.textAlign = "center";
    bars_container.appendChild(bar);
  }
}

// Randomize the array and render
randomize_array.addEventListener("click", function () {
  createRandomArray();
  bars_container.innerHTML = "";
  renderBars(unsorted_array);
});

// Slider to update the number of bars
bars_slider.addEventListener("input", function () {
  numberOfBars = parseInt(bars_slider.value);
  bars_count_label.innerText = numberOfBars;
  createRandomArray();
  renderBars(unsorted_array);
});

// Speed slider
speed_slider.addEventListener("input", function () {
  sortingSpeed = parseInt(speed_slider.value);
  speed_value_label.innerText = sortingSpeed;
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Sort with visual updates
async function partition(array, low, high) {
  let pivot = array[high];
  let i = low - 1;
  let bars = document.getElementsByClassName("bar");
  for (let j = low; j < high; j++) {
    if (array[j] < pivot) {
      i++;
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;

      bars[i].style.height = array[i] * heightFactor + "px";
      bars[i].style.backgroundColor = "#f17c23";
      bars[i].innerText = array[i];

      bars[j].style.height = array[j] * heightFactor + "px";
      bars[j].style.backgroundColor = "#f17c23";
      bars[j].innerText = array[j];

      await sleep(sortingSpeed);
    }
  }
  
  let temp = array[i + 1];
  array[i + 1] = array[high];
  array[high] = temp;

  bars[i + 1].style.height = array[i + 1] * heightFactor + "px";
  bars[i + 1].style.backgroundColor = "#f17c23";
  bars[i + 1].innerText = array[i + 1];

  bars[high].style.height = array[high] * heightFactor + "px";
  bars[high].style.backgroundColor = "#f17c23";
  bars[high].innerText = array[high];

  await sleep(sortingSpeed);
for (let i = 0; i < bars.length; i++) {
  bars[i].style.backgroundColor = "#6ba368";
}
  return i + 1;
  
}


async function quickSort(array, low, high) {
  if (low < high) {
    let pivotIndex = await partition(array, low, high);

    await quickSort(array, low, pivotIndex - 1);
    await quickSort(array, pivotIndex + 1, high);
  }
}

sort_btn.addEventListener("click", function () {
  quickSort(unsorted_array, 0, unsorted_array.length - 1).then(() => {
    console.log("Sorted array:", unsorted_array);
  });
});

// Update the maximum value of the bars slider based on the screen width
function updateMaxBars() {
  const screenWidth = window.innerWidth;
  const barWidth = 40; // Adjust this value according to the width of your bars
  const maxBars = Math.floor(screenWidth / barWidth);
  bars_slider.max = maxBars;
  bars_slider.value = Math.min(numberOfBars, maxBars);
  bars_count_label.innerText = Math.min(numberOfBars, maxBars);
  numberOfBars = parseInt(bars_slider.max);
  bars_count_label.innerText = numberOfBars;
  bars_slider.value = bars_slider.max;
  createRandomArray();
  renderBars(unsorted_array);
}

window.addEventListener("resize", updateMaxBars);

updateMaxBars();
