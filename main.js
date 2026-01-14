const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// desbloqueio global
document.body.addEventListener("pointerdown", () => {
  if (audioCtx.state === "suspended") audioCtx.resume();
}, { once: true });

// afinação padrão guitarra (E B G D A E)
const afinacoes = [329.63, 246.94, 196, 146.83, 110, 82.41];

const cordas = document.querySelectorAll(".corda");
const afinador = document.getElementById("afinacao");

function freqParaMidi(freq) {
  return 69 + 12 * Math.log2(freq / 440);
}

// 🔊 SINTETIZADOR DE GUITARRA
function tocarGuitarra(freq) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = "sawtooth"; // mais parecido com corda
  osc.frequency.value = freq;

  filter.type = "lowpass";
  filter.frequency.value = 1800;

  // envelope (ataque rápido, decay)
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 1.3);
}

// 🎸 TOQUE NAS CORDAS
cordas.forEach((corda, i) => {
  corda.addEventListener("pointerdown", e => {
    const rect = corda.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const traste = Math.floor(pos * 12);

    const freq =
      afinacoes[i] *
      parseFloat(afinador.value) *
      Math.pow(2, traste / 12);

    tocarGuitarra(freq);

    corda.classList.add("ativa");
    setTimeout(() => corda.classList.remove("ativa"), 120);
  });
});
