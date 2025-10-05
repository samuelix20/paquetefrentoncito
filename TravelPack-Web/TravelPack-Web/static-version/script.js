// La URL de tu API en el backend. Asegúrate de que el puerto coincida.
const API_URL = "http://localhost:4000/api/paquetes";

// Función para actualizar el estado de autenticación en la UI
function actualizarAuthStatus() {
  const authStatusDiv = document.getElementById('auth-status');
  const sessionData = localStorage.getItem('supabase.session');

  if (sessionData) {
    const session = JSON.parse(sessionData);
    authStatusDiv.innerHTML = `
      <span>Bienvenido, ${session.user.email}</span>
      <button id="logout-button">Cerrar Sesión</button>
    `;
  } else {
    authStatusDiv.innerHTML = `
      <a href="/login.html">Iniciar Sesión</a>
      <a href="/signup.html">Registrarse</a>
    `;
  }
}

// Función para mostrar paquetes en la página
async function mostrarPaquetes() {
  const contenedor = document.getElementById("paquetes");
  contenedor.innerHTML = ''; // Limpiar el contenedor por si acaso

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const paquetes = await response.json();

    paquetes.forEach(p => {
      const card = document.createElement("div");
      card.classList.add("card");
      // Nota: La imagen es estática por ahora, ya que no está en la BD.
      // Usamos los nuevos nombres de columna: title, description, price
      card.innerHTML = `
        <img src="./img/placeholder.jpg" alt="${p.title}">
        <div class="card-body">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <p><b>Precio:</b> $${Number(p.price).toLocaleString()} ${p.currency}</p>
          <div class="card-actions">
            <button class="buy-button" data-title="${p.title}" data-price="${p.price}" data-currency="${p.currency || 'usd'}">Comprar Ahora</button>
          </div>
        </div>
      `;
      contenedor.appendChild(card);
    });

    // Añadir event listeners a los botones de compra
    document.querySelectorAll('.buy-button').forEach(button => {
      button.addEventListener('click', async (event) => {
        const { title, price, currency } = event.target.dataset;

        // 1. Llamar al backend para crear la sesión de checkout
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, price: parseFloat(price), currency }),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error('Error al crear la sesión de pago:', result.error || 'Error desconocido del servidor');
          alert(`No se pudo iniciar el proceso de pago:\n${result.error || 'Error desconocido del servidor'}`);
          return;
        }

        const session = result;

        // 2. Redirigir al checkout de Stripe
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (error) console.error('Error al redirigir a Stripe:', error);
      });
    });
  } catch (error) {
    contenedor.innerHTML = `<p>Error al cargar los paquetes: ${error.message}</p>`;
    console.error("Error al obtener los paquetes:", error);
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  actualizarAuthStatus();
  mostrarPaquetes();
});
