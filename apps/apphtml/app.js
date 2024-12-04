const packsContainer = document.getElementById('packs-container');
const galleryContainer = document.getElementById('gallery-container');
// const packTitle = document.getElementById('pack-title');

// Ruta base para los assets
// const BASE_PATH = './assets/';

const BASE_PATH  = 'https://raw.githubusercontent.com/estebanrfp/ovgrid-assets/master/assets2/';

let allItems = []; // Aquí guardaremos todos los elementos cargados para facilitar el filtrado

// Inicializar la app cargando packs y generando botones de filtro
async function init() {
  try {
    const index = await fetch(`${BASE_PATH}index.json`).then(res => res.json());
    index.packs.forEach(pack => {
      // Crear botón para cada pack
      const packButton = document.createElement('button');
      packButton.textContent = pack.title;
      packButton.onclick = () => loadPack(pack);
      packsContainer.appendChild(packButton);
      
    });
    
  } catch (err) {
    console.error('Error cargando el índice:', err);
  }
}

// Cargar un pack específico
async function loadPack(pack) {
  try {
    // packTitle.textContent = pack.title;
    galleryContainer.innerHTML = '';
    allItems = pack.items; // Guardamos todos los elementos para los filtros
    renderGallery(allItems);

    // Crear botones de filtro
    generateFilters(allItems);
  } catch (err) {
    console.error('Error cargando el pack:', err);
  }
}

// Renderizar los elementos en la galería
function renderGallery(items) {
  galleryContainer.innerHTML = ''; // Limpiar galería
  items.forEach(item => {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');
    galleryItem.innerHTML = `
    <a href="/${BASE_PATH}/${item.glb}" class="gallery-link">
      <img src="${BASE_PATH}${item.thumbnail}" alt="${item.name}">
    </a>
    <h3>${item.name}</h3>
    `;
    galleryContainer.appendChild(galleryItem);
  });
}

// Generar botones para los filtros (tags y categorías)
function generateFilters(items) {
  const filtersContainer = document.createElement('div');
  filtersContainer.id = 'filters-container';

  // Filtrar categorías únicas
  const categories = [...new Set(items.map(item => item.category))];
  const tags = [...new Set(items.flatMap(item => item.tags))];

  // Crear botones de categoría
  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category;
    button.style.background = 'green'
    button.onclick = () => filterByCategory(category);
    filtersContainer.appendChild(button);
  });

  // Crear botones de tags
  tags.forEach(tag => {
    const button = document.createElement('button');
    button.textContent = tag;
    button.onclick = () => filterByTag(tag);
    filtersContainer.appendChild(button);
  });

  // Insertar filtros en el DOM (si no existe ya)
  const existingFilters = document.getElementById('filters-container');
  if (existingFilters) {
    existingFilters.replaceWith(filtersContainer);
  } else {
    document.body.insertBefore(filtersContainer, galleryContainer);
  }
}

// Filtrar por categoría
function filterByCategory(category) {
  const filteredItems = allItems.filter(item => item.category === category);
  renderGallery(filteredItems);
}

// Filtrar por tag
function filterByTag(tag) {
  const filteredItems = allItems.filter(item => item.tags.includes(tag));
  renderGallery(filteredItems);
}

init();

