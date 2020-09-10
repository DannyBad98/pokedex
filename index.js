const ONBUTTON = document.querySelector('#btnEncender')
const PANTALLA = document.getElementById('pantalla')
var BASEURL =  `https://pokeapi.co/api/v2/pokemon/?limit=30`
var nextURL
const search = document.getElementById('search')
const OFFBUTTON = document.querySelector('#btnApagar')

OFFBUTTON.style.display = 'none'

function screenOn(){
        PANTALLA.style.backgroundColor = '#CFD6C6'
        pantallaPokemons()
        renderPokemons(BASEURL)
        ONBUTTON.style.display = 'none'
        OFFBUTTON.style.display = 'block'
        search.disabled = false
}
 function screenOff(){
        PANTALLA.style.backgroundColor = 'black'
        ONBUTTON.style.display = 'block'
        OFFBUTTON.style.display = 'none'
        nextURL = ''
        PANTALLA.innerHTML = ''
        search.value = ''
        search.disabled = true
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
        pkmnsContainer.style.width = '145px'
        pkmnsContainer.style.height = '145px'
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
const scrollable = PANTALLA.scrollHeight - PANTALLA.clientHeight
const scroller = PANTALLA.scrollTop
const screll = scroller / scrollable
    if(screll >= 0.98){
        console.log(`scrollable ${scrollable} scroller ${scroller} ${screll}`)
        morePokemons()
    }
})

function limpiarPantalla(){
    if (PANTALLA.firstChild){
        while(PANTALLA.firstChild){
            PANTALLA.removeChild(PANTALLA.firstChild)
        }
    }
}

function pantallaPokemons(){
    PANTALLA.classList.add('pokemons')
    PANTALLA.classList.remove('pokemon')
}

function pantallaPokemon(){
    PANTALLA.classList.remove('pokemons')
    PANTALLA.classList.add('pokemon')
}

function btnBack() {
    limpiarPantalla()
    pantallaPokemons()
    nextURL = ''
    renderPokemons(BASEURL)
    search.value = null
} 

async function morePokemons(){
    await renderPokemons(nextURL)
}

search.addEventListener('change', () => {
    if(search.value === ''){
        window.alert('Inserta un id de pokemon')
    }else{
        limpiarPantalla()
        pantallaPokemon()
        renderPokemon(search.value)
    }
})

async function renderPokemon(ID){
    PANTALLA.removeEventListener('scroll', null)
    const data = await getPokemon(ID)
    const container = document.createElement('div')
    container.className = 'pkmnContainer'
    container.innerHTML = `
    <div class='pkmn-name'>
    <p>${data.name}</p></div>
    <img src='${data.sprites.front_default}'">
    <div class='itemContainer'>Item</div>
    <div class='whiteSeparator'>None</div>
    `
    const infoContainer = document.createElement('div')
    infoContainer.className = 'infoContainer'
    infoContainer.innerHTML = `
    <ul class="nav nav-tabs justify-content-center" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <a class="nav-link active" id="info-tab" data-toggle="tab" href="#info" role="tab" aria-controls="home" aria-selected="true" style='background-color: #85DE8C'>I</a>
        </li>
        <li class="nav-item" role="presentation">
            <a class="nav-link" id="movements-tab" data-toggle="tab" href="#movements" role="tab" aria-controls="movements" aria-selected="false" style='background-color: #FB9E96'>M</a>
        </li>
        <li class="nav-item" role="presentation">
            <a class="nav-link" id="forms-tab" data-toggle="tab" href="#forms" role="tab" aria-controls="forms" aria-selected="false" style='background-color: #8895F8;'>F</a>
        </li>
    </ul>
    <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab" style='background-color: #85DE8C'>
            <p style='margin: auto; width: 40px'>Info</p>
            <p>Pokédex No. ${data.id}</p>
            <p>Name ${data.name}</p>
            <p>Type ${data.types[0].type.name}</p>
        </div>
        <div class="tab-pane fade" id="movements" role="tabpanel" aria-labelledby="movements-tab" style='background-color: #FB9E96'>
            <p style='margin: auto; width: 110px'>Movements</p>
            <p>${data.moves[0].move.name}</p>
            <p>${data.moves[1].move.name}</p>
            <p>${data.moves[2].move.name}</p>
        </div>
        <div class="tab-pane fade overflow-auto" id="forms" role="tabpanel" aria-labelledby="forms-tab" style='background-color: #8895F8; height: 175px'>
            <p style='margin: auto; width: 123px'>Default Form</p>
            <img src='${data.sprites.back_default}' class="rounded mx-auto" style='margin: auto;'> 
            <img src='${data.sprites.front_default}' class="rounded mx-auto" style='margin: auto;'> 
            <p style='margin: auto; width: 123px'>Shiny Form</p>
            <img src='${data.sprites.back_shiny}' class="rounded mx-auto" style='margin: auto;'> 
            <img src='${data.sprites.front_shiny}' class="rounded mx-auto" style='margin: auto;'> 
        </div>
    </div>
    `
    
    const pkmnHeader = document.createElement('div')
    pkmnHeader.className = 'pkmnHeader'
    pkmnHeader.innerHTML = `
    <img src='./img/return.png' width='30px' onclick="btnBack()">
    POKéMON INFO`

    PANTALLA.appendChild(pkmnHeader)
    PANTALLA.appendChild(container)
    PANTALLA.appendChild(infoContainer)
}