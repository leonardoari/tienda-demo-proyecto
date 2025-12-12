
/* ===== VARIABLES GLOBALES ===== */
const contenido = document.getElementById("contenido");
let currentCarousel = 0;

/* ===== SESIÓN ===== */
function actualizarSesion() {
  const sesion = localStorage.getItem("sesion");
  document.getElementById("btnLogin").style.display = sesion ? "none" : "inline";
  document.getElementById("btnCerrar").style.display = sesion ? "inline" : "none";
}

/* ===== NOTIFICACIONES ===== */
function notificar(msg) {
  const n = document.createElement("div");
  n.className = "notificacion";
  n.innerText = msg;
  document.body.appendChild(n);
  setTimeout(() => document.body.removeChild(n), 2300);
}

/* ===== LOGIN / REGISTRO ===== */
document.getElementById("btnLogin").onclick = mostrarLogin;
document.getElementById("btnCerrar").onclick = () => {
  localStorage.removeItem("sesion");
  notificar("Sesión cerrada ✔");
  actualizarSesion();
  mostrarInicio();
};

function mostrarLogin() {
  contenido.innerHTML = `
    <div class="form-box">
      <h2>Iniciar sesión</h2>
      <input id="userLogin" placeholder="Usuario">
      <input type="password" id="passLogin" placeholder="Contraseña">
      <button class="btn btn-primary" onclick="login()">Entrar</button>
      <button class="btn btn-volver" onclick="mostrarRegistro()">Crear cuenta</button>
      <button class="btn btn-volver" onclick="mostrarInicio()">Volver</button>
    </div>
  `;
}

function mostrarRegistro() {
  contenido.innerHTML = `
    <div class="form-box">
      <h2>Crear cuenta</h2>
      <input id="userReg" placeholder="Usuario">
      <input type="password" id="passReg" placeholder="Contraseña">
      <button class="btn btn-primary" onclick="registro()">Registrar</button>
      <button class="btn btn-volver" onclick="mostrarLogin()">Volver</button>
    </div>
  `;
}

function registro() {
  let user = document.getElementById("userReg").value.trim();
  let pass = document.getElementById("passReg").value.trim();
  if(!user || !pass){ notificar("Rellena todos los campos"); return; }
  let users = JSON.parse(localStorage.getItem("usuarios")) || [];
  if (users.find(u => u.user === user)) { notificar("Usuario ya existe"); return; }
  users.push({ user, pass });
  localStorage.setItem("usuarios", JSON.stringify(users));
  notificar("Cuenta creada ✔");
  mostrarLogin();
}

function login() {
  let user = document.getElementById("userLogin").value.trim();
  let pass = document.getElementById("passLogin").value.trim();
  let users = JSON.parse(localStorage.getItem("usuarios")) || [];
  let u = users.find(u => u.user === user && u.pass === pass);
  if (u) {
    localStorage.setItem("sesion", user);
    notificar("Bienvenido " + user);
    actualizarSesion();
    mostrarInicio();
  } else notificar("Usuario o contraseña incorrecta");
}

/* ===== MOSTRAR PRODUCTOS ===== */
function mostrarInicio() {
  let html = `<div class="grid">`;
  productos.forEach(p => {
    html += `
      <div class="card">
        ${p.descuento>0?`<div class="etiqueta">-${p.descuento*100}%</div>`:''}
        ${p.envio?`<div class="etiqueta envio">Envío gratis</div>`:''}
        <img src="${p.img[0]}" onclick="verProducto(${p.id})">
        <h3>${p.nombre}</h3>
        <p>${p.desc}</p>
        <div class="stars">${mostrarEstrellas(p.rating)}</div>
        <div class="precio">$${p.precio}</div>
        <div class="card-buttons">
          <button class="btn btn-primary" onclick="agregarCarrito(${p.id})">Agregar al carrito</button>
          <button class="btn btn-heart" onclick="agregarFavorito(${p.id})">♥</button>
        </div>
      </div>`;
  });
  html += `</div>`;
  contenido.innerHTML = html;
}

