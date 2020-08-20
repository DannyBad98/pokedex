const ONBUTTON = document.querySelector('.button')
const PANTALLA = document.getElementById('pantalla')
var BASEURL =  `https://pokeapi.co/api/v2/pokemon/?limit=40`
var nextURL
const search = document.getElementById('search')

function toggleScreen(){
    if(PANTALLA.style.backgroundColor === 'black'){
        PANTALLA.style.backgroundColor = 'white'
        renderPokemons(BASEURL)
        search.disabled = false
    }else{
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

PANTALLA.addEventListener('scroll', () => {
    const scrollable = PANTALLA.scrollHeight - PANTALLA.scrollTop
    const scroller = PANTALLA.clientHeight
    if(Math.ceil(scrollable) === scroller){
        morePokemons()
    }
})

async function morePokemons(){
    await renderPokemons(nextURL)
}

search.addEventListener('change', () => {
    renderPokemon(search.value)
})

async function renderPokemon(ID){
    PANTALLA.removeEventListener('scroll', null)
    PANTALLA.style.overflow = 'visible'
    const data = await getPokemon(ID)
    while(PANTALLA.firstChild){
        PANTALLA.removeChild(PANTALLA.firstChild)
    }
    PANTALLA.classList.add('pokemon')
    const container = document.createElement('div')
    const pkmnContainer = document.createElement('div')
    container.style.display = 'flex'
    container.style.justifyContent = 'center'
    container.style.alignItems = 'center'
    container.style.width = '225px'
    pkmnContainer.innerHTML = `
    <p class='pkmn-name' style=":auto;">${data.name}</p>
    <img src='${data.sprites.front_default}' style="margin:auto;">
    `
    const infoContainer = document.createElement('div')
    infoContainer.innerHTML = `
    <p class='pkmn-name' style=":auto;">${data.name}</p>`
    
    container.appendChild(pkmnContainer)
    PANTALLA.appendChild(container)
}