document.addEventListener("DOMContentLoaded", () => {
  const formatDate = date => new Date(date + "T12:00:00").toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  });

  const played = matches.filter(m => m.result !== "UPCOMING");
  const upcoming = matches.filter(m => m.result === "UPCOMING").sort((a,b) => a.date.localeCompare(b.date));
  const latest = [...played].sort((a,b) => b.date.localeCompare(a.date))[0];
  const form = played.slice().sort((a,b) => b.date.localeCompare(a.date)).map(m => m.result);
  const wins = played.filter(m => m.result === "W").length;
  const draws = played.filter(m => m.result === "D").length;
  const losses = played.filter(m => m.result === "L").length;
  const gf = played.reduce((s,m) => s + Number(m.homeScore || 0), 0);
  const ga = played.reduce((s,m) => s + Number(m.awayScore || 0), 0);

  const resultClass = r => r === "W" ? "win" : r === "D" ? "draw" : r === "L" ? "loss" : "upcoming";
  const resultText = r => r === "UPCOMING" ? "UPCOMING" : r === "W" ? "WIN" : r === "D" ? "DRAW" : "LOSS";

  const matchCard = m => `
    <article class="match-card ${resultClass(m.result)}">
      <div class="match-meta"><span>${formatDate(m.date)}</span><span>${m.competition}</span></div>
      <div class="match-main">
        <div class="team-side"><div class="mini-crest">MG</div><strong>Manyatta Gonda FC</strong></div>
        <div class="score-block">
          <span class="result-badge ${resultClass(m.result)}">${resultText(m.result)}</span>
          <div class="score">${m.result === "UPCOMING" ? "VS" : `${m.homeScore} <small>–</small> ${m.awayScore}`}</div>
        </div>
        <div class="team-side opponent"><div class="opponent-crest">${m.opponent.substring(0,2).toUpperCase()}</div><strong>${m.opponent}</strong></div>
      </div>
      <div class="match-footer"><span>📍 ${m.venue}</span>${m.result !== "UPCOMING" ? `<button class="details-btn" data-match="${m.id}">Match report →</button>` : ""}</div>
    </article>`;

  const statCard = (value, label) => `<div class="stat-card"><strong>${value}</strong><span>${label}</span></div>`;

  const latestScore = document.getElementById("latest-score");
  if (latestScore) {
    latestScore.innerHTML = latest ? `
      <div><span class="strip-label">LATEST RESULT</span><strong>${formatDate(latest.date)}</strong></div>
      <div class="strip-match"><span>Manyatta Gonda FC</span><b>${latest.homeScore} — ${latest.awayScore}</b><span>${latest.opponent}</span></div>
      <div><span class="form-pill ${resultClass(latest.result)}">${resultText(latest.result)}</span></div>` : `<div>No results yet.</div>`;
  }

  const featured = document.getElementById("featured-match");
  if (featured) featured.innerHTML = latest ? matchCard(latest) : "<p>No match has been added yet.</p>";

  const homeStats = document.getElementById("home-stats");
  if (homeStats) homeStats.innerHTML = statCard(played.length, "Played") + statCard(wins, "Wins") + statCard(draws, "Draws") + statCard(losses, "Losses") + statCard(gf, "Goals");

  const formRow = document.getElementById("form-row");
  if (formRow) formRow.innerHTML = form.length ? form.slice(0,8).map(r => `<span class="form-dot ${resultClass(r)}">${r}</span>`).join("") : "<span>No results yet</span>";

  const next = document.getElementById("next-match");
  if (next) {
    const n = upcoming[0];
    next.innerHTML = n ? `<div class="next-match"><div><span class="eyebrow">NEXT FIXTURE</span><h2>Manyatta Gonda FC <span>vs</span> ${n.opponent}</h2><p>${formatDate(n.date)} · ${n.competition} · ${n.venue}</p></div><div class="next-date">${new Date(n.date+"T12:00:00").getDate()}<small>${new Date(n.date+"T12:00:00").toLocaleDateString("en-GB",{month:"short"}).toUpperCase()}</small></div></div>` : "<p>No upcoming fixture added.</p>";
  }

  const matchesList = document.getElementById("matches-list");
  if (matchesList) {
    const render = filter => {
      const list = filter === "played" ? played : filter === "upcoming" ? upcoming : [...matches].sort((a,b)=>b.date.localeCompare(a.date));
      matchesList.innerHTML = list.map(matchCard).join("") || "<p>No matches found.</p>";
    };
    render("all");
    document.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.filter);
    }));
  }

  const fullStats = document.getElementById("full-stats");
  if (fullStats) fullStats.innerHTML = statCard(played.length,"Played") + statCard(wins,"Wins") + statCard(draws,"Draws") + statCard(losses,"Losses") + statCard(gf,"Goals For") + statCard(ga,"Goals Against");
  const fullForm = document.getElementById("full-form");
  if (fullForm) fullForm.innerHTML = form.map(r => `<span class="form-dot ${resultClass(r)}">${r}</span>`).join("");
  const goalsFor = document.getElementById("goals-for"), goalsAgainst = document.getElementById("goals-against"), goalDiff = document.getElementById("goal-diff");
  if (goalsFor) goalsFor.textContent = gf;
  if (goalsAgainst) goalsAgainst.textContent = ga;
  if (goalDiff) goalDiff.textContent = gf - ga >= 0 ? "+" + (gf-ga) : gf-ga;

  const renderPlayers = (position, id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = squad.filter(p => p.position === position).map(p => `
      <div class="player-card">
        <div class="player-photo"><img src="${p.photo}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span>${p.number}</span></div>
        <div class="player-info"><span>${p.position}</span><h3>${p.name}</h3><b>#${p.number}</b></div>
      </div>`).join("");
  };
  renderPlayers("Goalkeeper","goalkeepers"); renderPlayers("Defender","defenders"); renderPlayers("Midfielder","midfielders"); renderPlayers("Forward","forwards");

  const photos = matches.flatMap(m => (m.photos || []).map(src => ({src, match:m}))).filter(x => x.src);
  const photoHTML = photos.map(p => `<button class="photo-tile" data-photo="${p.src}"><img src="${p.src}" alt="${p.match.opponent} match" onerror="this.parentElement.classList.add('missing')"><span>${p.match.opponent} · ${formatDate(p.match.date)}</span></button>`).join("");
  const homeGallery = document.getElementById("home-gallery"), fullGallery = document.getElementById("full-gallery");
  if (homeGallery) homeGallery.innerHTML = photoHTML || `<div class="empty-gallery">Add your match photos in <code>images/matches/</code>.</div>`;
  if (fullGallery) fullGallery.innerHTML = photoHTML || `<div class="empty-gallery">Add your match photos in <code>images/matches/</code>.</div>`;

  document.addEventListener("click", e => {
    const detail = e.target.closest("[data-match]");
    if (detail) {
      const m = matches.find(x => x.id == detail.dataset.match);
      if (!m) return;
      document.getElementById("modal-content").innerHTML = `
        <span class="eyebrow">${formatDate(m.date)} · ${m.competition}</span>
        <h2>${m.homeScore} — ${m.awayScore}</h2><h3>Manyatta Gonda FC vs ${m.opponent}</h3>
        <p>${m.report || "Match report coming soon."}</p>
        ${m.playerOfMatch ? `<div class="pom"><span>PLAYER OF THE MATCH</span><strong>${m.playerOfMatch}</strong></div>` : ""}
        ${m.scorers?.length ? `<h3>Goals</h3><ul class="scorers">${m.scorers.map(s=>`<li>⚽ ${s.player} <span>${s.minute}</span></li>`).join("")}</ul>` : ""}`;
      openModal();
    }
    const photo = e.target.closest("[data-photo]");
    if (photo) {
      const lb = document.getElementById("lightbox");
      if (lb) { document.getElementById("lightbox-img").src = photo.dataset.photo; lb.classList.add("open"); }
    }
    if (e.target.matches("[data-close]")) closeModal();
  });

  function openModal(){ const m=document.getElementById("match-modal"); if(m){m.classList.add("open");m.setAttribute("aria-hidden","false");} }
  function closeModal(){ const m=document.getElementById("match-modal"); if(m){m.classList.remove("open");m.setAttribute("aria-hidden","true");} }
  const lb=document.getElementById("lightbox"); if(lb) lb.addEventListener("click",()=>lb.classList.remove("open"));

  document.querySelector(".menu-toggle")?.addEventListener("click",()=>document.querySelector(".main-nav")?.classList.toggle("open"));
  document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());
});
