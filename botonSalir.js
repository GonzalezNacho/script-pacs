function agregarBotonSalir() {
    const tdAnterior = obtenerDatos('-SV_tdFullScreenBtn');
    const listaBotones = tdAnterior.parentNode;
    const boton = document.createElement('td');
    boton.classList.add('btnLink1')
    const a = document.createElement('a');
    const texto = document.createTextNode('salir');
    a.appendChild(texto);
    boton.appendChild(a);
    console.log(listaBotones)
    listaBotones.insertBefore(boton,tdAnterior)
    boton.addEventListener('click', () => {
        continuar = false;
    });
}