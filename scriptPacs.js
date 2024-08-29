/*
    author: González, Ignacio
*/
const urlEnString = window.location.href;
const urlDireccion = new URL(urlEnString);
const patientId = urlDireccion.searchParams.get("patient_id");
const listaEstudios = obtenerDatos('-SV_studyList');
const listaEstudiosConInforme = [...listaEstudios.children].filter((ele) => ele.getElementsByClassName('report').length > 0)
clickEnPin(obtenerDatos('-SV-patientLayout_west_pin'));
clickEnPin(obtenerDatos('-SV-patientLayout_east_pin'));

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

function clickEnPin(pin) {
    if(pin.getAttributeNode('pin').value == 'up') pin.click();
}

function obtenerDatos(parteDelIdABuscar) {
    const num = patientId ? '0' : document.getElementById('mainTabContentContainer').children[1].id.split('-')[1];
    const id = `mainTab-${num}${parteDelIdABuscar}`;
    return document.getElementById(id);
}

function obtenerNombresDeLosPDF(lista) {
    const contador = {};
    const resultado = [];
    const nombre = obtenerDatos('-tabCaptionPlace');
    const documento = obtenerDatos('-SV_patDetails0');
    const MODALIDADES = {
        'US' : 'ecografia',
        'DX' : 'radiologia',
        'CR' : 'radiologia',
        'MG' : 'mamografia',
        'MR' : 'resonancia',
        'CT' : 'tomografia',
        'XA' : 'hemodinamia'
    };

    lista.forEach(estudio => {
        const fecha = estudio.getElementsByClassName("sccDate")[0].textContent.split(' ')[0].replaceAll('/','-');
        const siglaModalidad = estudio.getElementsByClassName('sccStudyNameInner')[0].textContent.split(' ');
        const modalidad = MODALIDADES[siglaModalidad[0] == 'OT' ? siglaModalidad[1] : siglaModalidad[0]];
        const nombreA = modalidad +'-'+ nombre.innerHTML + documento.innerHTML +'-'+ fecha;
        if (contador[nombreA]) {
            contador[nombreA]++;
            resultado.push({pdf: `${nombreA}-${contador[nombreA]}`, fecha: fecha});
        } else {
            contador[nombreA] = 1;
            resultado.push({pdf: nombreA, fecha: fecha});
        }
    });

    return resultado;
}

async function recorrerLista(lista) {
    const nombreArchivo = obtenerNombresDeLosPDF(lista);
    copy(nombreArchivo[0].pdf)
    let continuar = true;
    for (let i = 0; i < lista.length && continuar; i++) {
        const imprimirEstudio = prompt(`Imprimir el informe del día  ${nombreArchivo[i].fecha} ?
        1. Imprimir
        2. Omitir informe
        3. Salir`);
        if(imprimirEstudio == 1) {
            lista[i].children[0].click();
            const botonImpresora = obtenerDatos('-SV_printBtn');
            await delay(4000);
            if (i > 0) {
                try {
                    await navigator.clipboard.writeText(nombreArchivo[i].pdf);
                    console.log('Texto copiado al portapapeles:', nombreArchivo[i].pdf);
                } catch (err) {
                    console.error('Error al copiar al portapapeles:',nombreArchivo[i].pdf, err);
                } 
            }
            botonImpresora.click()
            await delay(4000);
        }
        if(imprimirEstudio == 3) continuar = false;
        if(imprimirEstudio != 1 && imprimirEstudio != 2 && imprimirEstudio != 3) {
            alert("opcion incorrecta");
            i--;
        }
    }
}

recorrerLista(listaEstudiosConInforme);