import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost:4000/api';

test.describe('API Categorías', () => {

  test('GET /api/categorias debe retornar 4 categorías', async ({ request }) => {
    const response = await request.get(`${API_BASE}/categorias`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBe(4);
  });

  test('GET /api/categorias debe tener estructura correcta', async ({ request }) => {
    const response = await request.get(`${API_BASE}/categorias`);
    const data = await response.json();
    
    const cat = data[0];
    expect(cat).toHaveProperty('id_categoria');
    expect(cat).toHaveProperty('nombre');
    expect(cat).toHaveProperty('slug');
    expect(cat).toHaveProperty('color_primary');
  });

  test('GET /api/categorias/:slug debe retornar categoría válida', async ({ request }) => {
    const response = await request.get(`${API_BASE}/categorias/salud`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.nombre).toContain('Salud');
  });

});

test.describe('API Beneficios', () => {

  test('GET /api/beneficios/categoria/salud debe retornar beneficios', async ({ request }) => {
    const response = await request.get(`${API_BASE}/beneficios/categoria/salud`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('categoria');
    expect(data).toHaveProperty('beneficios');
    expect(Array.isArray(data.beneficios)).toBeTruthy();
  });

  test('GET /api/beneficios/:slug debe retornar EMPAM', async ({ request }) => {
    const response = await request.get(`${API_BASE}/beneficios/examen_medico_preventivo_del_adulto_mayor_(empam)`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.nombre).toContain('EMPAM');
    expect(data.edad_minima).toBe(65);
    expect(data.costo).toBe(0);
  });

  test('GET /api/beneficios/:slug/organismos debe retornar sucursales', async ({ request }) => {
    const response = await request.get(`${API_BASE}/beneficios/examen_medico_preventivo_del_adulto_mayor_(empam)/organismos`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

});

test.describe('API Errores', () => {

  test('GET /api/categorias/:slug inexistente debe retornar 404', async ({ request }) => {
    const response = await request.get(`${API_BASE}/categorias/no-existe`);
    expect(response.status()).toBe(404);
  });

  test('GET /api/beneficios/:slug inexistente debe retornar 404', async ({ request }) => {
    const response = await request.get(`${API_BASE}/beneficios/no-existe`);
    expect(response.status()).toBe(404);
  });

});
