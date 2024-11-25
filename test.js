// Base path for assets
const BASE_PATH = './assets/';

let allItems = [];
let currentPackItems = [];

// Get the canvas element
const canvas = document.getElementById("renderCanvas");

// Initialize the Babylon engine
const engine = new BABYLON.Engine(canvas, true);

// Create the scene
const createScene = function () {
  const scene = new BABYLON.Scene(engine);

  // Camera
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  // Light
  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  // GUI
  async function cargarUI() {

    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Cargar el diseño desde el snippet generado en el GUI Editor
    await advancedTexture.parseFromSnippetAsync('#CITCWC#332');

    // Obtener los controles por su nombre
    // const packsScrollViewer = advancedTexture.getControlByName('packsScrollViewer');
    // const filtersScrollViewer = advancedTexture.getControlByName('categoriesScrollViewer');
    // const scrollViewer = advancedTexture.getControlByName('imagesGridContainer');

    // ScrollViewer for Packs (Top, Horizontal)
    const packsScrollViewer = new BABYLON.GUI.ScrollViewer();
    packsScrollViewer.width = "100%";
    packsScrollViewer.height = "60px";
    packsScrollViewer.thickness = 0;
    packsScrollViewer.background = "#00000040";
    packsScrollViewer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    packsScrollViewer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    packsScrollViewer.barSize = 10;
    advancedTexture.addControl(packsScrollViewer);

    const packsContainer = new BABYLON.GUI.StackPanel();
    packsContainer.isVertical = false; // Horizontal layout
    packsContainer.height = "100%";
    packsScrollViewer.addControl(packsContainer);

    // ScrollViewer for Categories/Tags (Right, Vertical)
    const filtersScrollViewer = new BABYLON.GUI.ScrollViewer();
    filtersScrollViewer.width = "100px";
    filtersScrollViewer.height = "80%";
    filtersScrollViewer.thickness = 0;
    filtersScrollViewer.background = "#00000040";
    filtersScrollViewer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    filtersScrollViewer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    filtersScrollViewer.barSize = 10;
    advancedTexture.addControl(filtersScrollViewer);

    const filtersContainer = new BABYLON.GUI.StackPanel();
    filtersContainer.isVertical = true; // Vertical layout
    filtersContainer.width = "100%";
    filtersScrollViewer.addControl(filtersContainer);

    // ScrollViewer for the Grid (Center)
    const scrollViewer = new BABYLON.GUI.ScrollViewer();
    scrollViewer.width = "500px";
    scrollViewer.height = "500px";
    scrollViewer.thickness = 0;
    scrollViewer.background = "#00000040";
    scrollViewer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    scrollViewer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    scrollViewer.barSize = 10;
    advancedTexture.addControl(scrollViewer);

    const gridContainer = new BABYLON.GUI.Rectangle();
    gridContainer.thickness = 0;
    gridContainer.width = 1;
    scrollViewer.addControl(gridContainer);

    const grid = new BABYLON.GUI.Grid();
    gridContainer.addControl(grid);

    // Function to create buttons
    function createButton(name, text, backgroundColor, width = "150px", height = "40px") {
      const button = new BABYLON.GUI.Button(name);
      button.width = width;
      button.height = height;
      button.background = backgroundColor;
      button.thickness = 0;

//       // Función para marcar el botón al hacer clic
// button.onPointerDownObservable.add(function() {
//   // Cambiar el color de fondo y tamaño para marcarlo
//   button.background = "blue";  // Cambia el fondo cuando es clickeado
//   button.scaleX = 1.1;  // Aumentar el tamaño horizontal
//   button.scaleY = 1.1;  // Aumentar el tamaño vertical
// });

// // Función para restaurar el botón cuando se deja de hacer clic
// button.onPointerUpObservable.add(function() {
//   // Restaurar el estilo original
//   button.background = "green";  // Restaurar el color de fondo
//   button.scaleX = 1;  // Restaurar tamaño original
//   button.scaleY = 1;  // Restaurar tamaño original
// });


      const buttonText = new BABYLON.GUI.TextBlock();
      buttonText.text = text;
      buttonText.color = "white";
      buttonText.fontSize = 14;

      
      button.addControl(buttonText);

      return button;
    }

    // Load Packs
    async function loadPacks() {
      const index = await fetch(`${BASE_PATH}index.json`).then(res => res.json());

      index.packs.forEach((pack, i) => {
        const button = createButton("pack_" + i, pack.title, "green");
        button.onPointerClickObservable.add(() => {
          loadPack(pack);
        });
        packsContainer.addControl(button);
      });
    }

    // Generate Filters
    function generateFilters(items) {
      filtersContainer.clearControls();

      const categories = [...new Set(items.map(item => item.category))];
      const tags = [...new Set(items.flatMap(item => item.tags))];

      // Buttons for categories
      categories.forEach(category => {
        const button = createButton("category_" + category, category, "blue", "100%", "40px");
        button.onPointerClickObservable.add(() => {
          filterByCategory(category);
        });
        filtersContainer.addControl(button);
      });

      // Buttons for tags
      tags.forEach(tag => {
        const button = createButton("tag_" + tag, tag, "orange", "100%", "40px");
        button.onPointerClickObservable.add(() => {
          filterByTag(tag);
        });
        filtersContainer.addControl(button);
      });
    }

    // Load a specific pack
    async function loadPack(pack) {
      allItems = pack.items;
      currentPackItems = allItems;
      updateGrid(allItems);
      generateFilters(allItems);
    }

    // Filter by category
    function filterByCategory(category) {
      const filteredItems = currentPackItems.filter(item => item.category === category);
      updateGrid(filteredItems);
    }

    // Filter by tag
    function filterByTag(tag) {
      const filteredItems = currentPackItems.filter(item => item.tags.includes(tag));
      updateGrid(filteredItems);
    }

    // Update the grid with items (Original behavior restored)
    function updateGrid(items) {
      grid.clearControls();

      const columns = 5; // Fixed number of columns
      const rows = Math.ceil(items.length / columns); // Calculate rows dynamically
      gridContainer.height = `${rows * 100}px`; // Height adjusts dynamically to fit content
      gridContainer.width = '100%'
      // Define grid rows and columns
      grid.columnCount = columns;
      grid.rowCount = rows;

      for (let i = 0; i < rows; i++) {
        grid.addRowDefinition(100, true); // Each row has a fixed height of 100px
      }
      for (let j = 0; j < columns; j++) {
        grid.addColumnDefinition(100, true); // Equal width for each column
      }

      // Add items to the grid
      items.forEach((item, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;

        const imageContainer = new BABYLON.GUI.Rectangle();
        imageContainer.thickness = 5;
        imageContainer.color = "green";
        imageContainer.background = "#00000020";


        const image = new BABYLON.GUI.Image("image_" + index, BASE_PATH + item.thumbnail);
        image.width = 0.9;
        image.height = 0.9;

        // Agregar evento de hover sobre la imagen
        image.onPointerEnterObservable.add(() => {
          // Efecto hover: Aumentamos la escala de la imagen
          imageContainer.scaleX = 1.1;
          imageContainer.scaleY = 1.1;
          image.alpha = 1; // Hacemos que la imagen sea completamente visible
        });

        image.onPointerOutObservable.add(() => {
          // Restauramos la escala original cuando el puntero sale
          imageContainer.scaleX = 1;
          imageContainer.scaleY = 1;
          image.alpha = 1; // Imagen completamente visible, si es necesario.
        });

        // Add click event to the image
        image.onPointerClickObservable.add(() => {
          alert(`You clicked on ${item.name}`);
        });

        imageContainer.addControl(image);
        grid.addControl(imageContainer, row, col);
      });
    }

    // Initialize
    loadPacks();
  }
  cargarUI()
  return scene;
};

