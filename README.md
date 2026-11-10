# FarmaMálaga · web

Web de **FarmaMálaga**: Farmacia Mata (calle Larios, desde 1894), Farmacia García Carmona (calle Huéscar) y Farmacia Dr. Antonio Romero García (Benalmádena). Muestra las tres farmacias con horario y estado "abierta ahora", los servicios (formulación magistral, homeopatía, herboristería), la línea propia, la historia y el contacto por WhatsApp. Incluye `tienda.html`, un **prototipo de la tienda nueva** con el mismo diseño: catálogo con 21 productos reales, filtros, buscador, ficha rápida y carrito. El pago no está conectado; para comprar sigue la tienda actual (farmamalaga.com).

Es una web estática (HTML + CSS + JavaScript, sin dependencias ni compilación). Se publica tal cual en GitHub Pages, Netlify, Vercel o cualquier hosting. No usa cookies ni analítica, y las tipografías van alojadas en `assets/fonts`.

## Verla en local

```bash
python3 -m http.server 8000   # o: npx serve .
```

y abre http://localhost:8000. (Abriendo `index.html` directamente, el navegador bloquea las tipografías.)

## Qué editar

| Quiero cambiar… | Archivo |
|---|---|
| Teléfonos, WhatsApp, horarios, enlace a la tienda | `js/config.js` (y el horario escrito en `index.html`) |
| Textos de servicios, línea propia, historia | `index.html` |
| Productos y precios del prototipo de tienda | `js/productos.js` (fotos cargadas desde farmamalaga.com) |
| Aviso legal, privacidad, cookies | `legal.html` |
| Colores, tipografía, espaciado | `css/styles.css` (tokens al principio) y `DESIGN.md` |

## Pendiente antes de publicar

- **Confirmar horarios** de las tres farmacias: vienen de la web antigua (2020), incluido el horario de verano de García Carmona (fechas en `verano` de `js/config.js`).
- **Revisar los textos legales** con un asesor (titular, CIF E93297539 tomado de las condiciones de la tienda actual).
- **Fotos reales**: la rebotica, el botamen, las fachadas y el laboratorio. La web funciona sin fotos, pero las del botamen original serían el mejor contenido posible.
- Decidir el dominio: si esta web pasa a `farmamalaga.com`, la tienda tendrá que moverse a un subdominio (p. ej. `tienda.farmamalaga.com`) y actualizar `tienda` en `js/config.js`.
