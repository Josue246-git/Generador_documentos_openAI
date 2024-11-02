// // public/js/login.js

// fetch('/api/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ username: 'admin_username', password: 'admin_password' })
//   })
//   .then(response => response.json())
//   .then(data => {
//     if (data.success) {
//       // Redirige al usuario a la página principal o muestra el contenido protegido
//       window.location.href = '/';
//     } else {
//       alert(data.message);
//     }
//   })
//   .catch(error => console.error('Error en la solicitud de login:', error));
  

//    // Verifica si el usuario está autenticado y redirige al login si no lo está
// fetch('/api/checkAuth')
//    .then(response => {
//      if (response.status === 401) {
//        window.location.href = '/api/login'; // Redirige al login
//      } else {
//        // Cargar la aplicación si el usuario está autenticado
//        document.getElementById('root').innerHTML = '<h1>Bienvenido a la aplicación</h1>';
//      }
//    })
//    .catch(error => console.error('Error de autenticación:', error));


document.getElementById("generateSectionsBtn").addEventListener("click", detectSections);

function detectSections() {
  const content = document.getElementById("documentContent").value;
  const sectionPattern = /^\d+\.\s.*$/gm; // Expresión para detectar secciones como "1. sección"
  const sections = content.match(sectionPattern);

  if (!sections) {
    alert("No se detectaron secciones en el documento.");
    return;
  }

  const carouselContent = document.getElementById("carouselContent");
  carouselContent.innerHTML = ""; // Limpiar carrusel

  sections.forEach((section, index) => {
    // Crear elemento de carrusel para cada sección
    const carouselItem = document.createElement("div");
    carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;
    
    // HTML para cada sección en el carrusel
    carouselItem.innerHTML = `
      <div class="container">
        <h3>${section}</h3>
        <label>Editar sección:</label>
        <textarea class="form-control section-input" rows="5" placeholder="Escriba su corrección aquí..."></textarea>
      </div>
    `;
    carouselContent.appendChild(carouselItem);
  });

  // Mostrar mensaje
  alert(`Se detectaron ${sections.length} secciones. Revísalas y edítalas en el carrusel.`);
}

// Generar documento (lógica para este botón)
document.getElementById("generateWordBtn").addEventListener("click", generateWordDocument);

function generateWordDocument() {
  // Aquí se agrega la lógica para generar el archivo Word
  alert("Función para generar archivo WORD en desarrollo.");
}
