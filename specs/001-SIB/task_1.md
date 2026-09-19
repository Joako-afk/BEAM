# Task 1 — Rediseñar selector de color en Categorías

## Problema

El selector de color original en `CategoriaForm.jsx` tenía una UX deficiente:
- Lista vertical de 12 colores predefinidos que ocupaba mucho espacio vertical
- El `input[type="color"]` nativo estaba abajo sin integración visual
- Sin preview de cómo quedará la categoría con el color elegido
- Sin posibilidad de escribir código HEX o RGB directamente

## Objetivo

Rediseñar el selector de color para que sea protagonista, con picker grande, entrada de HEX y RGB, y preview integrada dentro del mismo bloque.

## Archivos afectados

- `FRONTEND/src/components/admin/CategoriaForm.jsx` — único archivo modificado

## Cambios implementados

### 1. Eliminar colores predefinidos

Se eliminó la constante `COLORES_PREDEFINIDOS` y la cuadrícula de botones. El usuario ahora tiene control total del color.

### 2. Funciones de conversión

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

### 3. Nuevo layout del selector — todo dentro de un card

```
┌──────────────────────────────────────────┐
│  [ Color picker nativo (grande ~80px) ]  │
│                                          │
│  HEX   [#011991          ]               │
│  RGB   [1, 25, 145       ]               │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Categoría de ejemplo              │  │
│  │  (fondo = color seleccionado)      │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

- **Color picker:** `input[type="color"]` grande, protagonista
- **HEX:** input de texto editable con validación (`#` + hex, max 7 chars)
- **RGB:** input de texto editable, sincronizado bidireccionalmente con HEX (formato: `r, g, b`)
- **Preview:** tarjeta con fondo del color seleccionado y texto "Categoría de ejemplo" (o el nombre de la categoría si está escrito), dentro del mismo card

### 4. Estado RGB sincronizado

```js
const [rgbText, setRgbText] = useState("");

useEffect(() => {
  if (form.color_primary && form.color_primary.length === 7) {
    const { r, g, b } = hexToRgb(form.color_primary);
    setRgbText(`${r}, ${g}, ${b}`);
  }
}, [form.color_primary]);
```

## Criterios de aceptación

- [x] Sin colores predefinidos — el usuario tiene control total
- [x] Color picker nativo grande y fácil de usar
- [x] Campo HEX editable con validación de caracteres hexadecimales
- [x] Campo RGB editable, sincronizado bidireccionalmente con HEX
- [x] Preview integrada dentro del card de color principal
- [x] La preview muestra el nombre de la categoría si está escrito
- [x] El formulario mantiene la funcionalidad existente (crear/editar)
- [x] Lint y build pasan sin errores

## Fuera de alcance

- Validación de contraste WCAG AA (se implementará en otra tarea)
- Selector de temas (footer) — no se toca
