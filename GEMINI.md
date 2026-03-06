# Portfolio: Jessica Duran - Product Designer

Este proyecto es un portfolio profesional diseñado para destacar trabajos de Product Design y UX/UI, con un enfoque minimalista, editorial y muy visual.

## 🚀 Estado Actual del Proyecto

El portfolio ha sido construido utilizando **Astro** y **Tailwind CSS v4**, priorizando el rendimiento y la facilidad de gestión de contenido a través de archivos Markdown.

### Estructura de Páginas Implementada
1.  **Home (`/`)**: Hero section con propuesta de valor y grid de 6-8 proyectos destacados.
2.  **Proyectos (`/projects/[slug]`)**: Plantilla dinámica para casos de estudio (UX Case Studies) que incluye:
    *   Contexto, Problema y Objetivo.
    *   Mi Rol y Herramientas (Figma, Research, etc.).
    *   Secciones visuales de proceso (Research, Wireframes, UI).
    *   Resultados e Impacto.
    *   Navegación entre proyectos.
3.  **About Me (`/about`)**: Perfil profesional, experiencia laboral y servicios ofrecidos.
4.  **Contacto (`/contact`)**: Sección directa para colaboraciones, email y redes sociales (LinkedIn, Behance, Instagram).

### 🛠️ Stack Tecnológico
*   **Framework**: [Astro](https://astro.build/)
*   **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) (con plugin `@tailwindcss/typography`)
*   **Tipografía**: 
    *   *Inter*: Para cuerpo de texto y UI (moderno y legible).
    *   *Playfair Display*: Para detalles editoriales y énfasis (elegante y clásico).
*   **Gestión de Contenido**: Astro Content Collections (Markdown).

## 📖 Guía de Gestión de Contenido

### Cómo añadir un nuevo proyecto
Para añadir un nuevo caso de estudio, crea un archivo `.md` en la carpeta `src/content/projects/` con el siguiente formato:

```markdown
---
title: "Nombre del Proyecto"
description: "Breve descripción de una línea."
role: "Tu Rol (ej. Lead Designer)"
tools: ["Figma", "User Research"]
type: "Tipo (ej. Mobile App, SaaS)"
image: "https://url-de-tu-imagen.com"
pubDate: 2026-03-06
featured: true
---
# Contexto
Escribe aquí el contexto del proyecto...

## Problema
Describe el problema a resolver...

## Proceso de Diseño
Detalla tu proceso...
```

### Personalización Visual
*   **Layout Global**: Modifica `src/layouts/BaseLayout.astro` para cambios en el header, footer o estructura base.
*   **Estilos Globales**: Ubicados en `src/styles/global.css`.
*   **Colores y Tipografía**: Gestionados a través de clases de Tailwind en los componentes y páginas.

## 📌 Próximos Pasos Sugeridos
*   Reemplazar imágenes de placeholder por mockups reales en `src/content/projects/`.
*   Actualizar la experiencia laboral real en `src/pages/about.astro`.
*   Configurar un dominio propio para el despliegue (Vercel o Netlify recomendados).
