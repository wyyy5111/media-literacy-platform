// Dynamic placeholder SVG generator (示例图)
export function renderPlaceholderSVG(targetEl, opts = {}) {
  const width = opts.width || 360;
  const height = opts.height || 200;
  const label = opts.label || "示例图";

  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", label);
  svg.style.border = "1px dashed #888";

  const rect = document.createElementNS(ns, "rect");
  rect.setAttribute("x", 0);
  rect.setAttribute("y", 0);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", "#f8f9fa");
  svg.appendChild(rect);

  for (let i = 1; i <= 3; i++) {
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", 20);
    line.setAttribute("y1", height - 40 - i * 30);
    line.setAttribute("x2", width - 20);
    line.setAttribute("y2", height - 40 - i * 30);
    line.setAttribute("stroke", "#ddd");
    svg.appendChild(line);
  }

  const text = document.createElementNS(ns, "text");
  text.setAttribute("x", width / 2);
  text.setAttribute("y", height / 2);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "#666");
  text.setAttribute("font-size", "18");
  text.setAttribute("font-family", "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif");
  text.textContent = label;
  svg.appendChild(text);

  if (targetEl) {
    targetEl.innerHTML = "";
    targetEl.appendChild(svg);
  }
  return svg;
}