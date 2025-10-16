const API = "https://ghibliapi.vercel.app/films";
const cardsEl = document.getElementById("cards");
const statusEl = document.getElementById("status");

// Helper: safely return a text value, or "—" if it's null, undefined, or empty
const safeText = (v) => (v === null || v === undefined || v === "" ? "—" : v);

function cardFor(film) {
  //console.log(film);
  const { 
    title, 
    director, 
    original_title_romanised, 
    release_date, 
    running_time, 
    rt_score, 
    image,
  } = film; // Destructure film object

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

  const h3 = document.createElement("h3");
  h3.textContent = `Original Title: ${safeText(original_title_romanised)}`;

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
  //content.append(h2, meta, badges);
  content.append(h2, h3, meta, badges);
  wrap.append(poster, content);
  //wrap.append(content);
  console.log (wrap.innerHTML);
  return wrap;
}

async function loadFilms() {
  try {
    // show spinner
    statusEl.innerHTML = `<span class="loader" aria-hidden="true"></span><span>Loading…</span>`;
    cardsEl.innerHTML = ""; 

    const res = await fetch(API, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    //console.log(res);

    const films = await res.json();
    films.sort((a, b) => Number(a.release_date) - Number(b.release_date));
    //console.log(films);
    //console.log(films[0]);

    cardsEl.innerHTML = "";
    films.forEach(film => cardsEl.appendChild(cardFor(film)));

    statusEl.textContent = `Loaded ${films.length} films.`; // Shows status and removes spinner
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Failed to load films. Please try again.";
    cardsEl.innerHTML = "";
  }
}

loadFilms();
