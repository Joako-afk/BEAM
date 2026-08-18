import { test, expect } from '@playwright/test';

const pages = [
  { name: 'Inicio', url: '/' },
  { name: 'Categoría Salud', url: '/categoria/salud' },
  { name: 'Categoría Tiempo Libre', url: '/categoria/tiempo-libre-y-recreacion' },
  { name: 'Categoría Organizaciones', url: '/categoria/organizaciones-sociales' },
  { name: 'Categoría Eventos', url: '/categoria/eventos' },
  { name: 'Beneficio', url: '/beneficio/examen_medico_preventivo_del_adulto_mayor_(empam)' },
  { name: 'Institución', url: '/institucion/chileatiende' },
  { name: 'Presentación', url: '/presentacion' },
];

function buildContrastChecker(requiredRatio) {
  return `
    (() => {
      try {
        function parseColor(str) {
          if (!str || str === 'transparent' || str === 'rgba(0, 0, 0, 0)') return null;
          const m = str.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
          if (!m) return null;
          return { r: +m[1], g: +m[2], b: +m[3] };
        }

        function luminance(r, g, b) {
          const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        }

        function contrastRatio(fg, bg) {
          const l1 = luminance(fg.r, fg.g, fg.b);
          const l2 = luminance(bg.r, bg.g, bg.b);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          return (lighter + 0.05) / (darker + 0.05);
        }

        function getEffectiveBg(el) {
          let node = el;
          while (node && node !== document.documentElement) {
            const style = window.getComputedStyle(node);
            const bg = parseColor(style.backgroundColor);
            if (bg) return bg;
            node = node.parentElement;
          }
          return { r: 255, g: 255, b: 255 };
        }

        function isLargeText(el) {
          const style = window.getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          const fw = style.fontWeight;
          let fontWeight = 400;
          if (fw === 'bold') fontWeight = 700;
          else fontWeight = parseInt(fw, 10) || 400;
          return fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
        }

        const selectors = 'h1, h2, h3, h4, h5, h6, p, span, a, li, td, th, label, button';
        const elements = document.querySelectorAll(selectors);
        const violations = [];

        elements.forEach(el => {
          const text = el.textContent ? el.textContent.trim() : '';
          if (!text) return;
          if (el.children.length > 0) return;

          const fgColor = parseColor(window.getComputedStyle(el).color);
          const bgColor = getEffectiveBg(el);
          if (!fgColor || !bgColor) return;

          const ratio = contrastRatio(fgColor, bgColor);
          const large = isLargeText(el);
          const required = large ? 4.5 : ${requiredRatio};

          if (ratio < required) {
            const rect = el.getBoundingClientRect();
            violations.push({
              tag: el.tagName.toLowerCase(),
              text: text.substring(0, 60),
              fg: window.getComputedStyle(el).color,
              bg: window.getComputedStyle(el).backgroundColor || 'inherited',
              ratio: Math.round(ratio * 100) / 100,
              required: required,
              large: large,
              x: Math.round(rect.x),
              y: Math.round(rect.y)
            });
          }
        });

        return JSON.stringify(violations);
      } catch (e) {
        return JSON.stringify([{ error: e.message }]);
      }
    })()
  `;
}

for (const p of pages) {
  test(`[${p.name}] WCAG AAA contraste >= 7:1`, async ({ page }) => {
    await page.goto(p.url);
    await page.waitForTimeout(2000);

    const raw = await page.evaluate(buildContrastChecker(7));
    const violations = JSON.parse(raw);

    if (violations.length > 0 && violations[0].error) {
      throw new Error(`JS error in evaluate: ${violations[0].error}`);
    }

    console.log(`\n[${p.name}] Elementos con contraste insuficiente (< 7:1):`, violations.length);
    violations.forEach(v => {
      console.log(`  <${v.tag}> "${v.text}" — ratio ${v.ratio}:1 (requerido ${v.required}:1) en (${v.x},${v.y})`);
    });

    expect(violations, `Found ${violations.length} elements below WCAG AAA 7:1`).toEqual([]);
  });
}
