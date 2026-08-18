import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { name: 'Inicio', url: '/' },
  { name: 'Categoría Salud', url: '/categoria/salud' },
  { name: 'Categoría Tiempo Libre', url: '/categoria/tiempo-libre-y-recreacion' },
  { name: 'Categoría Organizaciones', url: '/categoria/organizaciones-sociales' },
  { name: 'Categoría Eventos', url: '/categoria/eventos' },
  { name: 'Beneficio', url: '/beneficio/examen_medico_preventivo_del_adulto_mayor_(empam)' },
];

for (const p of pages) {
  test.describe(`Accessibility: ${p.name}`, () => {

    test(`[${p.name}] No debe tener errores de accesibilidad WCAG AA`, async ({ page }) => {
      await page.goto(p.url);
      await page.waitForTimeout(2000);
      
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      console.log(`\n[${p.name}] Violations:`, results.violations.length);
      results.violations.forEach(v => {
        console.log(`  - ${v.id}: ${v.description}`);
      });
      
      expect(results.violations).toEqual([]);
    });

    test(`[${p.name}] Contraste de colores debe ser suficiente`, async ({ page }) => {
      await page.goto(p.url);
      await page.waitForTimeout(2000);
      
      const results = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();
      
      expect(results.violations).toEqual([]);
    });

    test(`[${p.name}] Imágenes deben tener texto alternativo`, async ({ page }) => {
      await page.goto(p.url);
      await page.waitForTimeout(2000);
      
      const results = await new AxeBuilder({ page })
        .withRules(['image-alt'])
        .analyze();
      
      expect(results.violations).toEqual([]);
    });

    test(`[${p.name}] Botones deben tener texto accesible`, async ({ page }) => {
      await page.goto(p.url);
      await page.waitForTimeout(2000);
      
      const results = await new AxeBuilder({ page })
        .withRules(['button-name'])
        .analyze();
      
      expect(results.violations).toEqual([]);
    });

    test(`[${p.name}] Formularios deben tener labels`, async ({ page }) => {
      await page.goto(p.url);
      await page.waitForTimeout(2000);
      
      const results = await new AxeBuilder({ page })
        .withRules(['label'])
        .analyze();
      
      expect(results.violations).toEqual([]);
    });

  });
}
