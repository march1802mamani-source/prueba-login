// ===== Login de prueba (solo navegador) =====
// Las credenciales se guardan en binario (8 bits por carácter) para que no se
// lean a simple vista. OJO: esto solo las disimula, no las protege; cualquiera
// puede convertirlas de vuelta. Un sitio real necesita un servidor/backend.

const USUARIO_BINARIO = "01100001 01100100 01101101 01101001 01101110";
const PASSWORD_BINARIO = "00110001 00110010 00110011 00110100";
const CLAVE_SESION = "usuarioLogueado";

// Convierte "01100001 01100010" → "ab"
function binarioATexto(binario) {
  return binario
    .split(" ")
    .map((bits) => String.fromCharCode(parseInt(bits, 2)))
    .join("");
}

const USUARIO_PRUEBA = binarioATexto(USUARIO_BINARIO);
const PASSWORD_PRUEBA = binarioATexto(PASSWORD_BINARIO);

// ----- Página de login (index.html) -----
const formLogin = document.getElementById("form-login");

if (formLogin) {
  const inputUsuario = document.getElementById("usuario");
  const inputPassword = document.getElementById("password");
  const btnMostrar = document.getElementById("btn-mostrar");
  const mensaje = document.getElementById("mensaje");

  // Si ya hay una sesión abierta, ir directo a la bienvenida
  if (sessionStorage.getItem(CLAVE_SESION)) {
    window.location.href = "bienvenida.html";
  }

  function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = "mensaje " + tipo; // "error" o "exito"
  }

  function limpiarErrores() {
    mensaje.textContent = "";
    mensaje.className = "mensaje";
    inputUsuario.classList.remove("invalido");
    inputPassword.classList.remove("invalido");
  }

  // Mostrar / ocultar contraseña
  btnMostrar.addEventListener("click", () => {
    const oculta = inputPassword.type === "password";
    inputPassword.type = oculta ? "text" : "password";
    btnMostrar.classList.toggle("visible", oculta); // cambia el icono (CSS)
    const etiqueta = oculta ? "Ocultar contraseña" : "Mostrar contraseña";
    btnMostrar.setAttribute("aria-label", etiqueta);
    btnMostrar.title = etiqueta;
  });

  // Al escribir, quitar el borde rojo del campo
  [inputUsuario, inputPassword].forEach((input) => {
    input.addEventListener("input", () => input.classList.remove("invalido"));
  });

  // Enviar el formulario
  formLogin.addEventListener("submit", (evento) => {
    evento.preventDefault(); // evita que la página se recargue
    limpiarErrores();

    const usuario = inputUsuario.value.trim();
    const password = inputPassword.value;

    // 1. Campos vacíos
    if (usuario === "" || password === "") {
      if (usuario === "") inputUsuario.classList.add("invalido");
      if (password === "") inputPassword.classList.add("invalido");
      mostrarMensaje("Completa todos los campos.", "error");
      return;
    }

    // 2. Credenciales incorrectas
    if (usuario !== USUARIO_PRUEBA || password !== PASSWORD_PRUEBA) {
      inputUsuario.classList.add("invalido");
      inputPassword.classList.add("invalido");
      mostrarMensaje("Usuario o contraseña incorrectos.", "error");
      inputPassword.value = "";
      inputPassword.focus();
      return;
    }

    // 3. Login correcto: guardar sesión y redirigir
    sessionStorage.setItem(CLAVE_SESION, usuario);
    mostrarMensaje("¡Acceso correcto! Redirigiendo...", "exito");
    setTimeout(() => {
      window.location.href = "bienvenida.html";
    }, 800);
  });
}

// ----- Página de bienvenida (bienvenida.html) -----
const btnSalir = document.getElementById("btn-salir");

if (btnSalir) {
  const usuario = sessionStorage.getItem(CLAVE_SESION);

  // 4. Sin sesión → volver al login
  if (!usuario) {
    window.location.replace("index.html");
  } else {
    document.getElementById("nombre-usuario").textContent = usuario;
  }

  // Cerrar sesión
  btnSalir.addEventListener("click", () => {
    sessionStorage.removeItem(CLAVE_SESION);
    window.location.href = "index.html";
  });
}
