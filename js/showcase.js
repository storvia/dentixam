// Fetch templates JSON and render cards
fetch("../data/templates.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("cards");

    data.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "template-card";

      // Add fade-in / slide-in delay for animation
      card.style.animationDelay = `${index * 0.15}s`;

      card.innerHTML = `
        ${item.recommended ? `<span class="badge">⭐ Most Chosen</span>` : ""}
        ${item.preview ? `<div class="preview-img" style="background-image: url('${item.preview}')"></div>` : ""}
        <div class="emoji">${item.emoji}</div>
        <h3>${item.title}</h3>
        <p>${item.blurb}</p>
        <button onclick="window.open('${item.link}', '_blank')">
          ${item.cta}
        </button>
      `;

      container.appendChild(card);
    });
  });
