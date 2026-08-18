# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility\color-contrast.spec.js >> [Inicio] WCAG AAA contraste >= 7:1
- Location: tests\accessibility\color-contrast.spec.js:104:3

# Error details

```
Error: Found 1 elements below WCAG AAA 7:1

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 13

- Array []
+ Array [
+   Object {
+     "bg": "rgba(0, 0, 0, 0)",
+     "fg": "rgb(255, 255, 255)",
+     "large": false,
+     "ratio": 6.42,
+     "required": 7,
+     "tag": "span",
+     "text": "+56 9 1234 5678",
+     "x": 403,
+     "y": 660,
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "Categorías de beneficios" [level=1] [ref=e5]
    - button "Notificaciones 1" [ref=e6]:
      - generic [ref=e10]: Notificaciones
      - generic [ref=e11]: "1"
  - main [ref=e12]:
    - generic [ref=e14]:
      - generic [ref=e16]:
        - heading "¿Cómo usar la plataforma?" [level=3] [ref=e17]
        - list [ref=e18]:
          - listitem [ref=e19]: Utiliza la barra de búsqueda para encontrar una categoría.
          - listitem [ref=e20]: Presiona una categoría para ver los beneficios disponibles.
          - listitem [ref=e21]: Selecciona un beneficio para conocer requisitos y detalles.
      - textbox "Buscar..." [ref=e28]
  - contentinfo [ref=e29]:
    - generic [ref=e30]: Soporte técnico de la plataforma:+56 9 1234 5678
    - button "Configuración" [ref=e35]
```

# Test source

```ts
  20  |           const m = str.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
  21  |           if (!m) return null;
  22  |           return { r: +m[1], g: +m[2], b: +m[3] };
  23  |         }
  24  | 
  25  |         function luminance(r, g, b) {
  26  |           const [rs, gs, bs] = [r, g, b].map(c => {
  27  |             c = c / 255;
  28  |             return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  29  |           });
  30  |           return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  31  |         }
  32  | 
  33  |         function contrastRatio(fg, bg) {
  34  |           const l1 = luminance(fg.r, fg.g, fg.b);
  35  |           const l2 = luminance(bg.r, bg.g, bg.b);
  36  |           const lighter = Math.max(l1, l2);
  37  |           const darker = Math.min(l1, l2);
  38  |           return (lighter + 0.05) / (darker + 0.05);
  39  |         }
  40  | 
  41  |         function getEffectiveBg(el) {
  42  |           let node = el;
  43  |           while (node && node !== document.documentElement) {
  44  |             const style = window.getComputedStyle(node);
  45  |             const bg = parseColor(style.backgroundColor);
  46  |             if (bg) return bg;
  47  |             node = node.parentElement;
  48  |           }
  49  |           return { r: 255, g: 255, b: 255 };
  50  |         }
  51  | 
  52  |         function isLargeText(el) {
  53  |           const style = window.getComputedStyle(el);
  54  |           const fontSize = parseFloat(style.fontSize);
  55  |           const fw = style.fontWeight;
  56  |           let fontWeight = 400;
  57  |           if (fw === 'bold') fontWeight = 700;
  58  |           else fontWeight = parseInt(fw, 10) || 400;
  59  |           return fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
  60  |         }
  61  | 
  62  |         const selectors = 'h1, h2, h3, h4, h5, h6, p, span, a, li, td, th, label, button';
  63  |         const elements = document.querySelectorAll(selectors);
  64  |         const violations = [];
  65  | 
  66  |         elements.forEach(el => {
  67  |           const text = el.textContent ? el.textContent.trim() : '';
  68  |           if (!text) return;
  69  |           if (el.children.length > 0) return;
  70  | 
  71  |           const fgColor = parseColor(window.getComputedStyle(el).color);
  72  |           const bgColor = getEffectiveBg(el);
  73  |           if (!fgColor || !bgColor) return;
  74  | 
  75  |           const ratio = contrastRatio(fgColor, bgColor);
  76  |           const large = isLargeText(el);
  77  |           const required = large ? 4.5 : ${requiredRatio};
  78  | 
  79  |           if (ratio < required) {
  80  |             const rect = el.getBoundingClientRect();
  81  |             violations.push({
  82  |               tag: el.tagName.toLowerCase(),
  83  |               text: text.substring(0, 60),
  84  |               fg: window.getComputedStyle(el).color,
  85  |               bg: window.getComputedStyle(el).backgroundColor || 'inherited',
  86  |               ratio: Math.round(ratio * 100) / 100,
  87  |               required: required,
  88  |               large: large,
  89  |               x: Math.round(rect.x),
  90  |               y: Math.round(rect.y)
  91  |             });
  92  |           }
  93  |         });
  94  | 
  95  |         return JSON.stringify(violations);
  96  |       } catch (e) {
  97  |         return JSON.stringify([{ error: e.message }]);
  98  |       }
  99  |     })()
  100 |   `;
  101 | }
  102 | 
  103 | for (const p of pages) {
  104 |   test(`[${p.name}] WCAG AAA contraste >= 7:1`, async ({ page }) => {
  105 |     await page.goto(p.url);
  106 |     await page.waitForTimeout(2000);
  107 | 
  108 |     const raw = await page.evaluate(buildContrastChecker(7));
  109 |     const violations = JSON.parse(raw);
  110 | 
  111 |     if (violations.length > 0 && violations[0].error) {
  112 |       throw new Error(`JS error in evaluate: ${violations[0].error}`);
  113 |     }
  114 | 
  115 |     console.log(`\n[${p.name}] Elementos con contraste insuficiente (< 7:1):`, violations.length);
  116 |     violations.forEach(v => {
  117 |       console.log(`  <${v.tag}> "${v.text}" — ratio ${v.ratio}:1 (requerido ${v.required}:1) en (${v.x},${v.y})`);
  118 |     });
  119 | 
> 120 |     expect(violations, `Found ${violations.length} elements below WCAG AAA 7:1`).toEqual([]);
      |                                                                                  ^ Error: Found 1 elements below WCAG AAA 7:1
  121 |   });
  122 | }
  123 | 
```