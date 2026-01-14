console.log("🎸 main.js carregado");

// Carregar arquivos JSON
async function carregarJSON(nome) {
  const res = await fetch(nome);
  return res.json();
}

async function iniciar() {
  const config = await carregarJSON("config.json");
  const midiMap = await carregarJSON("midiMap.json");

  console.log("Config:", config);
  console.log("MIDI Map:", midiMap);
}

iniciar();
