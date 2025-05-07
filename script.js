const panzerDiv = document.querySelector(".tankIcon")
const infDiv = document.querySelector(".infIcon")
const axisSide = document.querySelector(".axisSide")
const alliedSide = document.querySelector(".alliedSide")
const fieldX = []
const fieldY = []
let isSelected = false // if the PANZER div is selected or not


// ---------------------------------------------------
// Selecting Units
// ---------------------------------------------------

panzerDiv.addEventListener("click", (e) => {
    e.stopPropagation()
    selected(document.querySelector(".axisDivisions"))

    // add divisions to field
    for (let i = 0; i < 2; i++) {
        //                     atkSoft, atkHard, def, width, org, hp, hardness, armor, piercing, dmg factor (df)
        let div = new Division(800,     600,     800, 36,    30,  250,    0.7,    70,    100,    0.8)
    
        // add element to backend
        fieldX.push(div)

        // add element to frontend
        const fieldDiv = document.createElement('div') // fieldDiv = one div 
        const statsSpan = document.createElement('span')
        axisSide.appendChild(fieldDiv)
        fieldDiv.appendChild(statsSpan)
        fieldDiv.classList.add("divVisual")
        statsSpan.classList.add("axisTrait")
        statsSpan.innerHTML = "org: " + div.org

    }
})

document.body.addEventListener("click", ()=>{
    unselect(document.querySelector(".axisDivisions"))
})

infDiv.addEventListener("contextmenu", (e)=>{
    e.preventDefault()
    if (isSelected) {
        for (let i = 0; i < 5; i++) {
            //                     atkSoft, atkHard, def, width, org, hp, hardness, armor, piercing, dmg factor (df)
            let div = new Division(100,     40,      350, 16,    55,  250,    0,      0,     60,        0)
            fieldY.push(div)

                    // add element to frontend
            const fieldDiv = document.createElement('div') // fieldDiv = one div 
            const statsSpan = document.createElement('span')
            alliedSide.appendChild(fieldDiv)
            fieldDiv.appendChild(statsSpan)
            fieldDiv.classList.add("divVisual")
            statsSpan.classList.add("alliedTrait")
            statsSpan.innerHTML = "org: " + div.org
        }

        function modifyCombat() {
    
                engage(fieldX, fieldY) 
                for (let i of fieldX) {
                    let changedStatsSpan = document.querySelector(".axisTrait")
                    changedStatsSpan.innerHTML = "org: " + Math.round(i.org).toFixed(1)
                }
                
                for (let i of fieldY) {
                    let changedStatsSpan = document.querySelector(".alliedTrait")
                    changedStatsSpan.innerHTML = "org: " + Math.round(i.org).toFixed(1)
                }
        
        }
        
    

        // modifying axis stats after combat
        setInterval(modifyCombat, 250)


        


        console.log("after battle org of the first panzer div: " + Math.round(fieldX[0].org).toFixed(1))
        console.log("after battle hp of the first panzer div: " + Math.round(fieldX[0].hp).toFixed(1))
        console.log("after battle org of the first inf div: " + Math.round(fieldY[0].org).toFixed(1))
        console.log("after battle hp of the first inf div: " + Math.round(fieldY[0].hp).toFixed(1))
    
    
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

// ----------- CLASSES --------------------------------//

// ----------------------------------------------------//

class Division{
    constructor(atkSoft, atkHard, def, width, org, hp, hardness, armor, piercing, df) {
        this.atkSoft = atkSoft;
        this.atkHard = atkHard;
        this.def = def;
        this.width = width;
        this.hardness = hardness; // mot tanks have 0.5, mech tanks have 0.7 - 0.8 (depends on heavy or medium tanks)
        this.org = org;
        this.hp = hp;
        this.armor = armor;
        this.piercing = piercing;
        this.df = df;
    }

    dealDamage(other, dmg) {
        //dmg *= (1+this.df)
        let dmgNum = Math.round(dmg/10)
        let defNum = Math.round(other.def/10)
        let dmgHit = 0
        let orgRoll = 2.5

        if (dmgNum >= defNum) { // critting
            dmgHit = (dmgNum - defNum) * 0.4 + defNum * 0.1
        } else {
            dmgHit = dmgNum * 0.1
        }

        if (this.armor > other.piercing) {
            orgRoll++ 
        }

        let orgDmgDealt = dmgHit * orgRoll * 0.9 * 0.053
        let hpDmgDealt = dmgHit * 1.5 * 0.9 * 0.006

        other.org -= orgDmgDealt
        other.hp -= hpDmgDealt

        
    }

}

function engage(fieldX, fieldY) {

    // X attack Y
    for (let i of fieldX) {

        // 1. deal secondary damage to all targets
        for (let j of fieldY) {

            let secondaryDmg = (i.atkHard * j.hardness +i.atkSoft * (1-j.hardness)) * 0.65 / fieldY.length;
            i.dealDamage(j, secondaryDmg)
        }

        // 2. deal primary damage
        let primaryDmg = (i.atkHard * fieldY[0].hardness +fieldY[0].atkSoft * (1-fieldY[0].hardness)) * 0.35 
        i.dealDamage(fieldY[0], primaryDmg)
    }

    // Y attack X
    for (let i of fieldY) {

        // 1. deal secondary damage to all targets
        for (let j of fieldX) {

            let secondaryDmg = (i.atkHard * j.hardness +i.atkSoft * (1-j.hardness)) * 0.65 / fieldX.length;
            i.dealDamage(j, secondaryDmg)
        }

        // 2. deal primary damage
        let primaryDmg = (i.atkHard * fieldX[0].hardness +fieldX[0].atkSoft * (1-fieldX[0].hardness)) * 0.35 
        i.dealDamage(fieldX[0], primaryDmg)
    }

}
