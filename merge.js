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

// Merge Sort with visual updates
async function mergeSort(array, l, r) {
  if (l >= r) {
    return;
  }
  const m = l + Math.floor((r - l) / 2);
  await mergeSort(array, l, m);
  await mergeSort(array, m + 1, r);
  await merge(array, l, m, r);
}

async function merge(array, l, m, r) {
  const n1 = m - l + 1;
  const n2 = r - m;

  let left = new Array(n1);
  let right = new Array(n2);

  for (let i = 0; i < n1; i++) left[i] = array[l + i];
  for (let i = 0; i < n2; i++) right[i] = array[m + 1 + i];

  let i = 0,
    j = 0,
    k = l;

  let bars = document.getElementsByClassName("bar");

  while (i < n1 && j < n2) {
    if (left[i] <= right[j]) {
      array[k] = left[i];
      bars[k].style.height = array[k] * heightFactor + "px";
      bars[k].style.backgroundColor = "#6ba368";
      bars[k].innerText = array[k];
      i++;
    } else {
      array[k] = right[j];
      bars[k].style.height = array[k] * heightFactor + "px";
      bars[k].style.backgroundColor = "#6ba368";
      bars[k].innerText = array[k];
      j++;
    }
    await sleep(sortingSpeed);
    k++;
  }

  while (i < n1) {
    array[k] = left[i];
    bars[k].style.height = array[k] * heightFactor + "px";
    bars[k].style.backgroundColor = "#6ba368";
    bars[k].innerText = array[k];
    await sleep(sortingSpeed);
    i++;
    k++;
  }

  while (j < n2) {
    array[k] = right[j];
    bars[k].style.height = array[k] * heightFactor + "px";
    bars[k].style.backgroundColor = "#6ba368";
    bars[k].innerText = array[k];
    await sleep(sortingSpeed);
    j++;
    k++;
  }

  for (let i = l; i <= r; i++) {
    bars[i].style.backgroundColor = "#6ba368";
  }
}

sort_btn.addEventListener("click", function () {
  mergeSort(unsorted_array, 0, unsorted_array.length - 1).then(() => {
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