/* ===== BUSCADOR ===== */
document.getElementById("buscarInput").addEventListener("input", buscarProductos);

function buscarProductos() {
  const texto = document.getElementById("buscarInput").value.toLowerCase().trim();
  if (texto === "") { mostrarInicio(); return; }

  const resultados = productos.filter(p =>
    p.nombre.toLowerCase().includes(texto) ||
    p.desc.toLowerCase().includes(texto)
  );

  if (resultados.length === 0) {
    contenido.innerHTML = `
      <h2 style="padding:20px;">No se encontraron resultados para "<b>${texto}</b>"</h2>
      <button class="btn btn-volver" onclick="mostrarInicio()">Volver</button>
    `;
    return;
  }

  let html = `<div class="grid">`;
  resultados.forEach(p => {
    html += `
      <div class="card">
        ${p.descuento > 0 ? `<div class="etiqueta">-${p.descuento*100}%</div>` : ''}
        ${p.envio ? `<div class="etiqueta envio">Envío gratis</div>` : ''}
        <img src="${p.img[0]}" onclick="verProducto(${p.id})">
        <h3>${p.nombre}</h3>
        <p>${p.desc}</p>
        <div class="stars">${mostrarEstrellas(p.rating)}</div>
        <div class="precio">$${p.precio}</div>
        <div class="card-buttons">
          <button class="btn btn-primary" onclick="agregarCarrito(${p.id})">Agregar al carrito</button>
          <button class="btn btn-heart" onclick="agregarFavorito(${p.id})">♥</button>
        </div>
      </div>`;
  });
  html += `</div>`;
  contenido.innerHTML = html;
}

/* ===== AGREGAR AL CARRITO ===== */
function agregarCarrito(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  notificar("Agregado al carrito ✔");
}

/* ===== ELIMINAR DEL CARRITO ===== */
function eliminarCarrito(idx) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(idx, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  notificar("Producto eliminado ✔");
}

/* ===== MOSTRAR CARRITO ===== */
function mostrarCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if (carrito.length === 0) {
    contenido.innerHTML = `<h2 style="padding:20px;">Tu carrito está vacío</h2><button class="btn btn-volver" onclick="mostrarInicio()">← Volver</button>`;
    return;
  }

  let html = `<h2 style="padding:20px;">Carrito</h2><button class="btn btn-volver" onclick="mostrarInicio()">← Volver</button>`;
  carrito.forEach((id, idx) => {
    let p = productos.find(x => x.id === id);
    html += `
      <div class="card">
        <img src="${p.img[0]}" onclick="verProducto(${p.id})">
        <h3>${p.nombre}</h3>
        <div class="precio">$${p.precio}</div>
        <button class="btn btn-volver" onclick="eliminarCarrito(${idx})">Eliminar</button>
      </div>`;
  });
  html += `<button class="btn btn-pago" onclick="pagar()">Pagar</button>`;
  contenido.innerHTML = html;
}

/* ===== PAGAR ===== */
function pagar() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if(carrito.length===0) return;
  let historial = JSON.parse(localStorage.getItem("historial"))||[];
  historial.push({fecha:new Date().toLocaleString(), productos:carrito});
  localStorage.setItem("historial", JSON.stringify(historial));
  localStorage.removeItem("carrito");
  notificar("Compra realizada ✔");
  mostrarInicio();
}

/* ===== HISTORIAL ===== */
function mostrarHistorial() {
  let hist = JSON.parse(localStorage.getItem("historial")) || [];
  let html = `<h2 style="padding:20px;">Historial de compras</h2><button class="btn btn-volver" onclick="mostrarInicio()">← Volver</button>`;
  hist.forEach(h => {
    html += `<div class="form-box">
      <p>Fecha: ${h.fecha}</p>
      <p>Productos: ${h.productos.map(id=>productos.find(p=>p.id===id)?.nombre).join(", ")}</p>
    </div>`;
  });
  contenido.innerHTML = html;
}

/* ===== FAVORITOS ===== */
function agregarFavorito(id) {
  let fav = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (!fav.includes(id)) {
    fav.push(id);
    localStorage.setItem("favoritos", JSON.stringify(fav));
    notificar("Agregado a favoritos ♥");
  } else {
    notificar("Ya está en favoritos");
  }
}

