const fs = require('fs');
const path = require('path');

const BASE_DIR = './assets'; // Ruta a la carpeta de assets

function generateIndex(baseDir) {
  const packs = fs.readdirSync(baseDir).filter(folder => {
    const packPath = path.join(baseDir, folder);
    return fs.statSync(packPath).isDirectory();
  }).map(folder => {
    const subfolders = fs.readdirSync(path.join(baseDir, folder)).filter(subfolder => {
      const subfolderPath = path.join(baseDir, folder, subfolder);
      return fs.statSync(subfolderPath).isDirectory();
    }).map(subfolder => {
      const assetPath = path.join(baseDir, folder, subfolder, 'asset.json');
      const assetData = fs.existsSync(assetPath) ? JSON.parse(fs.readFileSync(assetPath)) : null;

      return {
        folder: subfolder,
        name: assetData?.name || 'Unknown',
        tags: assetData?.tags || [],
        category: assetData?.category || 'Unknown',
        thumbnail: `${folder}/${subfolder}/thumbnail.png`,
        glb: `${folder}/${subfolder}/${subfolder}.glb`
      };
    });

    return {
      folder,
      title: folder.replace(/_/g, ' '), // Convertir nombre del pack (opcional)
      items: subfolders
    };
  });

  fs.writeFileSync(path.join(baseDir, 'index.json'), JSON.stringify({ packs }, null, 2));
  console.log('index.json generado correctamente.');
}

generateIndex(BASE_DIR);

// const fs = require('fs');
// const path = require('path');

// const BASE_DIR = './assets'; // Cambia esto a tu ruta de assets

// function generateIndex(baseDir) {
//   const packs = fs.readdirSync(baseDir).filter(folder => {
//     const packPath = path.join(baseDir, folder);
//     return fs.statSync(packPath).isDirectory();
//   }).map(folder => {
//     const subfolders = fs.readdirSync(path.join(baseDir, folder)).filter(subfolder => {
//       const subfolderPath = path.join(baseDir, folder, subfolder);
//       return fs.statSync(subfolderPath).isDirectory();
//     });

//     return {
//       folder,
//       title: folder.replace(/_/g, ' '), // Opcional: Convierte "05_Fantasy_Pack" en "Fantasy Pack"
//       subfolders
//     };
//   });

//   fs.writeFileSync(path.join(baseDir, 'index.json'), JSON.stringify({ packs }, null, 2));
//   console.log('index.json generado correctamente.');
// }

// generateIndex(BASE_DIR);