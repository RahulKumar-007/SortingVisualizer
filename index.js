const container = document.getElementById("container");
const slider = document.getElementById("barSlider");
const nValue = document.getElementById("nValue");

let n = 100;
let audioCtx = null;
let moves = [];
let array = [];

function updateN() {
    n = slider.value;
    nValue.textContent = n;
    console.log("n:", n);
    init();
}

slider.addEventListener('input', updateN);
updateN();

init();

function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init() {
    audioCtx = null;
    moves = [];
    array = []; // Move array initialization here
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showbars();
}

function play() {
    const copy = [...array];
    moves = bubbleSort(copy);
    Animate();
}

function Animate() {
    if (moves.length == 0) {
        showbars();
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;
    if (move.type == "swap") {
        [array[i], array[j]] = [array[j], array[i]];
    }

    playNote(200 + array[i] * 500);
    playNote(200 + array[j] * 500);
    showbars(move);
    setTimeout(function () {
        Animate();
    }, 10);
}

function bubbleSort(array) {
    const moves = [];
    do {
        var swapped = false;
        for (let i = 1; i < array.length; i++) {
            moves.push({ indices: [i - 1, i], type: "comp" });
            if (array[i - 1] > array[i]) {
                swapped = true;
                moves.push({ indices: [i - 1, i], type: "swap" });
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while (swapped);
    return moves;
}

function showbars(move) {
    container.innerHTML = "";
    for (let i = 0; i < n; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");

        if (move && move.indices.includes(i)) {
            if (move.type === "swap") {
                bar.style.backgroundColor = "red";
            } else if (move.type === "comp") {
                bar.style.backgroundColor = "blue";
            }
        }

        container.appendChild(bar);
    }
}

