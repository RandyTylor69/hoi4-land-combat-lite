const panzerDiv = document.querySelector(".tankIcon")
const infDiv = document.querySelector(".infIcon")
let isSelected = false

// ---------------------------------------------------
// Selecting Units
// ---------------------------------------------------

panzerDiv.addEventListener("click", (e) => {
    e.stopPropagation()
    selected(document.querySelector(".axisDivisions"))
})

document.body.addEventListener("click", ()=>{
    unselect(document.querySelector(".axisDivisions"))
})

infDiv.addEventListener("contextmenu", (e)=>{
    e.preventDefault()
    if (isSelected) {
        alert("esports click!")
    
    }
})

function selected(div) {
    div.style.boxShadow = "2px 2px 5px yellow"
    isSelected = true
}

function unselect(div) {
    div.style.boxShadow = "2px 2px 5px black"
    isSelected = false
}

// ------------------------------------------------------
// Initializing divs
// ------------------------------------------------------


