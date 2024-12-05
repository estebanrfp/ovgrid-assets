const fs = require('fs');
const path = require('path');

const BASE_DIR = './textures'; // Ruta a la carpeta de assets

function generateIndex(baseDir) {
  // Leer las carpetas principales
  const packs = fs.readdirSync(baseDir).filter(folder => {
    const packPath = path.join(baseDir, folder);
    return fs.statSync(packPath).isDirectory(); // Confirmar que son directorios
  }).map(folder => {
    const assetPath = path.join(baseDir, folder, 'asset.json');
    const assetData = fs.existsSync(assetPath) ? JSON.parse(fs.readFileSync(assetPath)) : null;

    // Obtener archivos .ktx2 dentro de la carpeta
    const textureFiles = fs.readdirSync(path.join(baseDir, folder))
      .filter(file => file.endsWith('.ktx2')) // Filtrar solo archivos .ktx2
      .map(file => `${folder}/${file}`); // Construir la ruta relativa

    return {
      folder,
      name: assetData?.name || 'Unknown', // Nombre del pack desde asset.json
      tags: assetData?.tags || [], // Tags opcionales desde asset.json
      category: assetData?.category || 'Unknown', // Categoría opcional desde asset.json
      thumbnail: `${folder}/thumbnail.png`,
      layers: textureFiles // Usar los archivos .ktx2 reales
    };
  });

  // Escribir el archivo index.json
  fs.writeFileSync(path.join(baseDir, 'index.json'), JSON.stringify({ packs }, null, 2));
  console.log('index.json generado correctamente.');
}

generateIndex(BASE_DIR);