function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text).split(/\s+/);
    let line = "";
    const lines = [];
  
    for (let n = 0; n < words.length; n++) {
      const testLine = line ? line + " " + words[n] : words[n];
      if (ctx.measureText(testLine).width > maxWidth && line) {
        lines.push(line);
        line = words[n];
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);
  
    lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
    return lines.length;
  }
  
  function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }  

const QUOTES = [
    "Soft hearts still survive loud worlds.",
    "Some feelings are too honest to be explained.",
    "Love isn’t loud — it’s consistent.",
    "The deepest thoughts are often the quietest.",
    "Even silence can hold a promise.",
    "A gentle mind is a powerful thing.",
    "I write because my heart doesn’t stay silent.",
    "Some words are homes you can return to.",
    "If it’s real, it stays — calmly.",
    "I don’t chase moments. I keep meanings."
  ];
  function spawnSparkles() {
    const btn = document.getElementById("newQuoteBtn");
    if (!btn) return;
  
    const layer = btn.querySelector(".sparkleLayer");
    if (!layer) return;
  
    // clear old sparkles
    layer.innerHTML = "";
  
    // create a few sparkles
    for (let i = 0; i < 10; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
  
      // random position inside the button
      s.style.left = Math.random() * 100 + "%";
      s.style.top = (60 + Math.random() * 30) + "%"; // lower half looks nicer
      s.style.animationDelay = (Math.random() * 120) + "ms";
  
      layer.appendChild(s);
    }
  }
  
  async function copyFeaturedQuote() {
    const quoteEl = document.getElementById("featuredQuote");
    const metaEl = document.getElementById("quoteMeta");
    const btn = document.getElementById("copyQuoteBtn");
  
    if (!quoteEl || !btn) return;
  
    const quote = quoteEl.textContent?.trim();
    if (!quote) return;
  
    const textToCopy = metaEl?.textContent
      ? `${quote}\n${metaEl.textContent}`
      : quote;
  
    try {
      await navigator.clipboard.writeText(textToCopy);
      const old = btn.textContent;
      btn.textContent = "Copied ✅";
      setTimeout(() => (btn.textContent = old), 900);
    } catch {
      // fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
  
      const old = btn.textContent;
      btn.textContent = "Copied ✅";
      setTimeout(() => (btn.textContent = old), 900);
    }
  }
  
  async function setFeaturedQuote() {
    const quoteEl = document.getElementById("featuredQuote");
    const metaEl = document.getElementById("quoteMeta");
    const box = document.getElementById("quoteBox");
  
    if (!quoteEl || !metaEl || !box) return;
  
    // fade out
    box.classList.add("fadeOut");
    box.classList.remove("fadeIn");
  
    // wait a bit for the fade out to be visible
    await new Promise(r => setTimeout(r, 220));
  
    try {
      const res = await fetch("/api/quotes/random");
      const q = await res.json();
  
      if (!q || !q.text) {
        quoteEl.textContent = "No quotes yet — add one from Admin ✍️";
        metaEl.textContent = "";
      } else {
        quoteEl.textContent = q.text;
        metaEl.textContent = "— Pavitra";
      }
    } catch (e) {
      quoteEl.textContent = "Couldn’t load quote. Check server.";
      metaEl.textContent = "";
    }
  
    // fade in
    box.classList.remove("fadeOut");
    box.classList.add("fadeIn");
  }
  
  // run on load
  setFeaturedQuote();
  async function downloadQuoteCard() {
    const quote = document.getElementById("featuredQuote")?.textContent?.trim();
    if (!quote) return;
  
    const W = 1080, H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
  
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#fbf4f6");
    grad.addColorStop(1, "#f3d9e2");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  
    ctx.fillStyle = "#ffffff";
    roundedRect(ctx, 90, 170, W - 180, H - 340, 48);
    ctx.fill();
  
    ctx.fillStyle = "#7a2f47";
    ctx.font = "54px serif";
    wrapText(ctx, quote, 140, 360, W - 280, 74);
  
    ctx.font = "38px serif";
    ctx.fillText("— Pavitra", 140, H - 260);
  
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `pavitra-quote.png`;
    a.click();
  }  

  // button
  const newBtn = document.getElementById("newQuoteBtn");
if (newBtn) {
  newBtn.addEventListener("click", async () => {
    spawnSparkles();
    await setFeaturedQuote();
  });
}

const copyBtn = document.getElementById("copyQuoteBtn");
if (copyBtn) copyBtn.addEventListener("click", copyFeaturedQuote);


async function loadThoughts() {
    const container = document.getElementById("thoughts");
    const empty = document.getElementById("empty");
  
    try {
      const res = await fetch("/api/thoughts");
      const data = await res.json();
  
      container.innerHTML = "";
  
      if (!Array.isArray(data) || data.length === 0) {
        empty.style.display = "block";
        return;
      }
  
      empty.style.display = "none";
  
      data.forEach(t => {
        const div = document.createElement("div");
        div.className = "thought";
  
        const date = new Date(t.createdAt).toLocaleString();
  
        div.innerHTML = `
          <h3 class="thoughtTitle">${escapeHtml(t.title)}</h3>
          <p class="meta">${escapeHtml(t.category || "General")} • ${date}</p>
          <p class="content">${escapeHtml(t.content)}</p>
        `;
  
        container.appendChild(div);
      });
    } catch (e) {
      container.innerHTML = `<p class="muted">Error loading thoughts. Check server.</p>`;
    }
  }
  
  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  
  loadThoughts();
  
  const dlBtn = document.getElementById("downloadCardBtn");
if (dlBtn) dlBtn.addEventListener("click", downloadQuoteCard);
