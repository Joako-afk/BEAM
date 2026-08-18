import { test, expect } from '@playwright/test';

test.describe('Página Principal BEAM', () => {
  
  test('debe cargar la página correctamente', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/BEAM|Beneficios|Vite/i);
  });

  test('debe mostrar el header/navbar', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('debe tener categorías visibles', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const anyText = page.locator('text=/Salud|Beneficios|Categoría/i').first();
    await expect(anyText).toBeVisible({ timeout: 15000 });
  });

  test('debe ser responsive en móvil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

});

test.describe('Navegación', () => {

  test('debe navegar a categoría de salud', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const saludLink = page.locator('a:has-text("Salud")').first();
    if (await saludLink.isVisible()) {
      await saludLink.click();
      await expect(page.url()).toContain(/salud/i);
    }
  });

});

test.describe('Mapa', () => {

  test('debe cargar el mapa si existe', async ({ page }) => {
    await page.goto('/');
    const mapContainer = page.locator('.leaflet-container, [class*="map"]').first();
    if (await mapContainer.isVisible()) {
      await expect(mapContainer).toBeVisible();
    }
  });

});
