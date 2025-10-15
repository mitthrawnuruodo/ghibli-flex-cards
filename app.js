const API = "https://ghibliapi.vercel.app/films";
const cardsEl = document.getElementById("cards");
const statusEl = document.getElementById("status");

// Helper: safely return a text value, or "—" if it's null, undefined, or empty
const safeText = (value) =>
  (value === null || value === undefined || value === "" ? "—" : value);

function cardFor(film) {
  const { title, director, producer, release_date, running_time, rt_score, image } = film;

  const wrap = document.createElement("article");
  wrap.className = "card";

  // full-bleed poster
  const poster = document.createElement("img");
  poster.src = image;
  poster.alt = `Poster of ${title}`;

  const content = document.createElement("div");
  content.className = "card-content";

  const h2 = document.createElement("h2");
  h2.textContent = safeText(title);

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = `${safeText(director)} • ${safeText(release_date)}`;

  const badges = document.createElement("div");
  badges.className = "badges";

  const runtime = document.createElement("span");
  runtime.className = "badge";
  runtime.textContent = `⏱️ ${safeText(running_time)} min`;

  const score = document.createElement("span");
  score.className = "badge";
  score.textContent = `🍅 ${safeText(rt_score)}`;

  badges.append(runtime, score);
  content.append(h2, meta, badges);
  wrap.append(poster, content);
  return wrap;
}

async function loadFilms() {
  try {
    // show spinner
    statusEl.innerHTML = `<span class="loader" aria-hidden="true"></span><span>Loading…</span>`;
    cardsEl.innerHTML = ""; 

    const res = await fetch(API, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const films = await res.json();
    films.sort((a, b) => Number(a.release_date) - Number(b.release_date));

    cardsEl.innerHTML = "";
    films.forEach(film => cardsEl.appendChild(cardFor(film)));

    statusEl.textContent = `Loaded ${films.length} films.`; 
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Failed to load films. Please try again.";
    cardsEl.innerHTML = "";
  }
}

loadFilms();
