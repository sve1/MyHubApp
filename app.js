const youtubeApiKey = "AIzaSyBdfDAf_Z5QZ5W8ItsiSeCTRi0OMX0vLqg";
const youtubeChannelId = "UCupvZG-5ko_eiXAupbDfxWw"; // CNN no YouTube
const contentDiv = document.getElementById("content");

// Carregar feed do YouTube
async function loadYoutube() {
  contentDiv.innerHTML = "<p>Carregando YouTube...</p>";
  const url = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&channelId=${youtubeChannelId}&part=snippet,id&order=date&maxResults=5`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    contentDiv.innerHTML = "";
    data.items.forEach(item => {
      if (item.id.videoId) {
        const div = document.createElement("div");
        div.className = "feed-item";
        div.innerHTML = `
          <h3>${item.snippet.title}</h3>
          <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">
            <img src="${item.snippet.thumbnails.medium.url}" alt="thumbnail">
          </a>
          <p>${item.snippet.description}</p>
        `;
        contentDiv.appendChild(div);
      }
    });
  } catch (error) {
    contentDiv.innerHTML = "<p>Erro ao carregar YouTube.</p>";
  }
}

// Carregar feed da CNN (RSS via API rss2json)
async function loadCNN() {
  contentDiv.innerHTML = "<p>Carregando CNN...</p>";
  const url = `https://api.rss2json.com/v1/api.json?rss_url=https://rss.cnn.com/rss/edition.rss`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    contentDiv.innerHTML = "";
    data.items.slice(0, 5).forEach(item => {
      const div = document.createElement("div");
      div.className = "feed-item";
      div.innerHTML = `
        <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
        <p>${item.description}</p>
      `;
      contentDiv.appendChild(div);
    });
  } catch (error) {
    contentDiv.innerHTML = "<p>Erro ao carregar CNN.</p>";
  }
}
