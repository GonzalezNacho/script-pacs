/*
    author: González, Ignacio
*/
const urlEnString = window.location.href;
const urlDireccion = new URL(urlEnString);
const patientId = urlDireccion.searchParams.get("patient_id");
const listaEstudios = obtenerDatos('-SV_studyList');
const pinIzq = obtenerDatos('-SV-patientLayout_west_pin');
const pinDer = obtenerDatos('-SV-patientLayout_east_pin');
clickEnPin(pinIzq);
clickEnPin(pinDer);
const nombre = obtenerDatos('-tabCaptionPlace');
const documento = obtenerDatos('-SV_patDetails0');

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

function clickEnPin(pin) {
    if(pin.getAttributeNode('pin').value == 'up') {
        pin.click()
    }
}

function obtenerDatos(parteDelIdABuscar) {
    const num = patientId ? '0' : document.getElementById('mainTabContentContainer').children[1].id.split('-')[1];
    const id = `mainTab-${num}${parteDelIdABuscar}`;
    return document.getElementById(id);
}

function obtenerNombresDeLosPDF(lista) {
    const contador = {}
    const resultado = []
    const MODALIDADES = {
        'OT' : 'densitometria',
        'US' : 'ecografia',
        'DX' : 'radiologia',
        'CR' : 'radiologia',
        'MG' : 'mamografia',
        'MR' : 'resonancia',
        'CT' : 'tomografia',
        'XA' : 'hemodinamia'
    }

    lista.forEach(estudio => {
        const fecha = estudio.getElementsByClassName("sccDate")[0].textContent.split(' ')[0].replaceAll('/','-');
        const modalidad = MODALIDADES[estudio.getElementsByClassName('sccStudyNameInner')[0].textContent.split(' ')[0]];
        const nombreA = modalidad + nombre.innerHTML + documento.innerHTML + fecha;
        if (contador[nombreA]) {
            contador[nombreA]++;
            resultado.push(`${nombreA}${contador[nombreA]}`);
        } else {
            contador[nombreA] = 1;
            resultado.push(nombreA);
        }
    });

    return resultado;
}

async function recorrerLista(lista) {
    const nombreArchivo = obtenerNombresDeLosPDF(lista)
    copy(nombreArchivo[0])
    let continuar = true;
    for (let i = 0; i < lista.length && continuar; i++) {
        let mensaje = "";
        if(i > 0) {
            lista[i].children[0].click()
        }
        const botonImpresora = obtenerDatos('-SV_printBtn');
        await delay(4000);
        if(botonImpresora.classList.length != 3) {
            if (i > 0) {
                try {
                    await navigator.clipboard.writeText(nombreArchivo[i])
                    console.log('Texto copiado al portapapeles:', nombreArchivo[i])
                } catch (err) {
                    console.error('Error al copiar al portapapeles:',nombreArchivo[i], err)
                } 
            }
            botonImpresora.click()
            await delay(2000);
        } else {
            mensaje = "el informe no esta disponible "
        }
        continuar = confirm(mensaje +"¿Pasar al siguiente?");
    }
}

recorrerLista([...listaEstudios.children]);