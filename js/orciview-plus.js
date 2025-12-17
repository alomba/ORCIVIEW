/**
 * ORCIVIEW Plus v2.0 - JavaScript Principal
 * Visualizador completo de perfil ORCID con filtros por tipo
 * 
 * @author Ayose Lomba Pérez
 * @license MIT
 * @version 2.0.0
 * @url https://ayoselomba.es/orcid
 * 
 * NOVEDADES v2.0:
 * - Filtros por tipo de publicación en cada sección
 * - ORCID por defecto configurable
 * - Contador de resultados filtrados
 * - Mejor rendimiento con carga paralela
 * - Soporte completo para actividades profesionales
 * - Exportación Excel mejorada
 */

(function() {
    'use strict';

    // ==========================================================================
    // CONFIGURACIÓN - Personaliza estos valores
    // ==========================================================================
    const CONFIG = {
        // ORCID por defecto (cámbialo por el tuyo)
        defaultOrcid: '0000-0002-2678-6158',
        
        // ID del contenedor donde se insertará el widget
        containerId: 'orciview-container',
        
        // Pestaña activa por defecto: 'works', 'education', 'employment', 'funding', 'activities'
        defaultTab: 'works',
        
        // Habilitar exportación a Excel
        enableExport: true,
        
        // Mostrar filtros por tipo
        enableFilters: true,
        
        // Idioma: 'es' o 'en'
        language: 'es'
    };

    // ==========================================================================
    // Traducciones
    // ==========================================================================
    const i18n = {
        es: {
            loadProfile: 'Cargar perfil',
            exportExcel: 'Exportar Excel',
            loading: 'Cargando datos de ORCID...',
            errorLoading: 'Error al cargar los datos',
            errorInvalidOrcid: 'El formato del ORCID iD no es válido. Usa el formato: XXXX-XXXX-XXXX-XXXX',
            errorEmpty: 'Por favor, introduce un ORCID iD válido.',
            errorNotFound: 'No se pudieron cargar los datos. Verifica que el ORCID iD existe y es público.',
            present: 'Presente',
            showingResults: 'Mostrando',
            of: 'de',
            results: 'resultados',
            clearFilters: 'Limpiar filtros',
            filterByType: 'Filtrar por tipo',
            noData: 'No hay datos registrados',
            tabs: {
                works: 'Publicaciones',
                education: 'Educación',
                employment: 'Empleo',
                funding: 'Financiación',
                activities: 'Actividades'
            },
            stats: {
                works: 'Publicaciones',
                education: 'Educación',
                employment: 'Empleos',
                funding: 'Financiación',
                activities: 'Actividades'
            },
            workTypes: {
                'journal-article': 'Artículo de revista',
                'book': 'Libro',
                'book-chapter': 'Capítulo de libro',
                'book-review': 'Reseña de libro',
                'conference-paper': 'Ponencia',
                'conference-abstract': 'Resumen de conferencia',
                'conference-poster': 'Póster',
                'dataset': 'Dataset',
                'dictionary-entry': 'Entrada de diccionario',
                'dissertation': 'Tesis doctoral',
                'edited-book': 'Libro editado',
                'encyclopedia-entry': 'Entrada de enciclopedia',
                'invention': 'Invención',
                'journal-issue': 'Número de revista',
                'lecture-speech': 'Conferencia/Charla',
                'magazine-article': 'Artículo de revista',
                'manual': 'Manual',
                'newsletter-article': 'Artículo de boletín',
                'newspaper-article': 'Artículo de periódico',
                'online-resource': 'Recurso online',
                'other': 'Otro',
                'patent': 'Patente',
                'physical-object': 'Objeto físico',
                'preprint': 'Preprint',
                'registered-copyright': 'Copyright registrado',
                'report': 'Informe',
                'research-technique': 'Técnica de investigación',
                'research-tool': 'Herramienta de investigación',
                'software': 'Software',
                'spin-off-company': 'Spin-off',
                'standards-and-policy': 'Estándares y políticas',
                'supervised-student-publication': 'Publicación de estudiante supervisado',
                'technical-standard': 'Estándar técnico',
                'test': 'Test',
                'thesis': 'Tesis',
                'trademark': 'Marca registrada',
                'translation': 'Traducción',
                'website': 'Sitio web',
                'working-paper': 'Documento de trabajo'
            },
            activityTypes: {
                'distinction': 'Distinción',
                'invited-position': 'Posición invitada',
                'membership': 'Membresía',
                'qualification': 'Cualificación',
                'service': 'Servicio'
            },
            fundingTypes: {
                'grant': 'Subvención',
                'contract': 'Contrato',
                'award': 'Premio',
                'salary-award': 'Premio salarial'
            }
        },
        en: {
            loadProfile: 'Load profile',
            exportExcel: 'Export Excel',
            loading: 'Loading ORCID data...',
            errorLoading: 'Error loading data',
            errorInvalidOrcid: 'Invalid ORCID iD format. Use format: XXXX-XXXX-XXXX-XXXX',
            errorEmpty: 'Please enter a valid ORCID iD.',
            errorNotFound: 'Could not load data. Verify the ORCID iD exists and is public.',
            present: 'Present',
            showingResults: 'Showing',
            of: 'of',
            results: 'results',
            clearFilters: 'Clear filters',
            filterByType: 'Filter by type',
            noData: 'No data available',
            tabs: {
                works: 'Publications',
                education: 'Education',
                employment: 'Employment',
                funding: 'Funding',
                activities: 'Activities'
            },
            stats: {
                works: 'Publications',
                education: 'Education',
                employment: 'Employment',
                funding: 'Funding',
                activities: 'Activities'
            },
            workTypes: {
                'journal-article': 'Journal Article',
                'book': 'Book',
                'book-chapter': 'Book Chapter',
                'conference-paper': 'Conference Paper',
                'dataset': 'Dataset',
                'dissertation': 'Dissertation',
                'preprint': 'Preprint',
                'report': 'Report',
                'software': 'Software',
                'thesis': 'Thesis',
                'other': 'Other'
            },
            activityTypes: {
                'distinction': 'Distinction',
                'invited-position': 'Invited Position',
                'membership': 'Membership',
                'qualification': 'Qualification',
                'service': 'Service'
            },
            fundingTypes: {
                'grant': 'Grant',
                'contract': 'Contract',
                'award': 'Award',
                'salary-award': 'Salary Award'
            }
        }
    };

    const t = i18n[CONFIG.language] || i18n.es;

    // ==========================================================================
    // Estado de la aplicación
    // ==========================================================================
    let orcidData = null;
    let currentOrcid = '';
    let activeFilters = {
        works: [],
        education: [],
        employment: [],
        funding: [],
        activities: []
    };

    // ==========================================================================
    // Elementos del DOM
    // ==========================================================================
    let elements = {};

    // ==========================================================================
    // Iconos por tipo de trabajo
    // ==========================================================================
    const workTypeIcons = {
        'journal-article': 'fa-file-alt',
        'book': 'fa-book',
        'book-chapter': 'fa-bookmark',
        'conference-paper': 'fa-users',
        'conference-abstract': 'fa-comments',
        'conference-poster': 'fa-image',
        'dataset': 'fa-database',
        'dissertation': 'fa-scroll',
        'edited-book': 'fa-book-open',
        'encyclopedia-entry': 'fa-atlas',
        'invention': 'fa-lightbulb',
        'journal-issue': 'fa-newspaper',
        'lecture-speech': 'fa-microphone',
        'magazine-article': 'fa-newspaper',
        'manual': 'fa-file-pdf',
        'online-resource': 'fa-globe',
        'other': 'fa-file',
        'patent': 'fa-certificate',
        'physical-object': 'fa-cube',
        'preprint': 'fa-file-code',
        'registered-copyright': 'fa-copyright',
        'report': 'fa-clipboard',
        'research-technique': 'fa-flask',
        'research-tool': 'fa-tools',
        'software': 'fa-code',
        'spin-off-company': 'fa-building',
        'standards-and-policy': 'fa-gavel',
        'supervised-student-publication': 'fa-user-graduate',
        'technical-standard': 'fa-ruler',
        'test': 'fa-vial',
        'thesis': 'fa-graduation-cap',
        'trademark': 'fa-tm',
        'translation': 'fa-language',
        'website': 'fa-sitemap',
        'working-paper': 'fa-file-alt',
        'default': 'fa-file'
    };

    // ==========================================================================
    // Inicialización
    // ==========================================================================
    function init() {
        cacheElements();
        bindEvents();
        
        // Cargar ORCID desde URL o usar el por defecto
        const urlParams = new URLSearchParams(window.location.search);
        const orcidParam = urlParams.get('orcid');
        
        if (orcidParam) {
            elements.orcidInput.value = orcidParam;
            handleSearch();
        } else if (CONFIG.defaultOrcid) {
            elements.orcidInput.value = CONFIG.defaultOrcid;
            handleSearch();
        }
    }

    function cacheElements() {
        elements = {
            orcidInput: document.getElementById('orcid-input'),
            btnSearch: document.getElementById('btn-search'),
            btnExport: document.getElementById('btn-export'),
            loading: document.getElementById('loading'),
            errorMessage: document.getElementById('error-message'),
            errorText: document.getElementById('error-text'),
            profileCard: document.getElementById('profile-card'),
            profileAvatar: document.getElementById('profile-avatar'),
            profileName: document.getElementById('profile-name'),
            profileOrcidLink: document.getElementById('profile-orcid-link'),
            profileBio: document.getElementById('profile-bio'),
            resultsSection: document.getElementById('results-section'),
            worksList: document.getElementById('works-list'),
            educationList: document.getElementById('education-list'),
            employmentList: document.getElementById('employment-list'),
            fundingList: document.getElementById('funding-list'),
            activitiesList: document.getElementById('activities-list')
        };
    }

    function bindEvents() {
        elements.btnSearch?.addEventListener('click', handleSearch);
        elements.btnExport?.addEventListener('click', handleExport);
        elements.orcidInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });

        // Navegación por pestañas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });
    }

    // ==========================================================================
    // Validación
    // ==========================================================================
    function validateOrcid(orcid) {
        const pattern = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
        return pattern.test(orcid);
    }

    // ==========================================================================
    // Estados de UI
    // ==========================================================================
    function setLoading(isLoading) {
        elements.loading?.classList.toggle('visible', isLoading);
        if (elements.btnSearch) elements.btnSearch.disabled = isLoading;
    }

    function showError(message) {
        if (elements.errorText) elements.errorText.textContent = message;
        elements.errorMessage?.classList.add('visible');
    }

    function hideError() {
        elements.errorMessage?.classList.remove('visible');
    }

    // ==========================================================================
    // Búsqueda principal
    // ==========================================================================
    async function handleSearch() {
        const orcid = elements.orcidInput?.value.trim();

        if (!orcid) {
            showError(t.errorEmpty);
            return;
        }

        if (!validateOrcid(orcid)) {
            showError(t.errorInvalidOrcid);
            return;
        }

        hideError();
        setLoading(true);
        currentOrcid = orcid;

        // Resetear filtros
        activeFilters = { works: [], education: [], employment: [], funding: [], activities: [] };

        try {
            await fetchOrcidData(orcid);
            renderProfile();
            renderAllSections();
            elements.profileCard?.classList.add('visible');
            if (elements.resultsSection) elements.resultsSection.style.display = 'block';
            if (elements.btnExport) elements.btnExport.disabled = false;

            // Actualizar URL
            const url = new URL(window.location);
            url.searchParams.set('orcid', orcid);
            window.history.pushState({}, '', url);

        } catch (error) {
            console.error('Error fetching ORCID data:', error);
            showError(t.errorNotFound);
            elements.profileCard?.classList.remove('visible');
            if (elements.resultsSection) elements.resultsSection.style.display = 'none';
        } finally {
            setLoading(false);
        }
    }

    // ==========================================================================
    // Obtención de datos de ORCID API
    // ==========================================================================
    async function fetchOrcidData(orcid) {
        const baseUrl = `https://pub.orcid.org/v3.0/${orcid}`;
        const headers = { 'Accept': 'application/json' };

        const [record, works, educations, employments, fundings, distinctions, invitedPositions, memberships, qualifications, services] = await Promise.all([
            fetch(`${baseUrl}/record`, { headers }).then(r => r.json()),
            fetch(`${baseUrl}/works`, { headers }).then(r => r.json()),
            fetch(`${baseUrl}/educations`, { headers }).then(r => r.json()),
            fetch(`${baseUrl}/employments`, { headers }).then(r => r.json()),
            fetch(`${baseUrl}/fundings`, { headers }).then(r => r.json()),
            fetch(`${baseUrl}/distinctions`, { headers }).then(r => r.json()).catch(() => ({ 'affiliation-group': [] })),
            fetch(`${baseUrl}/invited-positions`, { headers }).then(r => r.json()).catch(() => ({ 'affiliation-group': [] })),
            fetch(`${baseUrl}/memberships`, { headers }).then(r => r.json()).catch(() => ({ 'affiliation-group': [] })),
            fetch(`${baseUrl}/qualifications`, { headers }).then(r => r.json()).catch(() => ({ 'affiliation-group': [] })),
            fetch(`${baseUrl}/services`, { headers }).then(r => r.json()).catch(() => ({ 'affiliation-group': [] }))
        ]);

        orcidData = {
            record,
            works,
            educations,
            employments,
            fundings,
            activities: { distinctions, invitedPositions, memberships, qualifications, services }
        };
    }

    // ==========================================================================
    // Utilidades
    // ==========================================================================
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function getInitials(name) {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    function formatDate(dateObj) {
        if (!dateObj) return '';
        const year = dateObj.year?.value;
        const month = dateObj.month?.value;
        const day = dateObj.day?.value;
        if (!year) return '';
        let date = year;
        if (month) date = `${month.padStart(2, '0')}/${date}`;
        if (day) date = `${day.padStart(2, '0')}/${date}`;
        return date;
    }

    function formatDateRange(startDate, endDate) {
        const start = formatDate(startDate);
        const end = formatDate(endDate) || t.present;
        if (!start) return '';
        return `${start} - ${end}`;
    }

    /**
     * Convierte un objeto de fecha ORCID a timestamp para ordenación
     * Devuelve fecha más reciente si no hay fecha (para items activos)
     */
    function dateToTimestamp(dateObj) {
        if (!dateObj) return Date.now(); // Sin fecha = actual (más reciente)
        const year = parseInt(dateObj.year?.value) || 0;
        const month = parseInt(dateObj.month?.value) || 1;
        const day = parseInt(dateObj.day?.value) || 1;
        return new Date(year, month - 1, day).getTime();
    }

    /**
     * Ordena items por fecha de inicio (más reciente primero)
     * Si no hay fecha de inicio, usa fecha de fin
     * Si no hay ninguna fecha, va al principio (item activo)
     */
    function sortByDateDesc(items, startDateKey = 'start-date', endDateKey = 'end-date') {
        return items.sort((a, b) => {
            // Prioridad: fecha de inicio, si no hay usa fecha de fin
            const dateA = a[startDateKey] || a[endDateKey];
            const dateB = b[startDateKey] || b[endDateKey];
            const timestampA = dateToTimestamp(dateA);
            const timestampB = dateToTimestamp(dateB);
            return timestampB - timestampA; // Descendente (más reciente primero)
        });
    }

    function formatWorkType(type) {
        return t.workTypes[type] || type?.replace(/-/g, ' ') || '';
    }

    function formatFundingType(type) {
        return t.fundingTypes[type] || type || '';
    }

    function formatActivityType(type) {
        return t.activityTypes[type] || type || '';
    }

    // ==========================================================================
    // Obtener tipos únicos para filtros
    // ==========================================================================
    function getWorkTypes() {
        const groups = orcidData?.works?.group || [];
        const typeCounts = {};
        groups.forEach(group => {
            const type = group['work-summary'][0]?.type || 'other';
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        return typeCounts;
    }

    function getFundingTypes() {
        const groups = orcidData?.fundings?.group || [];
        const typeCounts = {};
        groups.forEach(group => {
            const type = group['funding-summary'][0]?.type || 'other';
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        return typeCounts;
    }

    function getActivityTypes() {
        const typeCounts = {};
        const activityKeys = [
            { key: 'distinctions', type: 'distinction' },
            { key: 'invitedPositions', type: 'invited-position' },
            { key: 'memberships', type: 'membership' },
            { key: 'qualifications', type: 'qualification' },
            { key: 'services', type: 'service' }
        ];
        activityKeys.forEach(({ key, type }) => {
            const count = orcidData?.activities[key]?.['affiliation-group']?.length || 0;
            if (count > 0) typeCounts[type] = count;
        });
        return typeCounts;
    }

    // ==========================================================================
    // Renderizado de filtros
    // ==========================================================================
    function renderFilters(containerId, types, section, formatFn) {
        const container = document.getElementById(containerId);
        if (!container || !CONFIG.enableFilters) return;

        const typeEntries = Object.entries(types);
        if (typeEntries.length <= 1) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        container.innerHTML = `
            <div class="filters-header">
                <span class="filters-title">
                    <i class="fas fa-filter"></i>
                    ${t.filterByType}
                </span>
                <button class="filters-clear" data-section="${section}">
                    ${t.clearFilters}
                </button>
            </div>
            <div class="filters-list">
                ${typeEntries.map(([type, count]) => `
                    <button class="filter-chip ${activeFilters[section].includes(type) ? 'active' : ''}" 
                            data-type="${type}" 
                            data-section="${section}">
                        ${formatFn(type)}
                        <span class="count">(${count})</span>
                    </button>
                `).join('')}
            </div>
        `;

        // Event listeners para filtros
        container.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => toggleFilter(chip.dataset.section, chip.dataset.type));
        });

        container.querySelector('.filters-clear')?.addEventListener('click', () => clearFilters(section));
    }

    function toggleFilter(section, type) {
        const index = activeFilters[section].indexOf(type);
        if (index > -1) {
            activeFilters[section].splice(index, 1);
        } else {
            activeFilters[section].push(type);
        }
        applyFilters(section);
        updateFilterUI(section);
    }

    function clearFilters(section) {
        activeFilters[section] = [];
        applyFilters(section);
        updateFilterUI(section);
    }

    function updateFilterUI(section) {
        const container = document.getElementById(`filters-${section}`);
        if (!container) return;

        container.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.toggle('active', activeFilters[section].includes(chip.dataset.type));
        });
    }

    function applyFilters(section) {
        const listId = `${section}-list`;
        const list = document.getElementById(listId);
        if (!list) return;

        const items = list.querySelectorAll('.section-item');
        let visibleCount = 0;
        const totalCount = items.length;

        items.forEach(item => {
            const itemType = item.dataset.type;
            const shouldShow = activeFilters[section].length === 0 || activeFilters[section].includes(itemType);
            item.classList.toggle('hidden', !shouldShow);
            if (shouldShow) visibleCount++;
        });

        // Actualizar contador de resultados
        updateResultsInfo(section, visibleCount, totalCount);
    }

    function updateResultsInfo(section, visible, total) {
        const infoEl = document.getElementById(`results-info-${section}`);
        if (!infoEl) return;

        if (activeFilters[section].length === 0) {
            infoEl.style.display = 'none';
        } else {
            infoEl.style.display = 'flex';
            infoEl.innerHTML = `
                <span class="results-count">
                    ${t.showingResults} <strong>${visible}</strong> ${t.of} ${total} ${t.results}
                </span>
            `;
        }
    }

    // ==========================================================================
    // Renderizado del perfil
    // ==========================================================================
    function renderProfile() {
        const person = orcidData?.record?.person;
        const name = person?.name;
        const fullName = name ? 
            `${name['given-names']?.value || ''} ${name['family-name']?.value || ''}`.trim() : 
            'Sin nombre';

        if (elements.profileName) elements.profileName.textContent = fullName;
        if (elements.profileAvatar) elements.profileAvatar.textContent = getInitials(fullName);
        if (elements.profileOrcidLink) {
            elements.profileOrcidLink.textContent = currentOrcid;
            elements.profileOrcidLink.href = `https://orcid.org/${currentOrcid}`;
        }

        // Biografía
        const bio = person?.biography?.content || '';
        if (elements.profileBio) {
            elements.profileBio.textContent = bio;
            elements.profileBio.style.display = bio ? 'block' : 'none';
        }

        // Estadísticas
        const worksCount = orcidData?.works?.group?.length || 0;
        const educationCount = orcidData?.educations?.['affiliation-group']?.length || 0;
        const employmentCount = orcidData?.employments?.['affiliation-group']?.length || 0;
        const fundingCount = orcidData?.fundings?.group?.length || 0;
        const activitiesCount = 
            (orcidData?.activities?.distinctions?.['affiliation-group']?.length || 0) +
            (orcidData?.activities?.invitedPositions?.['affiliation-group']?.length || 0) +
            (orcidData?.activities?.memberships?.['affiliation-group']?.length || 0) +
            (orcidData?.activities?.qualifications?.['affiliation-group']?.length || 0) +
            (orcidData?.activities?.services?.['affiliation-group']?.length || 0);

        const setCount = (id, count) => {
            const el = document.getElementById(id);
            if (el) el.textContent = count;
        };

        setCount('stat-works', worksCount);
        setCount('stat-education', educationCount);
        setCount('stat-employment', employmentCount);
        setCount('stat-funding', fundingCount);
        setCount('stat-activities', activitiesCount);

        setCount('badge-works', worksCount);
        setCount('badge-education', educationCount);
        setCount('badge-employment', employmentCount);
        setCount('badge-funding', fundingCount);
        setCount('badge-activities', activitiesCount);
    }

    // ==========================================================================
    // Renderizado de secciones
    // ==========================================================================
    function renderWorks() {
        const groups = orcidData?.works?.group || [];
        const list = elements.worksList;
        if (!list) return;

        // Renderizar filtros
        renderFilters('filters-works', getWorkTypes(), 'works', formatWorkType);

        list.innerHTML = '';

        if (groups.length === 0) {
            list.innerHTML = `
                <li class="empty-state">
                    <i class="fas fa-book" aria-hidden="true"></i>
                    <p>${t.noData}</p>
                </li>
            `;
            return;
        }

        groups.forEach(group => {
            const work = group['work-summary'][0];
            const title = work.title?.title?.value || 'Sin título';
            const type = work.type || 'other';
            const year = work['publication-date']?.year?.value || '';
            const journal = work['journal-title']?.value || '';
            const externalIds = work['external-ids']?.['external-id'] || [];
            const doi = externalIds.find(id => id['external-id-type'] === 'doi');
            const url = doi ? `https://doi.org/${doi['external-id-value']}` : work.url?.value || null;
            const icon = workTypeIcons[type] || workTypeIcons.default;

            const li = document.createElement('li');
            li.className = 'section-item works';
            li.dataset.type = type;
            li.innerHTML = `
                <div class="item-header">
                    <div class="item-icon works">
                        <i class="fas ${icon}" aria-hidden="true"></i>
                    </div>
                    <div class="item-content">
                        <h3 class="item-title">
                            ${url ? `<a href="${url}" target="_blank" rel="noopener">${escapeHtml(title)}</a>` : escapeHtml(title)}
                        </h3>
                        ${journal ? `<p class="item-subtitle">${escapeHtml(journal)}</p>` : ''}
                        <div class="item-meta">
                            ${year ? `<span><i class="fas fa-calendar-alt" aria-hidden="true"></i> ${year}</span>` : ''}
                            <span class="item-type-badge">${formatWorkType(type)}</span>
                            ${doi ? `<span><i class="fas fa-link" aria-hidden="true"></i> ${doi['external-id-value']}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
            list.appendChild(li);
        });
    }

    function renderEducation() {
        const groups = orcidData?.educations?.['affiliation-group'] || [];
        const list = elements.educationList;
        if (!list) return;

        list.innerHTML = '';

        if (groups.length === 0) {
            list.innerHTML = `
                <li class="empty-state">
                    <i class="fas fa-graduation-cap" aria-hidden="true"></i>
                    <p>${t.noData}</p>
                </li>
            `;
            return;
        }

        // Extraer y ordenar por fecha (más reciente primero)
        const eduItems = groups.map(group => group.summaries[0]['education-summary']);
        sortByDateDesc(eduItems);

        eduItems.forEach(edu => {
            const role = edu['role-title'] || 'Titulación';
            const org = edu.organization?.name || '';
            const dept = edu['department-name'] || '';
            const dates = formatDateRange(edu['start-date'], edu['end-date']);

            const li = document.createElement('li');
            li.className = 'section-item education';
            li.innerHTML = `
                <div class="item-header">
                    <div class="item-icon education">
                        <i class="fas fa-graduation-cap" aria-hidden="true"></i>
                    </div>
                    <div class="item-content">
                        <h3 class="item-title">${escapeHtml(role)}</h3>
                        <p class="item-subtitle">${escapeHtml(org)}</p>
                        <div class="item-meta">
                            ${dept ? `<span><i class="fas fa-building" aria-hidden="true"></i> ${escapeHtml(dept)}</span>` : ''}
                            ${dates ? `<span><i class="fas fa-calendar-alt" aria-hidden="true"></i> ${dates}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
            list.appendChild(li);
        });
    }

    function renderEmployment() {
        const groups = orcidData?.employments?.['affiliation-group'] || [];
        const list = elements.employmentList;
        if (!list) return;

        list.innerHTML = '';

        if (groups.length === 0) {
            list.innerHTML = `
                <li class="empty-state">
                    <i class="fas fa-briefcase" aria-hidden="true"></i>
                    <p>${t.noData}</p>
                </li>
            `;
            return;
        }

        // Extraer y ordenar por fecha (más reciente primero)
        const empItems = groups.map(group => group.summaries[0]['employment-summary']);
        sortByDateDesc(empItems);

        empItems.forEach(emp => {
            const role = emp['role-title'] || 'Puesto';
            const org = emp.organization?.name || '';
            const dept = emp['department-name'] || '';
            const dates = formatDateRange(emp['start-date'], emp['end-date']);
            const location = emp.organization?.address;
            const locationStr = location ? 
                [location.city, location.region, location.country].filter(Boolean).join(', ') : '';

            const li = document.createElement('li');
            li.className = 'section-item employment';
            li.innerHTML = `
                <div class="item-header">
                    <div class="item-icon employment">
                        <i class="fas fa-briefcase" aria-hidden="true"></i>
                    </div>
                    <div class="item-content">
                        <h3 class="item-title">${escapeHtml(role)}</h3>
                        <p class="item-subtitle">${escapeHtml(org)}</p>
                        <div class="item-meta">
                            ${dept ? `<span><i class="fas fa-building" aria-hidden="true"></i> ${escapeHtml(dept)}</span>` : ''}
                            ${dates ? `<span><i class="fas fa-calendar-alt" aria-hidden="true"></i> ${dates}</span>` : ''}
                            ${locationStr ? `<span><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${escapeHtml(locationStr)}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
            list.appendChild(li);
        });
    }

    function renderFunding() {
        const groups = orcidData?.fundings?.group || [];
        const list = elements.fundingList;
        if (!list) return;

        // Renderizar filtros
        renderFilters('filters-funding', getFundingTypes(), 'funding', formatFundingType);

        list.innerHTML = '';

        if (groups.length === 0) {
            list.innerHTML = `
                <li class="empty-state">
                    <i class="fas fa-coins" aria-hidden="true"></i>
                    <p>${t.noData}</p>
                </li>
            `;
            return;
        }

        // Extraer y ordenar por fecha (más reciente primero)
        const fundItems = groups.map(group => group['funding-summary'][0]);
        sortByDateDesc(fundItems);

        fundItems.forEach(fund => {
            const title = fund.title?.title?.value || 'Sin título';
            const org = fund.organization?.name || '';
            const type = fund.type || '';
            const dates = formatDateRange(fund['start-date'], fund['end-date']);
            const url = fund.url?.value;

            const li = document.createElement('li');
            li.className = 'section-item funding';
            li.dataset.type = type;
            li.innerHTML = `
                <div class="item-header">
                    <div class="item-icon funding">
                        <i class="fas fa-coins" aria-hidden="true"></i>
                    </div>
                    <div class="item-content">
                        <h3 class="item-title">
                            ${url ? `<a href="${url}" target="_blank" rel="noopener">${escapeHtml(title)}</a>` : escapeHtml(title)}
                        </h3>
                        <p class="item-subtitle">${escapeHtml(org)}</p>
                        <div class="item-meta">
                            ${type ? `<span class="item-type-badge">${formatFundingType(type)}</span>` : ''}
                            ${dates ? `<span><i class="fas fa-calendar-alt" aria-hidden="true"></i> ${dates}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
            list.appendChild(li);
        });
    }

    function renderActivities() {
        const list = elements.activitiesList;
        if (!list) return;

        // Renderizar filtros
        renderFilters('filters-activities', getActivityTypes(), 'activities', formatActivityType);

        const activityTypes = [
            { key: 'distinctions', type: 'distinction', icon: 'fa-award' },
            { key: 'invitedPositions', type: 'invited-position', icon: 'fa-user-tie' },
            { key: 'memberships', type: 'membership', icon: 'fa-id-card' },
            { key: 'qualifications', type: 'qualification', icon: 'fa-certificate' },
            { key: 'services', type: 'service', icon: 'fa-hands-helping' }
        ];

        list.innerHTML = '';

        // Recopilar TODAS las actividades de todos los tipos en un solo array
        const allActivities = [];
        activityTypes.forEach(({ key, type, icon }) => {
            const groups = orcidData?.activities?.[key]?.['affiliation-group'] || [];
            groups.forEach(group => {
                const summaryKey = `${type}-summary`;
                const activity = group.summaries[0][summaryKey];
                allActivities.push({
                    ...activity,
                    activityType: type,
                    activityIcon: icon
                });
            });
        });

        if (allActivities.length === 0) {
            list.innerHTML = `
                <li class="empty-state">
                    <i class="fas fa-award" aria-hidden="true"></i>
                    <p>${t.noData}</p>
                </li>
            `;
            return;
        }

        // Ordenar todas las actividades por fecha (más reciente primero)
        sortByDateDesc(allActivities);

        // Renderizar actividades ordenadas
        allActivities.forEach(activity => {
            const type = activity.activityType;
            const icon = activity.activityIcon;
            const role = activity['role-title'] || formatActivityType(type);
            const org = activity.organization?.name || '';
            const dept = activity['department-name'] || '';
            const dates = formatDateRange(activity['start-date'], activity['end-date']);
            const url = activity.url?.value;

            const li = document.createElement('li');
            li.className = 'section-item activities';
            li.dataset.type = type;
            li.innerHTML = `
                <div class="item-header">
                    <div class="item-icon activities">
                        <i class="fas ${icon}" aria-hidden="true"></i>
                    </div>
                    <div class="item-content">
                        <h3 class="item-title">
                            ${url ? `<a href="${url}" target="_blank" rel="noopener">${escapeHtml(role)}</a>` : escapeHtml(role)}
                        </h3>
                        <p class="item-subtitle">${escapeHtml(org)}</p>
                        <div class="item-meta">
                            <span class="item-type-badge">${formatActivityType(type)}</span>
                            ${dept ? `<span><i class="fas fa-building" aria-hidden="true"></i> ${escapeHtml(dept)}</span>` : ''}
                            ${dates ? `<span><i class="fas fa-calendar-alt" aria-hidden="true"></i> ${dates}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
            list.appendChild(li);
        });
    }

    function renderAllSections() {
        renderWorks();
        renderEducation();
        renderEmployment();
        renderFunding();
        renderActivities();
    }

    // ==========================================================================
    // Cambio de pestaña
    // ==========================================================================
    function switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            const isActive = btn.dataset.tab === tabName;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
        });
    }

    // ==========================================================================
    // Exportación a Excel
    // ==========================================================================
    function handleExport() {
        if (!orcidData || typeof XLSX === 'undefined') {
            console.error('XLSX library not loaded or no data available');
            return;
        }

        const wb = XLSX.utils.book_new();

        // Publicaciones
        const worksData = (orcidData.works?.group || []).map(group => {
            const work = group['work-summary'][0];
            const externalIds = work['external-ids']?.['external-id'] || [];
            const doi = externalIds.find(id => id['external-id-type'] === 'doi');
            return {
                'Título': work.title?.title?.value || '',
                'Tipo': formatWorkType(work.type || ''),
                'Revista/Editorial': work['journal-title']?.value || '',
                'Año': work['publication-date']?.year?.value || '',
                'DOI': doi ? doi['external-id-value'] : '',
                'URL': work.url?.value || ''
            };
        });
        if (worksData.length > 0) {
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(worksData), 'Publicaciones');
        }

        // Educación
        const educationData = (orcidData.educations?.['affiliation-group'] || []).map(group => {
            const edu = group.summaries[0]['education-summary'];
            return {
                'Titulación': edu['role-title'] || '',
                'Institución': edu.organization?.name || '',
                'Departamento': edu['department-name'] || '',
                'Inicio': formatDate(edu['start-date']),
                'Fin': formatDate(edu['end-date']) || t.present
            };
        });
        if (educationData.length > 0) {
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(educationData), 'Educación');
        }

        // Empleo
        const employmentData = (orcidData.employments?.['affiliation-group'] || []).map(group => {
            const emp = group.summaries[0]['employment-summary'];
            const location = emp.organization?.address;
            return {
                'Puesto': emp['role-title'] || '',
                'Organización': emp.organization?.name || '',
                'Departamento': emp['department-name'] || '',
                'Ciudad': location?.city || '',
                'País': location?.country || '',
                'Inicio': formatDate(emp['start-date']),
                'Fin': formatDate(emp['end-date']) || t.present
            };
        });
        if (employmentData.length > 0) {
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(employmentData), 'Empleo');
        }

        // Financiación
        const fundingData = (orcidData.fundings?.group || []).map(group => {
            const fund = group['funding-summary'][0];
            return {
                'Título': fund.title?.title?.value || '',
                'Organización': fund.organization?.name || '',
                'Tipo': formatFundingType(fund.type || ''),
                'Inicio': formatDate(fund['start-date']),
                'Fin': formatDate(fund['end-date']) || t.present,
                'URL': fund.url?.value || ''
            };
        });
        if (fundingData.length > 0) {
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(fundingData), 'Financiación');
        }

        // Actividades
        const activitiesData = [];
        const activityTypes = [
            { key: 'distinctions', type: 'distinction' },
            { key: 'invitedPositions', type: 'invited-position' },
            { key: 'memberships', type: 'membership' },
            { key: 'qualifications', type: 'qualification' },
            { key: 'services', type: 'service' }
        ];
        activityTypes.forEach(({ key, type }) => {
            const groups = orcidData.activities?.[key]?.['affiliation-group'] || [];
            groups.forEach(group => {
                const activity = group.summaries[0][`${type}-summary`];
                activitiesData.push({
                    'Tipo': formatActivityType(type),
                    'Rol': activity['role-title'] || '',
                    'Organización': activity.organization?.name || '',
                    'Departamento': activity['department-name'] || '',
                    'Inicio': formatDate(activity['start-date']),
                    'Fin': formatDate(activity['end-date']) || t.present
                });
            });
        });
        if (activitiesData.length > 0) {
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(activitiesData), 'Actividades');
        }

        // Exportar
        const filename = `ORCID_${currentOrcid}_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, filename);
    }

    // ==========================================================================
    // Iniciar cuando el DOM esté listo
    // ==========================================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exponer configuración para uso externo
    window.ORCIVIEW = {
        config: CONFIG,
        refresh: handleSearch,
        setOrcid: (orcid) => {
            if (elements.orcidInput) {
                elements.orcidInput.value = orcid;
                handleSearch();
            }
        }
    };
})();
