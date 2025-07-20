//elementos para id
document.addEventListener("DOMContentLoaded", () => {
    // Espera a que todo el contenido HTML esté completamente cargado antes de ejecutar el script.

    //Elementos HTML
    const pokemonId = document.getElementById("pokemon-id");
    const pokemonName = document.getElementById("pokemon-name");
    const type1 = document.getElementById("type1");
    const type2 = document.getElementById("type2");
    const frontSprite = document.querySelector(".front-sprite");
    const backSprite = document.querySelector(".back-sprite");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    // variable para que el pokemon empiece en el 1, mantiene el id del pokemon actual
    let currentPokemonId = 1;

    //cargamos poke desde la api
    // obtiene los datos del pokemon con su id con la url del endpoint de tipo id
    async function loadPokemon(id) {
        //es asyncrono porque fetch tarda mucgo tiempo en dar respuesta y le decimos al navegador con async y await espera a 
        //que lleguen los datos antes de continuar
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        //la info que maneja o datos que maneja la api son de clima, localizacion etc

        try {
            const response = await fetch(url);
            //realiza peticion a url de metodo get y obtenemos/recuperamos datos
            if (!response.ok) throw new Error("Pokémon no encontrado");
            //pasamos la respuesta en json para facilitar manipular datos con js
            const data = await response.json();
            currentPokemonId = data.id;

            // Mostrar ID y nombre(con ceros delante siendo menor que 100)
            pokemonId.textContent = `#${data.id.toString().padStart(3, "0")}`;
            pokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            console.log(data);
            // la api devuelve los tipos en datatypes como array, para despues
            //mapearlo con map para extraer nombres de cada tipo
            const types = data.types.map(t => t.type.name);
            setTypeColors(types);

            //mostramos tipos si hay
            type1.textContent = types[0] || '-';
            type2.textContent = types[1] || '-';

            // Mostrar sprites con url de imagen trasera y frontal(data.sprites.back/front_default)
            frontSprite.innerHTML = `<img src="${data.sprites.front_default}" alt="Front sprite">`;
            backSprite.innerHTML = `<img src="${data.sprites.back_default}" alt="Back sprite">`;

        } catch (error) {
            console.error(error);
            pokemonId.textContent = "---";
            pokemonName.textContent = "No encontrado";
            type1.textContent = "";
            type2.textContent = "";
            frontSprite.innerHTML = "Sin imagen";
            backSprite.innerHTML = "Sin imagen";
        }
    }

    //eventos de botones
    prevButton.addEventListener("click", () => {
        if (currentPokemonId > 1) {
            currentPokemonId--;
            loadPokemon(currentPokemonId);//cargar pokemon anterior al reducir 1 el id 
        }
    });

    nextButton.addEventListener("click", () => {
        currentPokemonId++;
        loadPokemon(currentPokemonId);//cargamos el siguiente
    });

    // aqui se muestra el primer pokemon visual llamando a la funcion con id inicial(1)
    //al cargar la pagina por 1ºvez
    loadPokemon(currentPokemonId);

    //Formateo de colores por tipo
    function setTypeColors(types) {
        const typeColors = {
            fire: '#FF5733',
            water: '#3498DB',
            grass: '#2ECC71',
            electric: '#F1C40F',
            psychic: '#F85888',
            ice: '#5DADE2',
            dragon: '#130f40',
            dark: '#2C3E50',
            fairy: '#FFB6C1',
            normal: '#BDC3C7',
            ground: '#D4AC0D',
            rock: '#A04000',
            ghost: '#7D3C98',
            poison: '#8E44AD',
            fighting: '#E74C3C',
            bug: '#58D68D',
            flying: '#85C1E9',
            steel: '#95A5A6'
        };
        type1.style.backgroundColor = typeColors[types[0]] || 'gray';
        type2.style.backgroundColor = typeColors[types[1]] || 'gray';
    }
    //Opción buscar por id
    const searchInput = document.getElementById("search-name");
    const searchButton = document.getElementById("search-button");

    searchButton.addEventListener("click", () => {
        const nameOrId = searchInput.value.toLowerCase().trim();
        if (nameOrId) {
            loadPokemon(nameOrId);
        }
    });

    //funcion enter en buscar filtro
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            searchButton.click();
        }
    });

    //actualizar pagina con icono pokeball
    const resetLogo = document.getElementById("reset-logo");

    resetLogo.addEventListener("click", () => {
        window.location.reload();
    });

    //Boton de musica
    const musicButton = document.getElementById("toggle-music");
    const bgMusic = document.getElementById("bg-music");

    bgMusic.volume = 0.2;

    //musica muteada y se reproduce despues
    bgMusic.play().catch(() => {
        console.log("Autoplay bloqueado, esperando clic.");
    });

    // Al primer clic en cualquier parte del documento, desmutea y reproduce
    const handleFirstClick = () => {
        bgMusic.muted = false;
        bgMusic.play().then(() => {
            musicButton.classList.add("playing");
            showMusicMessage();
            console.log("Música activada tras clic");
        }).catch(err => console.error("Error al reproducir tras clic:", err));
        window.removeEventListener("click", handleFirstClick);
    };
    window.addEventListener("click", handleFirstClick);

    //pop up message
    function showMusicMessage() {
        const message = document.getElementById("music-message");
        message.classList.add("show");

        setTimeout(() => {
            message.classList.remove("show");
        }, 4000); // Desaparece después de 4 segundos
    }

    // Al pulsar el botón manual
    musicButton.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicButton.classList.add("playing");
            musicButton.setAttribute("title", "Pausar música");
        } else {
            bgMusic.pause();
            musicButton.classList.remove("playing");
            musicButton.setAttribute("title", "Reproducir música");
        }
    });

    //TEMA CLARO Y OSCURO
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    let darkMode = true;

    themeToggle.addEventListener("click", () => {
        darkMode = !darkMode;
        document.body.classList.toggle("light-theme", !darkMode);

        if (darkMode) {
            themeIcon.src = "assets/icon-luna.png";
            themeIcon.alt = "Modo oscuro";
            themeToggle.title = "Activar modo claro";
        } else {
            themeIcon.src = "assets/icon-sol.png";
            themeIcon.alt = "Modo claro";
            themeToggle.title = "Activar modo oscuro";
        }
    });

    //Transición imágenes de fondo
    const backgrounds = [
        'assets/fondo1.png',
        'assets/fondo2.png',
        'assets/fondo3.png'
    ];

    let index = 0;

    function changeBackground() {
        document.body.style.backgroundImage = `url(${backgrounds[index]})`;
        index = (index + 1) % backgrounds.length;
    }

    //10 segundos:
    setInterval(changeBackground, 10000);

    // Inicia con el primer fondo
    changeBackground();
});


