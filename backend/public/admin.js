document.getElementById("publish").addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value.trim() || "General";
    const content = document.getElementById("content").value.trim();
    const msg = document.getElementById("msg");
  
    msg.textContent = "";
  
    if (!title || !content) {
      msg.textContent = "Please add title and content.";
      return;
    }
  
    try {
      const res = await fetch("/api/thoughts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, content })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        msg.textContent = data?.message || "Error publishing.";
        return;
      }
  
      msg.textContent = "Published ✅";
      document.getElementById("title").value = "";
      document.getElementById("category").value = "";
      document.getElementById("content").value = "";
    } catch (e) {
      msg.textContent = "Server error. Is backend running?";
    }
  });

  document.getElementById("publishQuote").addEventListener("click", async () => {
    const text = document.getElementById("quoteText").value.trim();
    const msg = document.getElementById("quoteMsg");
  
    msg.textContent = "";
  
    if (!text) {
      msg.textContent = "Please write a quote.";
      return;
    }
  
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        msg.textContent = data?.message || "Error publishing quote.";
        return;
      }
  
      msg.textContent = "Quote published ✅";
      document.getElementById("quoteText").value = "";
    } catch (e) {
      msg.textContent = "Server error. Is backend running?";
    }
  });
  