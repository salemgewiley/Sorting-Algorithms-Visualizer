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
async function maxHeapify(array, n, i) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  let bars = document.getElementsByClassName("bar");

  if (left < n && array[left] > array[largest]) {
    largest = left;
  }

  if (right < n && array[right] > array[largest]) {
    largest = right;
  }

  if (largest !== i) {
    let temp = array[i];
    array[i] = array[largest];
    array[largest] = temp;

    bars[i].style.height = array[i] * heightFactor + "px";
    bars[i].style.backgroundColor = "#f17c23";
    bars[i].innerText = array[i];

    bars[largest].style.height = array[largest] * heightFactor + "px";
    bars[largest].style.backgroundColor = "#f17c23";
    bars[largest].innerText = array[largest];

    await sleep(sortingSpeed);

    await maxHeapify(array, n, largest);
  }
}

async function heapSort(array) {
  let n = array.length;
  let bars = document.getElementsByClassName("bar");

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await maxHeapify(array, n, i);
  }

  // Heap sort
  for (let i = n - 1; i > 0; i--) {
    let temp = array[0];
    array[0] = array[i];
    array[i] = temp;

    bars[0].style.height = array[0] * heightFactor + "px";
    bars[0].style.backgroundColor = "#f17c23";
    bars[0].innerText = array[0];

    bars[i].style.height = array[i] * heightFactor + "px";
    bars[i].style.backgroundColor = "#f17c23";
    bars[i].innerText = array[i];

    await sleep(sortingSpeed);

    await maxHeapify(array, i, 0);

    bars[i].style.backgroundColor = "#6ba368";
  }
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = "#6ba368";
  }   
}

sort_btn.addEventListener("click", function () {
  heapSort(unsorted_array).then(() => {
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
