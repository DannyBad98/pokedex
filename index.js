const ONBUTTON = document.querySelector('.button')
const PANTALLA = document.getElementById('pantalla')
var BASEURL =  `https://pokeapi.co/api/v2/pokemon/?limit=40`
var nextURL
const search = document.getElementById('search')

function toggleScreen(){
    if(PANTALLA.style.backgroundColor === 'black'){
        PANTALLA.style.backgroundColor = '#CFD6C6'
        renderPokemons(BASEURL)
        search.disabled = false
        addEventListenerScroll()
    }else{
        limpiarPantalla()
        PANTALLA.style.backgroundColor = 'black'
        PANTALLA.innerHTML = ''
        search.disabled = true
    }
}

async function getPokemons(url){
    const response = await fetch(url)
    const data = await response.json()
    return data
}

async function getPokemon(ID){
    const url = `https://pokeapi.co/api/v2/pokemon/${ID}`
    const response = await fetch(url)
    const data = await response.json()
    return data
}

async function renderPokemons(url){
    pantallaPokemons()
    const data = await getPokemons(url)
    const pokemons = data.results
    nextURL = data.next
    pokemons.forEach(pokemon => {
        var pkmnUrl = pokemon.url
        var number = pkmnUrl.slice(34, -1)
        const pkmnsContainer = document.createElement('div')
        pkmnsContainer.style.width = '150px'
        pkmnsContainer.style.height = '150px'
        pkmnsContainer.style.textAlign = 'center'
        pkmnsContainer.innerHTML = `
        <p class='pkmn-name' style="margin: 0px;">${pokemon.name}</p>
        <img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number}.png'>
        `
        PANTALLA.appendChild(pkmnsContainer)
    });
    return data.next
}

function addEventListenerScroll(){
    PANTALLA.addEventListener('scroll', () => {
        const scrollable = PANTALLA.scrollHeight - PANTALLA.scrollTop
        const scroller = PANTALLA.clientHeight
        if(Math.ceil(scrollable) === scroller){
            morePokemons()
        }
    })
}

function limpiarPantalla(){
    if (PANTALLA.firstChild){
        while(PANTALLA.firstChild){
            PANTALLA.removeChild(PANTALLA.firstChild)
        }
    }
}

function pantallaPokemons(){
    addEventListenerScroll()
    PANTALLA.classList.remove('pokemon')
}

function btnBack() {
    pantallaPokemons()
    renderPokemons(BASEURL)
    search.value = null
} 

async function morePokemons(){
    await renderPokemons(nextURL)
}

search.addEventListener('change', () => {
    renderPokemon(search.value)
})

async function renderPokemon(ID){
    PANTALLA.removeEventListener('scroll', null)
    const data = await getPokemon(ID)
    while(PANTALLA.firstChild){
        PANTALLA.removeChild(PANTALLA.firstChild)
    }

    PANTALLA.classList.add('pokemon')
    const container = document.createElement('div')
    container.className = 'pkmnContainer'
    container.innerHTML = `
    <div class='pkmn-name'>${data.name}</div>
    <img src='${data.sprites.front_default}'">
    <div class='itemContainer'>Item</div>
    <div class='whiteSeparator'>None</div>
    `
    const infoContainer = document.createElement('div')
    infoContainer.className = 'infoContainer'
    infoContainer.innerHTML = `
    <p>Pokédex No. ${data.id}</p>
    <p>Name ${data.name}</p>
    <p>Type ${data.types[0].type.name}</p>`
    
    const pkmnHeader = document.createElement('div')
    pkmnHeader.className = 'pkmnHeader'
    pkmnHeader.innerHTML = `
    <img src='./img/return.png' width='30px' onclick="btnBack()">
    POKéMON INFO`

    PANTALLA.appendChild(pkmnHeader)
    PANTALLA.appendChild(container)
    PANTALLA.appendChild(infoContainer)
}