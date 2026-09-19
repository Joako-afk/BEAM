# Task 2 — Implementación del rediseño del selector de color

## Archivo modificado

`FRONTEND/src/components/admin/CategoriaForm.jsx`

## Estado final del archivo

### Funciones de conversión (líneas 4-15)

```js
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const rgbToHex = (r, g, b) => {
  const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
```

### Estado RGB (línea ~22)

```js
const [rgbText, setRgbText] = useState("");

useEffect(() => {
  if (form.color_primary && form.color_primary.length === 7) {
    const { r, g, b } = hexToRgb(form.color_primary);
    setRgbText(`${r}, ${g}, ${b}`);
  }
}, [form.color_primary]);
```

### Sección de color principal (JSX)

Card con borde redondeado que contiene:
1. `input[type="color"]` grande (~80px alto)
2. Campo HEX editable — validación con regex `/^#[0-9A-Fa-f]{0,6}$/`
3. Campo RGB editable — parsing con regex `/^\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*$/`, conversión a HEX con `rgbToHex()`
4. Preview de categoría — fondo con `color_primary`, texto blanco con nombre o "Categoría de ejemplo"

### Eliminado

- `COLORES_PREDEFINIDOS` — constante eliminada
- Cuadrícula 2×2 de botones de color predefinidos

## Verificación

1. `cd FRONTEND && npm run lint` — sin errores en CategoriaForm.jsx
2. `cd FRONTEND && npm run build` — compila correctamente
3. Verificar manualmente:
   - Color picker abre selector de color nativo del SO
   - Escribir HEX válido actualiza el picker y RGB
   - Escribir RGB válido (`r, g, b`) actualiza el picker y HEX
   - Preview se actualiza en tiempo real
   - Preview muestra nombre de la categoría si está escrito