// Call createScene
const scene = createScene();

// Render loop
engine.runRenderLoop(() => {
  scene.render();
});

// Resize event
window.addEventListener("resize", () => {
  engine.resize();
});


// // BABYLON CODE

// // Get the canvas element
// var canvas = document.getElementById("renderCanvas");

// // Initialize the Babylon engine
// var engine = new BABYLON.Engine(canvas, true);

// // Create the scene
// var createScene = function () {
//   // Sample JSON Data
//   var scene = new BABYLON.Scene(engine);

//   // Create and position a free camera
//   var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
//   camera.setTarget(BABYLON.Vector3.Zero());
//   camera.attachControl(canvas, true);

//   // Create a light
//   var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
//   light.intensity = 0.7;

//   // Create the GUI
//   var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

//   // Create a ScrollViewer
//   var scrollViewer = new BABYLON.GUI.ScrollViewer();
//   scrollViewer.width = "500px"; // Viewport width
//   scrollViewer.height = "500px"; // Viewport height
//   scrollViewer.background = "transparent";
//   scrollViewer.thickness = 0; // No border
//   scrollViewer.forceHorizontalBar = false; // Disable horizontal scrolling
//   scrollViewer.forceVerticalBar = true;   // Enable vertical scrolling
//   scrollViewer.barSize = 10
//   scrollViewer.barBackground = 'transparent'
//   scrollViewer.cornerRadius = 0

