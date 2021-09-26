// objetos
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeAttack = document.querySelector('.poke-attack');
const pokeDefense = document.querySelector('.poke-defense');
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');


// constantes y variables
const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
];
let prevUrl = null;
let nextUrl = null;


// Funciones
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () => {
    mainScreen.classList.remove('hide');
    for (const type of TYPES) {
        mainScreen.classList.remove(type);
    }
};

const fetchPokeList = url => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const {
                results,
                previous,
                next
            } = data;
            prevUrl = previous;
            nextUrl = next;

            for (let i = 0; i < pokeListItems.length; i++) {
                const pokeListItem = pokeListItems[i];
                const resultData = results[i];

                if (resultData) {
                    const {
                        name,
                        url
                    } = resultData;
                    const urlArray = url.split('/');
                    const id = urlArray[urlArray.length - 2];
                    pokeListItem.textContent = id + '. ' + capitalize(name);
                } else {
                    pokeListItem.textContent = '';
                }
            }
        });
};

const fetchPokeData = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`) /*Pokeapi para la busqueda del pokemon */
        .then(res => res.json())
        .then(data => {
            resetScreen();

            const dataTypes = data['types'];
            const dataFirstType = dataTypes[0];
            const dataSecondType = dataTypes[1];
            pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
            if(dataTypes[1]) { /*orden de los tipos */
                const dataFirstType = dataTypes[1];
                const dataSecondType = dataTypes[0];
                pokeTypeTwo.classList.remove('hide');
                pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
                pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
                mainScreen.classList.add(dataFirstType['type']['name'])
            }
            else {
                const dataFirstType = dataTypes[0];
                pokeTypeOne.textContent = dataFirstType['type']['name'];
                pokeTypeTwo.classList.add('hide');
                pokeTypeTwo.textContent = "";
                mainScreen.classList.add(dataFirstType['type']['name'])
            }
            mainScreen.classList.add(dataFirstType['type']['name']);

            pokeName.textContent = capitalize(data['name']);
            pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
            pokeWeight.textContent = data['weight'];
            pokeHeight.textContent = data['height'];
            pokeAttack.textContent = data.stats[1].base_stat;
            pokeDefense.textContent = data.stats[2].base_stat;
            pokeFrontImage.src = data['sprites']['front_default'] || '';
            pokeBackImage.src = data['sprites']['back_default'] || '';
        });
};

/*Botones*/
const handleLeftButtonClick = () => {
    if (prevUrl) {
        fetchPokeList(prevUrl);
    }
};

const handleRightButtonClick = () => {
    if (nextUrl) {
        fetchPokeList(nextUrl);
    }
};

const handleListItemClick = (e) => {
    if (!e.target) return;

    const listItem = e.target;
    if (!listItem.textContent) return;

    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);
};


// eventos al hacer click en botones
leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);
for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener('click', handleListItemClick);
}


// iniciar app de 0 a 20 pokemon en lista
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');