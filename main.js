const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const player = new WebAudioFontPlayer();

let instrumento = null;

document.body.addEventListener("pointerdown", () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
    console.log("Áudio liberado");
  }
}, { once: true });

setTimeout(() => {
  if (typeof _tone_0280_LesPaul_sf2 !== "undefined") {
    instrumento = _tone_0280_LesPaul_sf2;
    console.log("Instrumento carregado");
  } else {
    console.error("Instrumento NÃO carregou");
  }
}, 500);

const afinacoes = [329.63, 246.94, 196, 146.83, 110, 82.41];

const cordas = document.querySelectorAll(".corda");
const afinador = document.getElementById("afinacao");
const inputAudio = document.getElementById("audioFile");

function freqParaMidi(freq) {
  return Math.round(69 + 12 * Math.log2(freq / 440));
}

function tocarNota(midi) {
  if (!instrumento) return;

  player.queueWaveTable(
    audioCtx,
    audioCtx.destination,
    instrumento,
    audioCtx.currentTime,
    midi,
    1.2,
    0.8
  );
}

cordas.forEach((corda, i) => {
  corda.addEventListener("pointerdown", e => {
    const rect = corda.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const traste = Math.floor(pos * 12);

    const freq = afinacoes[i] * afinador.value * Math.pow(2, traste / 12);
    tocarNota(freqParaMidi(freq));

    corda.classList.add("ativa");
    setTimeout(() => corda.classList.remove("ativa"), 120);
  });
});

inputAudio.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const audio = new Audio(URL.createObjectURL(file));
  audio.play();
});
