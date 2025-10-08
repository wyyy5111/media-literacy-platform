// 图表纠错沙盒（原图参数→正确重绘）
export const ChartSandbox = {
  data: [10, 20, 12, 30, 18],

  draw() {
    const cvs = document.querySelector('#chartCanvas');
    const ctx = cvs.getContext('2d');
    const w = cvs.width, h = cvs.height;
    ctx.clearRect(0, 0, w, h);
    const zero = document.querySelector('#optZero').checked;
    const label = document.querySelector('#optLabel').checked;
    const sort = document.querySelector('#optSort').checked;
    let data = [...ChartSandbox.data];
    if (sort) data.sort((a, b) => a - b);

    const minY = zero ? 0 : Math.min(...data) - 8;
    const maxY = Math.max(...data);
    const padding = 40;
    const barW = (w - padding * 2) / data.length - 16;
    const scale = (h - padding * 2) / (maxY - minY);
    // 轴
    ctx.strokeStyle = '#777';
    ctx.beginPath();
    ctx.moveTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding);
    ctx.stroke();
    // 柱
    data.forEach((v, i) => {
      const x = padding + i * (barW + 16) + 8;
      const y = h - padding - (v - minY) * scale;
      const bh = (v - minY) * scale;
      ctx.fillStyle = sort ? '#2c7be5' : '#d9534f';
      ctx.fillRect(x, y, barW, bh);
      if (label) {
        ctx.fillStyle = '#333';
        ctx.font = '12px system-ui';
        ctx.fillText(String(v), x + barW / 2 - 8, y - 6);
      }
    });
    if (label) {
      ctx.fillStyle = '#333';
      ctx.font = '12px system-ui';
      ctx.fillText('单位：件', w - padding - 60, padding);
    }

    // 绑定开关监听（只绑定一次）
    ['#optZero', '#optLabel', '#optSort'].forEach((q) => {
      const el = document.querySelector(q);
      if (!el._bound) {
        el.addEventListener('change', ChartSandbox.draw);
        el._bound = true;
      }
    });
  },

  evalChart() {
    const s = (document.querySelector('#optZero').checked ? 33.4 : 0) +
              (document.querySelector('#optLabel').checked ? 33.3 : 0) +
              (document.querySelector('#optSort').checked ? 33.3 : 0);
    return Math.round(s);
  }
};