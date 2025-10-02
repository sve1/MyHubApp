const youtubeApiKey = "AIzaSyBdfDAf_Z5QZ5W8ItsiSeCTRi0OMX0vLqg";

// Abas de navegação
function showSection(sectionId) {
  // Remove classe active de todas as seções
  document.querySelectorAll(".tab-section").forEach(sec => sec.classList.remove("active"));
  
  // Remove active dos botões
  document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));

  // Ativa a seção clicada
  document.getElementById(sectionId).classList.add("active");

  // Ativa o botão clicado (usando o atributo onclick)
  document.querySelector(`nav button[onclick="showSection('${sectionId}')"]`).classList.add("active");

  if (sectionId === "myspace") {
    loadMySpace();
  }
}

// 🔎 Pesquisar canal no YouTube
async function searchYoutubeChannel() {
  const query = document.getElementById("searchInput").value;
  const resultsDiv = document.getElementById("youtubeResults");
  resultsDiv.innerHTML = "<p>Buscando...</p>";

  const url = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&q=${query}&type=channel&part=snippet&maxResults=5`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    resultsDiv.innerHTML = "";
    data.items.forEach(item => {
      const div = document.createElement("div");
      div.className = "channel-card";
      div.innerHTML = `
        <h3>${item.snippet.title}</h3>
        <img src="${item.snippet.thumbnails.default.url}" alt="logo">
        <p>${item.snippet.description}</p>
        <button onclick="addChannel('${item.snippet.title}','${item.id.channelId}')">Adicionar ao MySpace</button>
      `;
      resultsDiv.appendChild(div);
    });
  } catch (error) {
    resultsDiv.innerHTML = "<p>Erro ao buscar canal.</p>";
  }
}

// 📌 Adicionar canal no MySpace
function addChannel(name, channelId) {
  let channels = JSON.parse(localStorage.getItem("myspaceChannels")) || [];
  
  if (!channels.find(c => c.id === channelId)) {
    channels.push({ name, id: channelId });
    localStorage.setItem("myspaceChannels", JSON.stringify(channels));
    alert(`Canal "${name}" adicionado ao MySpace!`);
  } else {
    alert("Este canal já está no seu MySpace.");
  }
}

// 🔄 Carregar feeds de todos canais adicionados
async function loadMySpace() {
  const feedDiv = document.getElementById("myspaceFeed");
  feedDiv.innerHTML = "<p>Carregando feeds...</p>";

  const channels = JSON.parse(localStorage.getItem("myspaceChannels")) || [];
  if (channels.length === 0) {
    feedDiv.innerHTML = "<p>Nenhum canal adicionado ainda.</p>";
    return;
  }

  feedDiv.innerHTML = "";
  for (const channel of channels) {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&channelId=${channel.id}&part=snippet,id&order=date&maxResults=3`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      const channelDiv = document.createElement("div");
      channelDiv.className = "channel-card";
      channelDiv.innerHTML = `<h2>📺 ${channel.name}</h2>`;

      data.items.forEach(item => {
        if (item.id.videoId) {
          const videoDiv = document.createElement("div");
          videoDiv.className = "feed-item";
          videoDiv.innerHTML = `
            <h4>${item.snippet.title}</h4>
            <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">
              <img src="${item.snippet.thumbnails.medium.url}" alt="thumbnail">
            </a>
          `;
          channelDiv.appendChild(videoDiv);
        }
      });

      feedDiv.appendChild(channelDiv);
    } catch (error) {
      console.error(error);
      feedDiv.innerHTML += `<p>Erro ao carregar o canal ${channel.name}</p>`;
    }
  }
}

// 📰 CNN (igual antes)
async function loadCNN() {
  const feedDiv = document.getElementById("cnnFeed");
  feedDiv.innerHTML = "<p>Carregando CNN...</p>";
  const url = `https://api.rss2json.com/v1/api.json?rss_url=https://rss.cnn.com/rss/edition.rss`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    feedDiv.innerHTML = "";
    data.items.slice(0, 5).forEach(item => {
      const div = document.createElement("div");
      div.className = "feed-item";
      div.innerHTML = `
        <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
        <p>${item.description}</p>
      `;
      feedDiv.appendChild(div);
    });
  } catch (error) {
    feedDiv.innerHTML = "<p>Erro ao carregar CNN.</p>";
  }
}
