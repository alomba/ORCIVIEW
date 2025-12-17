# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [2.0.0] - 2025-01-XX

### Añadido
- **Filtros por tipo de publicación**: Ahora puedes filtrar publicaciones, financiación y actividades por su tipo específico
- **ORCID por defecto configurable**: El widget carga automáticamente un ORCID configurado
- **Contador de resultados filtrados**: Muestra cuántos elementos coinciden con los filtros activos
- **Soporte completo para actividades profesionales**: Incluye distinciones, posiciones invitadas, membresías, cualificaciones y servicios
- **API JavaScript pública**: Métodos `ORCIVIEW.setOrcid()` y `ORCIVIEW.refresh()` para uso programático
- **Soporte multiidioma**: Español e inglés disponibles
- **Skip link** para accesibilidad
- **Soporte para `prefers-reduced-motion`**
- Variables CSS personalizables para tematización

### Mejorado
- **Rendimiento**: Carga paralela de todos los endpoints ORCID
- **Accesibilidad**: Roles ARIA completos en pestañas y paneles
- **Diseño responsive**: Mejor adaptación a dispositivos móviles
- **Exportación Excel**: Ahora incluye todas las secciones con formato mejorado
- Separación de CSS y JS del HTML
- Documentación completa en README

### Cambiado
- Estructura del proyecto reorganizada (css/, js/, img/)
- URLs de recursos apuntan a https://ayoselomba.es/orcid por defecto

### Corregido
- Manejo de errores mejorado cuando endpoints no responden
- Escape de HTML para prevenir XSS
- Formato de fechas consistente en todas las secciones

## [1.0.0] - 2024-XX-XX

### Añadido
- Visualización básica de producción científica desde ORCID
- Exportación a Excel de publicaciones
- Diseño inicial con tema oscuro
- Integración con API pública de ORCID v3.0

---

## Tipos de cambios

- **Añadido** para nuevas funcionalidades
- **Cambiado** para cambios en funcionalidades existentes
- **Obsoleto** para funcionalidades que serán eliminadas
- **Eliminado** para funcionalidades eliminadas
- **Corregido** para corrección de errores
- **Seguridad** para vulnerabilidades
