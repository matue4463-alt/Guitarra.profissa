const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// desbloqueio mobile
document.body.addEventListener("pointerdown", () => {
  if (audioCtx.state === "suspended") audioCtx.resume();
}, { once:true });

// afinação E B G D A E
const afinacoes = [329.63,246.94,196,146.83,110,82.41];

const cordas = document.querySelectorAll(".corda");
const afinador = document.getElementById("afinacao");
const inputAudio = document.getElementById("audioFile");

// ======================
// 🎸 KARPLUS-STRONG
// ======================
function tocarCorda(freq) {
  const length = Math.round(audioCtx.sampleRate / freq);
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i=0;i<length;i++) {
    data[i] = Math.random()*2-1;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2000;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  source.start();
  source.stop(audioCtx.currentTime + 2);
}

// ======================
// 🎸 TOQUE NAS CORDAS
// ======================
cordas.forEach((corda,i)=>{
  corda.addEventListener("pointerdown",e=>{
    const rect = corda.getBoundingClientRect();
    const pos = (e.clientX - rect.left)/rect.width;
    const traste = Math.floor(pos*12);

    const freq =
      afinacoes[i] *
      parseFloat(afinador.value) *
      Math.pow(2,traste/12);

    tocarCorda(freq);

    corda.classList.add("ativa");
    setTimeout(()=>corda.classList.remove("ativa"),120);
  });
});

// ======================
// 🎼 MP3 → NOTA → GUITARRA
// ======================
inputAudio.addEventListener("change", async e=>{
  const file = e.target.files[0];
  if(!file) return;

  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  const data = audioBuffer.getChannelData(0);

  // detecção simples de pitch
  let crossings = 0;
  for(let i=1;i<5000;i++){
    if(data[i-1] < 0 && data[i] >= 0) crossings++;
  }

  const freq = crossings * audioCtx.sampleRate / 5000;
  if(freq>60 && freq<1200){
    tocarCorda(freq);
  }
});
