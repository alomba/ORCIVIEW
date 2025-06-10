# ORCIVIEW (ORCID Widget Embebible)
Este widget permite incrustar de forma sencilla y atractiva la **producción científica** de cualquier investigador con perfil ORCID, directamente en páginas web personales, sitios institucionales o blogs académicos.

![Logo](img/Logo.png)

Incluye:
- Visualización de publicaciones con iconos temáticos.
- Exportación a Excel.
- Filtro por ID de ORCID desde un campo editable. (en proceso)

## ✨ Ejemplo de uso

![Captura del widget mostrando resultados](img/captura01.png)

> Vista del widget integrado en una sección de investigación personal.

![Captura del widget mostrando resultados](img/captura02.png)


![Exportación a Excel funcionando](img/exportacionExcel.png)
> Resultado de la exportación en Microsoft Excel con enlaces interactivos.

---

## 🎥 Video explicativo

[![En producción]()

> Próximamente un vídeo donde te mostraré paso a paso cómo integrar y personalizar este widget para tu web.

---

## 📦 Archivos

| Archivo                 | Descripción                                      |
|------------------------|--------------------------------------------------|
| `orcid-widgetxml.js`      | Script principal: consulta y renderizado.        |
| `orcid-export.js`      | Exportación a Excel (usa [SheetJS](https://sheetjs.com/)). |
| `index.html`           | Ejemplo base con Bootstrap y Font Awesome.       |
| `img/`              | Carpeta para capturas y materiales gráficos.     |

---

## 🚀 Cómo integrarlo en tu web

1. **Copia el contenido del HTML** en tu página.
2. **Asegúrate de tener cargado**:
   - [jQuery](https://jquery.com/)
   - [Bootstrap](https://getbootstrap.com/)
   - [Font Awesome 5+](https://fontawesome.com/)
   - [SheetJS](https://cdnjs.com/libraries/xlsx) para exportar a Excel.

3. **Añade el script:**
   ```html   
   <script src="https://ayoselomba.es/js/orcid-widgetxml.js"></script>

