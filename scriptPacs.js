/*
    author: González, Ignacio
*/
const urlEnString = window.location.href;
const urlDireccion = new URL(urlEnString);
const patientId = urlDireccion.searchParams.get("patient_id");
const listaEstudios = patientId ? document.getElementById('mainTab-0-SV_studyList') : obtenerDatos('-SV_studyList');
const pinIzq = patientId ? document.getElementById('mainTab-0-SV-patientLayout_west_pin') : obtenerDatos('-SV-patientLayout_west_pin');
const pinDer = patientId ? document.getElementById('mainTab-0-SV-patientLayout_east_pin') : obtenerDatos('-SV-patientLayout_east_pin');
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
clickEnPin(pinIzq);
clickEnPin(pinDer);
const nombre = patientId ? document.getElementById('mainTab-0-tabCaptionPlace') : obtenerDatos('-tabCaptionPlace');
const documento = patientId ? document.getElementById('mainTab-0-SV_patDetails0') : obtenerDatos('-SV_patDetails0');

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

function clickEnPin(pin) {
    if(pin.getAttributeNode('pin').value == 'up') {
        pin.click()
    }
}

function obtenerDatos(parteDelIdABuscar) {
    const primeraParte = 'mainTab-';
    for(let contador = 1; contador < 100; contador++) {
        const id = `${primeraParte}${contador}${parteDelIdABuscar}`;
        if (document.getElementById(id)) {
            return document.getElementById(id);
        }
    }
}

function obtenerNombresDeLosPDF(lista) {
    const contador = {}
    const resultado = []

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
        const botonImpresora = patientId ? document.getElementById('mainTab-0-SV_printBtn') : obtenerDatos('-SV_printBtn');
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