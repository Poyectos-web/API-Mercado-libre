function iniciarApp() {
    //Menú de navegacion
    const abrirMenu = document.querySelector('.header__btn--abrir');
    const nav = document.querySelector('.nav');
    
    //Modal filtros
    const openModal = document.querySelector('.filtros__icono');
    const modal = document.querySelector('.modal');
    const nombreFiltros = document.querySelector('.list');
    const cajaFiltrosDesktop = document.querySelector('.filtros__caja');

    //Contenedor Autos
    const autosContenedor = document.querySelector('.autos__contenedor');
    
    document.querySelector('.navegacion').addEventListener('click', (e) => {
        e.stopPropagation();
    })
    abrirMenu.addEventListener('click', () => {
        nav.classList.add('nav--show');
    })
    nav.addEventListener('click', () => {
        nav.classList.remove('nav--show');
    })
    
    
    document.querySelector('.modal__container').addEventListener('click', (e)=> {
        e.stopPropagation();
    })
    openModal.addEventListener('click', () => {
        modal.classList.add('modal--show');
    })
    modal.addEventListener('click', () => {
        modal.classList.remove('modal--show');
    })
    
    
    //Consumir api
    const url = 'https://api.mercadolibre.com/sites/MCO/search?category=MCO1744'; //Categoría automoviles

    conectarApi();
    consumirAutos();
    consumirFiltros();
    
    async function conectarApi() {
        try {
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            console.log(resultado);
        } catch (error) {
            console.log(error)
        }
    }
    async function consumirAutos() {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarAutos(resultado.results);
    }

    //Llenar filtros
    async function consumirFiltros() {
        try {
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            llenarFiltros(resultado.available_filters);

            cajaFiltrosDesktop.style.height = `${nombreFiltros.scrollHeight}px`;
        } catch (error) {
            console.log(error);
        }

    }

    function mostrarAutos(autos) {
        console.log(autos);
        let tipoCombustible,
            capacidad,
            transmision,
            kilometros;
        autos.forEach(auto => {
            const {attributes, id, title, price, thumbnail} = auto; 
            const atributos = attributes.filter(atributo => atributo.id === 'FUEL_TYPE' || atributo.id === 'TRANSMISSION' || atributo.id === 'PASSENGER_CAPACITY' || atributo.id === 'KILOMETERS');
            atributos.forEach(atributo => {
                const {id, value_name} = atributo;
                switch (id) {
                    case 'FUEL_TYPE':
                        tipoCombustible = value_name;
                        break;
                    case 'PASSENGER_CAPACITY':
                        capacidad = value_name;
                        break;
                    case 'TRANSMISSION':
                        transmision = value_name;
                        break;
                    case 'KILOMETERS':
                        kilometros = value_name;
                        break;
                    default:
                        break;
                }
                //FUEL_TYPE, PASSENGER_CAPACITY, TRANSMISSION, KILOMETERS
            });

            autosContenedor.innerHTML += `
            <div class="auto auto1">
                <h3 class="auto__nombre">${title}</h3>
                <p class="auto__tipo">Sport</p>
                <div class="auto__info">
                    <div class="auto__img">
                        <img src="${thumbnail}" alt="Automovil">
                    </div>
                    <div class="features">
                        <div class="features__item features__velocidad">
                            <img src="./assets/img/velocidad.svg" alt="velocidad">
                            <span>${kilometros}</span>
                        </div>
                        <div class="features__item features__transmision">
                            <img src="./assets/img/transmision.svg" alt="transmision">
                            <span>${transmision}</span>
                        </div>
                        <div class="features__item features__capacidad">
                            <img src="./assets/img/capacidad.svg" alt="capacidad">
                            <span>${capacidad} People</span>
                        </div>
                        <div class="features__item features__consumo">
                            <img src="./assets/img/gas.svg" alt="consumo">
                            <span>${tipoCombustible}</span>
                        </div>
                    </div>
                </div>
                <div class="auto__rentar">
                    <div class="auto__precio">
                        <p>$99.00/<span>day</span></p>
                    </div>
                    <button class="auto__btnRentar">Rent now</button>
                </div>
                <div class="auto__favoritos">
                    <a href="#" class="heart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: #90A3BF"><path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z"></path></svg>
                    </a>
                </div>
            </div>
            `

        })
    }

    function llenarFiltros(filtros) {

        filtros.forEach(filtro => {
            if(filtro.values.length > 1) {
                const {id, name, values} = filtro;
                nombreFiltros.innerHTML += `
                    <li class="list__item">
                        <div class="list__button">
                            <a href="#" class="list__link" id="${id}">${name}</a>
                            <img src="assets/img/arrow.svg" class="arrow" alt="Icono flecha">
                        </div>
                        <ul class="list__show" id="${id}_opciones"></ul>
                    </li>
                `;
                const opcionesFiltros = document.querySelector(`#${id}_opciones`);
                llenarOpciones(values, opcionesFiltros);
            }

            function llenarOpciones(values, opciones) {
                let newValues
                if(values.length > 10) {
                    newValues = values.slice(0,8);
                }else {
                    newValues = values;
                }
                newValues.forEach(value => {
                    const {id, name, results} = value
                    opciones.innerHTML += `
                        <li class="list__inside">
                            <input type="checkbox" id="${id}">
                            <label for="${id}">${name} <span class="list__inside--quantity">( ${results} )</span></label>
                        </li>
                    `
                })
            }

        
            const desplegable = document.querySelectorAll('.list__button');
            desplegable.forEach(filtro => {
                filtro.addEventListener('click', () => {
                    filtro.classList.toggle('rotate--arrow');

                    let height = 0;
                    const menu = filtro.nextElementSibling;
                    if (menu.clientHeight == 0) {
                        height = menu.scrollHeight;
                    }

                    menu.style.height = `${height}px`;
                })
            })

        })

    }



}





document.addEventListener('DOMContentLoaded', iniciarApp);



