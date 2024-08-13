/*
author: González, Ignacio
*/
const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

function aplicarFiltros() {
    const filtroFechaHoy = document.getElementById('searchFilter-date-0_input')
    const filtroEstadoFinal = document.getElementById('searchFilter-status-4_input')
    const botonBuscar = document.getElementById('sptSearchSubmitBtn')
    
    filtroFechaHoy.click();
    filtroEstadoFinal.click();
    botonBuscar.click();
}

function obtenerNombresDeLosPDF(lista) {
    const resultado = lista.map(element => {
        const nombre = element.getElementsByClassName('dtCellNarrow')[2].title.split('|');
        const botonImpresora = element.getElementsByClassName('dtCellIcon')[0].children[0];
        const indice = nombre[1] == ' CT ' ? 3 : 2;
        return [nombre[indice].trim(), botonImpresora];
    });
    return resultado;
}

async function recorrerLista(lista) {
    const nombreArchivo = obtenerNombresDeLosPDF(lista);
    let continuar = true;
    for (let i = 0; i < lista.length && continuar; i++) {
        let mensaje = "";
        if(!isNaN(nombreArchivo[i][0])) {
            try {
                await navigator.clipboard.writeText(nombreArchivo[i][0]);
                console.log('Texto copiado al portapapeles:', nombreArchivo[i][0]);
            } catch (err) {
                console.error('Error al copiar al portapapeles:',nombreArchivo[i][0], err);
            }
            await delay(800);
            nombreArchivo[i][1].click();
            await delay(4200);
        } else {
            mensaje = "el informe no esta disponible ";
        }
        continuar = confirm(mensaje +"¿Pasar al siguiente?");
    }
}

async function iterarPaginas() {
    const botonSiguientePagina = document.getElementById("pagingGoToNextBtn");
    const totalDePaginas = document.getElementById("searchResultsTotalPages").innerHTML;
    for (let index = 0; index < totalDePaginas; index++) {
        const tbody = document.getElementById('patientsTableBody');
        await recorrerLista([...tbody.children]);
        botonSiguientePagina.click();
        await delay(2000);
    }
}

async function main() {
    aplicarFiltros();
    await delay(2000);
    iterarPaginas();
}

main();