//   advancedTexture.addControl(scrollViewer);



//   // Create a container for the grid
//   var gridContainer = new BABYLON.GUI.Rectangle();
//   gridContainer.thickness = 0; // No border
//   gridContainer.width = 1; // Full width of the ScrollViewer
//   gridContainer.background = '#00000040'
//   scrollViewer.addControl(gridContainer);

//   // Create a grid for the images
//   var grid = new BABYLON.GUI.Grid();
//   gridContainer.addControl(grid);

//   async function load(pack) {
//     const BASE_PATH = './assets/';

//     let jsonData = await fetch(`${BASE_PATH}index.json`).then(res => res.json());

//     // Configuration for grid dimensions
//     let totalImages = jsonData.packs[pack].items.length; // Total number of images
//     let columns = 5; // Number of columns in the grid
//     let rows = Math.ceil(totalImages / columns); // Calculate the required rows

//     // Set the dynamic height of the grid container
//     gridContainer.height = `${rows * 100}px`; // Each row is 100px tall (adjust as needed)

//     // Define grid rows and columns with fixed proportions
//     for (let i = 0; i < rows; i++) {
//       grid.addRowDefinition(100, true); // Fixed height of 100px for each row
//     }
//     for (let j = 0; j < columns; j++) {
//       grid.addColumnDefinition(1); // Equal width for columns
//     }

//     // Add images to the grid dynamically
//     jsonData.packs[0].items.forEach((item, i) => {
//       let row = Math.floor(i / columns); // Determine row index
//       let col = i % columns; // Determine column index

//       let imageContainer = new BABYLON.GUI.Rectangle();
//       imageContainer.thickness = 5;
//       imageContainer.color = "green";
//       imageContainer.background = "#00000010";
//       grid.addControl(imageContainer, row, col); // Add to grid (row, column)

//       let image = new BABYLON.GUI.Image("image_" + i, BASE_PATH + item.thumbnail); // Use the thumbnail from the JSON
//       image.width = 0.9; // Adjust size relative to cell
//       image.height = 0.9; // Adjust size relative to cell

//       // Add click event to the image
//       image.onPointerClickObservable.add(() => {
//         alert(`You clicked on ${item.name}`);
//       });

//       imageContainer.addControl(image); // Add image to container
//     });

//   }
//   load(0)

//   return scene;
// };

// // Call the createScene function
// var scene = createScene();

// // Register a render loop to repeatedly render the scene
// engine.runRenderLoop(function () {
//   scene.render();
// });

// // Watch for browser/canvas resize events
// window.addEventListener("resize", function () {
//   engine.resize();
// });