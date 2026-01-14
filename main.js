cordas.forEach((corda, index) => {
  corda.addEventListener("pointerdown", (e) => {

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const rect = corda.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const traste = Math.floor(pos * 12);

    const freq = afinacoes[index] * Math.pow(2, traste / 12);
    const midi = freqParaMidi(freq);

    tocarNota(midi, 1);
    animarCorda(corda);
  });
});
