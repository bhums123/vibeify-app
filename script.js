document.addEventListener("DOMContentLoaded", () => {
  let isPlaying = false;
  const audio = document.getElementById("audio");
  const play = document.getElementById("play");
  const title = document.getElementById("title");
  const artist = document.getElementById("artist");
  const cover = document.getElementById("cover");
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");
  const volume = document.getElementById("volume");
  const searchBar = document.getElementById("searchBar");
  const songList = document.getElementById("songList");
  const volumeControl = document.getElementById("volumeControl");
  async function searchITunesSongs(query) {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20`,
    );

    const data = await res.json();
    return data.results;
  }

  function loadITunesSong(song) {
    title.textContent = song.trackName;
    artist.textContent = song.artistName;
    cover.src = song.artworkUrl100;
    audio.src = song.previewUrl;
  }

  function displayITunesSongs(list) {
    songList.innerHTML = "";

    list.forEach((song, index) => {
      if (!song.previewUrl) return;

      const li = document.createElement("li");
      li.textContent = `${song.trackName} - ${song.artistName}`;

      li.addEventListener("click", () => {
        songIndex = index;
        loadITunesSong(song);
        playSong();
      });

      songList.appendChild(li);
    });
  }

  function playSong() {
    audio.play();
    isPlaying = true;
    play.classList.replace("fa-play", "fa-pause");
    cover.classList.add("rotate");

    // 🎚 Show volume when song starts
    volumeControl.style.opacity = "1";
    volumeControl.style.visibility = "visible";
  }
  function pauseSong() {
    audio.pause();
    isPlaying = false;
    play.classList.replace("fa-pause", "fa-play");
    cover.classList.remove("rotate");

    volumeControl.style.opacity = "0";
    volumeControl.style.visibility = "hidden";
  }

  audio.addEventListener("ended", () => {
    cover.classList.remove("rotate");
    play.classList.replace("fa-pause", "fa-play");
    isPlaying = false;

    volumeControl.style.opacity = "0";
    volumeControl.style.visibility = "hidden";
  });

  searchBar.addEventListener("input", async () => {
    const value = searchBar.value.trim();
    const results = await searchITunesSongs(value);
    songs = results.filter((song) => song.previewUrl);
    displayITunesSongs(songs);
  });

  /* ---------- PLAY / PAUSE ---------- */
  play.addEventListener("click", () => {
    isPlaying ? pauseSong() : playSong();
  });

  /* ---------- NEXT / PREV ---------- */
  next.addEventListener("click", () => {
    if (!songs.length) return;
    songIndex = (songIndex + 1) % songs.length;
    loadITunesSong(songs[songIndex]);
    playSong();
  });

  prev.addEventListener("click", () => {
    if (!songs.length) return;
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadITunesSong(songs[songIndex]);
    playSong();
  });

  /* ---------- VOLUME ---------- */
  volume.addEventListener("input", () => {
    audio.volume = volume.value;
  });

  /* ---------- DISPLAY SONG LIST ---------- */
  function displaySongs(list) {
    songList.innerHTML = "";

    list.forEach((song, index) => {
      const li = document.createElement("li");
      li.textContent = `${song.title} - ${song.artist}`;

      li.addEventListener("click", () => {
        songIndex = index;
        // loadSong(song);
        playSong();
      });

      songList.appendChild(li);
    });
  }

  const volumeSlider = document.getElementById("volumeSlider");
const volumeIcon = document.getElementById("volumeIcon");

// Volume change
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;

  // Icon change
  if (audio.volume === 0) {
    volumeIcon.className = "fa-solid fa-volume-xmark";
  } else if (audio.volume < 0.5) {
    volumeIcon.className = "fa-solid fa-volume-low";
  } else {
    volumeIcon.className = "fa-solid fa-volume-high";
  }
});


  /* ---------- SEARCH ---------- */
  searchBar.addEventListener("input", () => {
    const value = searchBar.value.toLowerCase().trim();

    const filteredSongs = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(value) ||
        song.artist.toLowerCase().includes(value),
    );

    displaySongs(filteredSongs);
  });

  /* ---------- INITIAL LIST ---------- */
  displaySongs(songs);
});
