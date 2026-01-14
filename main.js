// ===== AUDIO =====
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const player = new WebAudioFontPlayer();
let instrumento = null;

// Instrumento carregado pelo script externo
instrumento = _tone_0280_LesPaul_sf2;

// ===== AFINAÇÃO PADRÃO (E A D G B E) =====
const afinacoesBase = [
  329.63, // E
  246.94, // B
  196.00, // G
  146.83, // D
  110.00, // A
  82.41   // E
];

// ===== ELEMENTOS =====
const cordas = document.querySelectorAll(".corda");
const sliderAfinacao = document.getElementById("afinacao");
const inputAudio = document.getElementById("audioFile");

// ===== FUNÇÕES =====
function freqParaMidi(freq) {
  return Math.round(69 + 12 * Math.log2(freq / 440));
}

function tocarNota(midi, duracao = 1) {
  if (!instrumento) return;

  player.queueWaveTable(
    audioCtx,
    audioCtx.destination,
    instrumento,
    audioCtx.currentTime,
    midi,
    duracao,
    0.6
  );
}

function animarCorda(corda) {
  corda.classList.add("ativa");
  setTimeout(() => corda.classList.remove("ativa"), 100);
}

// ===== TOQUE NAS CORDAS =====
cordas.forEach((corda, index) => {
  corda.addEventListener("pointerdown", (e) => {

    // Desbloqueia áudio no celular
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const afinacao = parseFloat(sliderAfinacao.value);
    const freqBase = afinacoesBase[index] * afinacao;

    // Descobre o traste pela posição do toque
    const rect = corda.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const traste = Math.floor(pos * 12);

    const freqFinal = freqBase * Math.pow(2, traste / 12);
    const midi = freqParaMidi(freqFinal);

    tocarNota(midi, 1.2);
    animarCorda(corda);
  });
});

// ===== UPLOAD DE ÁUDIO (TESTE) =====
inputAudio.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const audio = new Audio(URL.createObjectURL(file));
  audio.volume = 0.8;
  audio.play();
});