function mostrarFavoritos() {
  let fav = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (fav.length === 0) {
    contenido.innerHTML = `<h2 style="padding:20px;">No tienes favoritos</h2><button class="btn btn-volver" onclick="mostrarInicio()">← Volver</button>`;
    return;
  }

  let html = `<div class="grid">`;
  fav.forEach(id=>{
    let p = productos.find(x=>x.id===id);
    if(!p) return;
    html += `
      <div class="card">
        <img src="${p.img[0]}" onclick="verProducto(${p.id})">
        <h3>${p.nombre}</h3>
        <div class="precio">$${p.precio}</div>
      </div>`;
  });
  html += `</div><button class="btn btn-volver" onclick="mostrarInicio()">← Volver</button>`;
  contenido.innerHTML = html;
}

/* ===== VISTA PRODUCTO INDIVIDUAL CON CARRUSEL ===== */
function verProducto(id){
  let p = productos.find(x=>x.id===id);
  let carouselImgs = '';
  p.img.forEach((src, idx) => {
    carouselImgs += `<img src="${src}" class="${idx===0?'active':''}" onclick="verImagen('${src}')">`;
  });
  contenido.innerHTML = `
    <div class="producto-detalle">
      <div class="carousel">
        ${carouselImgs}
        <button class="carousel-btn left" onclick="prevImg()">‹</button>
        <button class="carousel-btn right" onclick="nextImg()">›</button>
        ${p.descuento>0?`<div class="etiqueta">-${p.descuento*100}%</div>`:''}
        ${p.envio?`<div class="etiqueta envio">Envío gratis</div>`:''}
      </div>
      <div>
        <h2>${p.nombre}</h2>
        <div class="stars">${mostrarEstrellas(p.rating)}</div>
        <p>${p.desc}</p>
        <div class="precio">$${p.precio}</div>
        <div class="card-buttons">
          <button class="btn btn-primary" onclick="agregarCarrito(${p.id})">Agregar al carrito</button>
          <button class="btn btn-heart" onclick="agregarFavorito(${p.id})">♥ Favorito</button>
        </div>
        <button class="btn btn-volver" onclick="mostrarInicio()">← Volver</button>
      </div>
    </div>
  `;
  currentCarousel = 0;
}

/* ===== CARRUSEL ===== */
function prevImg(){
  const imgs = document.querySelectorAll(".carousel img");
  imgs[currentCarousel].classList.remove("active");
  currentCarousel = (currentCarousel-1+imgs.length)%imgs.length;
  imgs[currentCarousel].classList.add("active");
}

function nextImg(){
  const imgs = document.querySelectorAll(".carousel img");
  imgs[currentCarousel].classList.remove("active");
  currentCarousel = (currentCarousel+1)%imgs.length;
  imgs[currentCarousel].classList.add("active");
}

/* ===== MODAL DE IMAGEN ===== */
function verImagen(src){
  const modal = document.getElementById("modalImg");
  const img = document.getElementById("imgModal");
  modal.style.display = "block";
  img.src = src;
}

function cerrarModal(){
  document.getElementById("modalImg").style.display = "none";
}

/* ===== MODO OSCURO ===== */
document.getElementById("modoBtn").onclick = () => document.body.classList.toggle("dark");

/* ===== FUNCION ESTRELLAS ===== */
function mostrarEstrellas(rating){
  let full = Math.floor(rating);
  let half = rating - full >= 0.5 ? 1 : 0;
  let empty = 5 - full - half;
  return "★".repeat(full) + (half?"☆":"") + "☆".repeat(empty);
}

/* ===== BOTONES NAVBAR ===== */
document.getElementById("btnInicio").onclick=mostrarInicio;
document.getElementById("btnFavoritos").onclick=mostrarFavoritos;
document.getElementById("btnCarrito").onclick=mostrarCarrito;
document.getElementById("btnHistorial").onclick=mostrarHistorial;

/* ===== INICIO ===== */
actualizarSesion();
mostrarInicio();




