// orcid-widget.js
(function(){
  'use strict';

  const inputId   = 'orcid-input';
  const listId    = 'research-works-list';
  const buttonId  = 'btnExportExcel';
  const counterId = 'research-works-counter';

  let orcidWorksData = [];

  const base = 'fas';
  const size = 'fa-2x';
  const color = 'text-primary';
  const space = 'mr-3';

  function getIconForType(type) {
    type = (type || '').toLowerCase();
    if (type.includes('blog-post')) {
      return `<i class="${base} fa-edit ${size} ${color} ${space}" title="Entrada de blog"></i>`;
    }
    if (type.includes('chapter')) {
      return `<i class="${base} fa-bookmark ${size} ${color} ${space}" title="Capítulo de libro"></i>`;
    }
    if (type.includes('book') && !type.includes('ebook')) {
      return `<i class="${base} fa-book ${size} ${color} ${space}" title="Libro"></i>`;
    }
    if (type.includes('journal') || type.includes('article')) {
      return `<i class="${base} fa-file-alt ${size} ${color} ${space}" title="Artículo académico"></i>`;
    }
    if (type.includes('conference-paper') || type.includes('proceedings')) {
      return `<i class="${base} fa-file ${size} ${color} ${space}" title="Actas de conferencia"></i>`;
    }
    if (type.includes('conference-presentation') || type.includes('presentation')) {
      return `<i class="${base} fa-microphone-alt ${size} ${color} ${space}" title="Presentación en conferencia"></i>`;
    }
    if (type.includes('dataset')) {
      return `<i class="${base} fa-database ${size} ${color} ${space}" title="Conjunto de datos"></i>`;
    }
    if (type.includes('patent')) {
      return `<i class="${base} fa-lightbulb ${size} ${color} ${space}" title="Patente"></i>`;
    }
    if (type.includes('poster')) {
      return `<i class="${base} fa-image ${size} ${color} ${space}" title="Póster"></i>`;
    }
    return `<i class="${base} fa-file ${size} ${color} ${space}" title="Otra obra"></i>`;
  }

  function loadWorks(orcidId, listEl) {
    listEl.innerHTML = '<li class="text-center text-muted">Cargando obras…</li>';
    const exportBtn = document.getElementById(buttonId);
    if (exportBtn) exportBtn.disabled = true;
    orcidWorksData = [];

    fetch(`https://pub.orcid.org/v3.0/${orcidId}/works`, {
      headers: { 'Accept': 'application/vnd.orcid+json' }
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      listEl.innerHTML = '';
      const groups = data.group || [];
      const counterEl = document.getElementById(counterId);
      if (counterEl) counterEl.textContent = groups.length;

      if (!groups.length) {
        listEl.innerHTML = '<li class="text-center">No hay obras públicas.</li>';
        return;
      }

      groups.forEach(g => {
        const s = (g['work-summary'] || [])[0];
        if (!s) return;

        const title = (s.title?.title?.value || 'Sin título').toUpperCase();
        const type  = s.type || 'Desconocido';

        let pubUrl = s.url?.value || '';
        if (!pubUrl) {
          const ext = s['external-ids']?.['external-id'] || [];
          const u = ext.find(e => e['external-id-type']?.toLowerCase() === 'url');
          if (u?.['external-id-url']?.value) pubUrl = u['external-id-url'].value;
        }

        orcidWorksData.push({
          Título: title,
          Tipo: type,
          Enlace: pubUrl || 'Sin enlace'
        });

        const icon = getIconForType(type);
        const link = pubUrl
          ? `<a href="${pubUrl}" target="_blank" rel="noopener">Enlace</a>`
          : '<span>Sin enlace</span>';

        const li = document.createElement('li');
        li.className = 'd-flex align-items-start mb-3';
        li.innerHTML = `
          ${icon}
          <div class="flex-grow-1">
            <div class="font-weight-bold mb-1">${title}</div>
            <div class="text-muted small">
              Tipo: ${type}<br>${link}
            </div>
          </div>`;
        listEl.appendChild(li);
      });

      if (orcidWorksData.length && exportBtn) {
        exportBtn.disabled = false;
      }
    })
    .catch(err => {
      listEl.innerHTML = `<li class="text-danger text-center">Error: ${err.message}</li>`;
      console.error(err);
    });
  }

  function exportWorksToExcel() {
    if (!orcidWorksData.length) return;
    if (typeof XLSX === 'undefined') {
      console.error('SheetJS (XLSX) no está cargado');
      return;
    }

    const aoa = [['Título', 'Tipo', 'Enlace']];

    orcidWorksData.forEach(item => {
      const link = item.Enlace && item.Enlace !== 'Sin enlace'
        ? { f: `HYPERLINK(\"${item.Enlace}\", \"${item.Título}\")` }
        : 'Sin enlace';
      aoa.push([item.Título, item.Tipo, link]);
    });

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Producción científica');
    XLSX.writeFile(wb, 'produccion_orcid.xlsx');
  }

  document.addEventListener('DOMContentLoaded', function(){
    const listEl = document.getElementById(listId);

    document.getElementById('btnResearchOrcid').addEventListener('click', function() {
      const orcid = document.getElementById(inputId).value.trim();
      loadWorks(orcid, listEl);
    });

    const exportBtn = document.getElementById(buttonId);
    if (exportBtn) {
      exportBtn.addEventListener('click', exportWorksToExcel);
    }
  });

})();
