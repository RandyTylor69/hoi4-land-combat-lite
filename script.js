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

// ----------- CLASSES --------------------------------//

// ----------------------------------------------------//

class Division{
    constructor(atkSoft, atkHard, def, width, org, hp, hardness, armor, piercing) {
        this.atkSoft = atkSoft;
        this.atkHard = atkHard;
        this.def = def;
        this.width = width;
        this.hardness = hardness; // mot tanks have 0.5, mech tanks have 0.7 - 0.8 (depends on heavy or medium tanks)
        this.org = org;
        this.hp = hp;
        this.armor = armor;
        this.piercing = piercing;
    }

    dealDamage(other, dmg) {

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

            let secondaryDmg = (i.atkHard * j.hardness +i.atkSoft * (1-j.hardness)) * 0.65 / fieldY.size();
            i.dealDamage(j, secondaryDmg)
        }

        // 2. deal primary damage
        let primaryDmg = (i.atkHard * j.hardness +i.atkSoft * (1-j.hardness)) * 0.35 
        i.dealDamage(fieldY[0], primaryDmg)
    }

    // Y attack X
    for (let i of fieldY) {

        // 1. deal secondary damage to all targets
        for (let j of fieldX) {

            let secondaryDmg = (i.atkHard * j.hardness +i.atkSoft * (1-j.hardness)) * 0.65 / fieldX.size();
            i.dealDamage(j, secondaryDmg)
        }

        // 2. deal primary damage
        let primaryDmg = (i.atkHard * j.hardness +i.atkSoft * (1-j.hardness)) * 0.35 
        i.dealDamage(fieldX[0], primaryDmg)
    }

}
