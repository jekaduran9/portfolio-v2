# Portfolio: Jessica Duran - Product Designer

Este proyecto es un portfolio profesional diseñado para destacar trabajos de Product Design y UX/UI, con un enfoque minimalista, editorial y bilingüe.

## 🚀 Estado Actual del Proyecto

El portfolio ha sido construido utilizando **Astro** y **Tailwind CSS v4**, con soporte completo para multi-idioma (Español e Inglés).

### Estructura de Páginas e i18n
El sitio utiliza el sistema nativo de i18n de Astro con las siguientes rutas:
*   **Español (Default)**: `/`, `/about`, `/contact`, `/projects/[slug]`
*   **Inglés**: `/en/`, `/en/about`, `/en/contact`, `/en/projects/[slug]`

### Componentes Clave
1.  **Home**: Hero visual bilingüe y grid de proyectos filtrados por idioma.
2.  **Selector de Idioma**: Ubicado en el header (ES / EN) para navegación instantánea.
3.  **Proyectos**: Casos de estudio dinámicos con soporte para metadatos bilingües.
4.  **Branding**: Uso del logo personalizado `logo-byjeka.png`.

### 🛠️ Stack Tecnológico
*   **Framework**: [Astro](https://astro.build/)
*   **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Color de Fondo**: `#F1EDE4` (Minimalista/Crema)
*   **Tipografía**: *Inter* (Sans) y *Playfair Display* (Serif).
*   **Internacionalización**: Sistema centralizado en `src/i18n/`.

## 📖 Guía de Gestión de Contenido

### Cómo añadir un nuevo proyecto (Bilingüe)
Para que un proyecto aparezca en ambos idiomas, debes crear **dos archivos** en `src/content/projects/` (ej: `mi-proyecto.md` y `mi-proyecto-en.md`):

**Ejemplo de Frontmatter completo:**
```markdown
---
title: "Título del Proyecto"
description: "Descripción corta para la card."
role: "Tu Rol (ej: Lead Designer)"
tools: ["Figma", "Research", "Prototyping"]
type: "App Móvil"
image: "/pj-nombre-cover.png" # Imagen guardada en la carpeta public/
pubDate: 2026-03-07
featured: true # true para mostrar en la Home
lang: "es" # O "en" para la versión en inglés
aspectRatio: "aspect-square" # O "aspect-video" para tarjetas horizontales
---
```

**Pasos adicionales:**
1.  **Imágenes**: Guarda las portadas en `public/` y referéncialas con `/nombre-archivo.png`.
2.  **Contenido**: Escribe el cuerpo del caso de estudio usando Markdown debajo del bloque de metadatos.
3.  **Orden**: Los proyectos se ordenan automáticamente por `pubDate` (más reciente primero).

### Traducciones de Interfaz
Los textos fijos (botones, menú, labels) se gestionan en `src/i18n/ui.ts`. Si necesitas cambiar un texto de la interfaz, edita ese archivo.

### Personalización Visual
*   **Logo**: El archivo se encuentra en `public/logo-byjeka.png`. Su tamaño se ajusta en `src/layouts/BaseLayout.astro`.
*   **Layout**: Estructura base en `src/layouts/BaseLayout.astro`.
*   **Proyectos**: Diseño de caso de estudio en `src/pages/projects/[slug].astro`.

## 📌 Próximos Pasos Sugeridos
*   Sustituir los mockups de ejemplo por imágenes reales en los archivos Markdown.
*   Personalizar el texto de la experiencia laboral en `src/pages/about.astro` y `src/pages/en/about.astro`.
*   Desplegar en Vercel o Netlify para compartir el portfolio.
