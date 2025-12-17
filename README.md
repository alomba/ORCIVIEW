# ORCIVIEW Plus v2.0

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![ORCID](https://img.shields.io/badge/ORCID-A6CE39?logo=orcid&logoColor=white)](https://orcid.org)

**Visualizador completo de perfil ORCID** con filtros por tipo de publicación, diseño moderno y accesible.

🔗 **Demo en vivo:** [https://ayoselomba.es/orcid](https://ayoselomba.es/orcid)

---

## ✨ Novedades en v2.0

- 🔍 **Filtros por tipo de publicación** en cada sección
- ⚙️ **ORCID por defecto configurable** - carga automáticamente tu perfil
- 📊 **Contador de resultados** al filtrar
- 🚀 **Mejor rendimiento** con carga paralela de datos
- 🏆 **Soporte completo para actividades profesionales** (distinciones, posiciones invitadas, membresías, cualificaciones, servicios)
- 📱 **Diseño responsive mejorado**
- ♿ **Accesibilidad WCAG 2.1** (skip links, ARIA, reduced motion)
- 📥 **Exportación Excel mejorada** con todas las secciones
- 🌐 **Soporte multiidioma** (español e inglés)

---

## 📦 Instalación

### Opción 1: Usar desde CDN (recomendado)

Simplemente incluye los archivos CSS y JS en tu HTML:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- ORCIVIEW Plus CSS -->
    <link rel="stylesheet" href="https://ayoselomba.es/orcid/css/orciview-plus.css">
</head>
<body>
    <!-- Tu contenido aquí -->
    <!-- Copia la estructura HTML del index.html -->
    
    <!-- SheetJS (para exportar Excel) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    
    <!-- ORCIVIEW Plus JS -->
    <script src="https://ayoselomba.es/orcid/js/orciview-plus.js"></script>
</body>
</html>
```

### Opción 2: Descargar y hospedar

1. Descarga o clona este repositorio
2. Sube los archivos a tu servidor
3. Actualiza las rutas en el HTML:

```html
<link rel="stylesheet" href="css/orciview-plus.css">
<script src="js/orciview-plus.js"></script>
```

---

## ⚙️ Configuración

Edita la configuración al inicio del archivo `js/orciview-plus.js`:

```javascript
const CONFIG = {
    // Tu ORCID por defecto (se carga automáticamente)
    defaultOrcid: '0000-0002-2678-6158',
    
    // Pestaña activa por defecto
    defaultTab: 'works',  // 'works', 'education', 'employment', 'funding', 'activities'
    
    // Habilitar exportación a Excel
    enableExport: true,
    
    // Mostrar filtros por tipo
    enableFilters: true,
    
    // Idioma: 'es' (español) o 'en' (inglés)
    language: 'es'
};
```

---

## 🔗 Cargar un ORCID específico via URL

Puedes cargar cualquier perfil ORCID añadiendo el parámetro `orcid` a la URL:

```
https://ayoselomba.es/orcid/?orcid=0000-0001-2345-6789
```

---

## 🛠️ API JavaScript

ORCIVIEW Plus expone una API global para uso programático:

```javascript
// Cambiar el ORCID y recargar
ORCIVIEW.setOrcid('0000-0001-2345-6789');

// Refrescar los datos actuales
ORCIVIEW.refresh();

// Acceder a la configuración
console.log(ORCIVIEW.config);
```

---

## 📁 Estructura del proyecto

```
ORCIVIEW/
├── index.html              # Página principal
├── css/
│   └── orciview-plus.css   # Estilos completos
├── js/
│   └── orciview-plus.js    # Lógica principal
├── img/
│   └── screenshot.png      # Captura de pantalla
├── README.md               # Esta documentación
├── CHANGELOG.md            # Historial de cambios
└── LICENSE                 # Licencia MIT
```

---

## 🎨 Personalización de estilos

Los estilos usan variables CSS que puedes sobrescribir fácilmente:

```css
:root {
    /* Colores principales */
    --orcid-green: #A6CE39;
    --bg-primary: #0f0f1a;
    --bg-secondary: #1a1a2e;
    --bg-card: #252542;
    --text-primary: #f0f0f5;
    --text-secondary: #a0a0b0;
    
    /* Colores por sección */
    --color-works: #A6CE39;
    --color-education: #4ECDC4;
    --color-employment: #FF6B6B;
    --color-funding: #F39C12;
    --color-activities: #9B59B6;
}
```

### Tema claro

Para usar un tema claro, sobrescribe las variables:

```css
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5f5;
    --bg-card: #ffffff;
    --text-primary: #1a1a2e;
    --text-secondary: #666666;
    --border: rgba(0, 0, 0, 0.1);
}
```

---

## 📊 Secciones disponibles

| Sección | Descripción | Filtros |
|---------|-------------|---------|
| **Publicaciones** | Artículos, libros, conferencias, datasets, software... | ✅ Por tipo |
| **Educación** | Titulaciones académicas | ❌ |
| **Empleo** | Posiciones laborales | ❌ |
| **Financiación** | Proyectos, subvenciones, contratos | ✅ Por tipo |
| **Actividades** | Distinciones, membresías, servicios... | ✅ Por tipo |

---

## 🔌 Endpoints ORCID utilizados

El widget utiliza la **API Pública de ORCID v3.0** (no requiere autenticación):

- `/record` - Información del perfil
- `/works` - Publicaciones
- `/educations` - Educación
- `/employments` - Empleo
- `/fundings` - Financiación
- `/distinctions` - Distinciones
- `/invited-positions` - Posiciones invitadas
- `/memberships` - Membresías
- `/qualifications` - Cualificaciones
- `/services` - Servicios

---

## 📥 Exportación a Excel

El botón "Exportar Excel" genera un archivo `.xlsx` con las siguientes hojas:

1. **Publicaciones** - Título, tipo, revista, año, DOI, URL
2. **Educación** - Titulación, institución, departamento, fechas
3. **Empleo** - Puesto, organización, departamento, ubicación, fechas
4. **Financiación** - Título, organización, tipo, fechas, URL
5. **Actividades** - Tipo, rol, organización, departamento, fechas

Requiere la librería [SheetJS](https://sheetjs.com/).

---

## ♿ Accesibilidad

ORCIVIEW Plus sigue las pautas WCAG 2.1 nivel AA:

- ✅ Skip link para saltar al contenido principal
- ✅ Roles ARIA en pestañas y paneles
- ✅ Estados `aria-selected` y `aria-controls`
- ✅ Focus visible en todos los elementos interactivos
- ✅ Soporte para `prefers-reduced-motion`
- ✅ Textos alternativos y etiquetas descriptivas
- ✅ Contraste de colores adecuado

---

## 🌐 Compatibilidad de navegadores

| Navegador | Versión mínima |
|-----------|----------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |
| Opera | 67+ |

---

## 📝 Changelog

### v2.0.0 (2025)
- ✨ Filtros por tipo de publicación en cada sección
- ✨ ORCID por defecto configurable
- ✨ Contador de resultados filtrados
- ✨ Soporte completo para actividades profesionales
- ✨ API JavaScript pública (`ORCIVIEW.setOrcid()`, etc.)
- ⚡ Mejor rendimiento con carga paralela
- ♿ Mejoras de accesibilidad
- 🎨 Rediseño visual con variables CSS

### v1.0.0 (2024)
- 🎉 Versión inicial
- Visualización de publicaciones
- Exportación básica a Excel

---

## 🤝 Contribuir

Las contribuciones son bienvenidas:

1. Fork este repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👤 Autor

**Ayose Lomba Pérez**

- Web: [ayoselomba.es](https://ayoselomba.es)
- ORCID: [0000-0002-2678-6158](https://orcid.org/0000-0002-2678-6158)
- GitHub: [@alomba](https://github.com/alomba)
- LinkedIn: [ayoselomba](https://linkedin.com/in/ayoselomba)

---

## 🙏 Agradecimientos

- [ORCID](https://orcid.org) por su excelente API pública
- [Font Awesome](https://fontawesome.com) por los iconos
- [SheetJS](https://sheetjs.com) por la exportación a Excel
- [Google Fonts](https://fonts.google.com) por las tipografías Fraunces y Source Sans 3
