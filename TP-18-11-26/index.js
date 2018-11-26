const getLights = "https://faircorp-paul-breugnot.cleverapps.io/api/lights/";
const getRooms = "https://faircorp-paul-breugnot.cleverapps.io/api/rooms/";
const getBuildings = "https://faircorp-paul-breugnot.cleverapps.io/api/buildings/";

//https://faircorp-paul-breugnot.cleverapps.io/api/lights/-1/switch

function createLight(lien) {
    
    // Light id
    var idLight = document.createElement("a");
    idLight.href = getLights + lien.id;
    idLight.appendChild(document.createTextNode(lien.id));
    
    // Room id
    var idRoom = document.createElement("a");
    idRoom.href =  getRooms + lien.roomId;
    idRoom.appendChild(document.createTextNode(lien.roomId));
    
    // Level
    var level = document.createElement("span");
    level.appendChild(document.createTextNode(lien.level));
    
    // Switch light
    //button
    var switchLight = document.createElement("button");
    switchLight.id = "switchLight" + lien.id ;
    
    //CSS
    switchLightPicture.class = lien.status == "ON" ? style.lightOn : style.lightOff;
    
    switchLight.addEventListener("click", function () {
        
    })
    
    var cellId = document.createElement("td");
    var cellRoomId = document.createElement("td");
    var cellLevel = document.createElement("td");
    var cellSwitchLight = document.createElement("td");
    
    cellId.appendChild(idLight);
    cellRoomId.appendChild(idRoom);
    cellLevel.appendChild(level);
    cellSwitchLight.appendChild(switchLight);
    
    // add the cells to the line
    var line = document.createElement("tr");
    line.appendChild(cellId);
    line.appendChild(cellRoomId);
    line.appendChild(cellLevel);
    line.appendChild(cellSwitchLight);

    return line;
}

function createRoom(lien) {
    
    // Room id
    var idRoom = document.createElement("a");
    idRoom.href =  getRooms + lien.id;
    idRoom.appendChild(document.createTextNode(lien.roomId));
    
    // Building id
    var idBuilding = document.createElement("a");
    idBuilding.href =  getBuildings + lien.buildingId;
    idBuilding.appendChild(document.createTextNode(lien.roomId));
    
    // Name
    var name = document.createElement("span");
    name.appendChild(document.createTextNode(lien.name));
    
    // Floor
    var floor = document.createElement("span");
    floor.appendChild(document.createTextNode(lien.floor));
    
    var cellId = document.createElement("td");
    var cellFloor = document.createElement("td");
    var cellName = document.createElement("td");
    var cellBuildingId = document.createElement("td");
    
    cellId.appendChild(idRoom);
    cellFloor.appendChild(name);
    cellName.appendChild(floor);
    cellBuildingId.appendChild(idBuilding);
    
    // add the cells to the line
    var line = document.createElement("tr");
    line.appendChild(cellId);
    line.appendChild(cellName);
    line.appendChild(cellFloor);
    line.appendChild(cellBuildingId);

    return line;
}

function createBuilding(lien) {
    
    // Building id
    var idBuilding = document.createElement("a");
    idBuilding.href =  getBuildings + lien.buildingId;
    idBuilding.appendChild(document.createTextNode(lien.roomId));
    
    // Name
    var name = document.createElement("span");
    name.appendChild(document.createTextNode(lien.name));
    
    var cellId = document.createElement("td");
    var cellName = document.createElement("td");
    
    cellId.appendChild(idRoom);
    cellName.appendChild(floor);
    
    // add the cells to the line
    var line = document.createElement("tr");
    line.appendChild(cellId);
    line.appendChild(cellName);
    line.appendChild(cellFloor);
    line.appendChild(cellBuildingId);

    return line;
}



boutonAjoutLien.addEventListener("click", function () {
    // formulaire de saisie pour creer le lien :
    var formulaireElt = document.createElement("form");
    var champAuteur = document.createElement("input");
    var champTitre = document.createElement("input");
    var champUrl = document.createElement("input");
    var boutonSubmit = document.createElement("input");
    // Attribut pour formulaire
    boutonSubmit.type = "submit";
    boutonSubmit.value = "Ajouter";
    boutonSubmit.style.marginLeft = "8px";

    // Texte afficher
    champAuteur.placeholder = "Entre notre nom";
    champTitre.placeholder = "Entre le titre de votre lien";
    champUrl.placeholder = "Entre l'URL du lien";
    // Champs obligatoire
    champAuteur.required = true;
    champTitre.required = true;
    champUrl.required = true;
    // On insère tout les élements dans le formulaire
    formulaireElt.appendChild(champAuteur);
    formulaireElt.appendChild(champTitre);
    formulaireElt.appendChild(champUrl);
    formulaireElt.appendChild(boutonSubmit);
    // Pour faire apparaître le formulaire à la place du bouton
    divElt.innerHTML = "";
    divElt.appendChild(formulaireElt);
    // Evenement sur bouton ajouter 
    formulaireElt.addEventListener("submit", function (e) {
        e.preventDefault();

        // On rajoute la condition pour l'URL
        var url = champUrl.value;

        if ((url.indexOf("http://") !== 0) && (url.indexOf("https://") !== 0)) {
            url = "http://" + url;
        }
        // on crée un nouvel objet
        var newLien = {
            titre: champTitre.value,
            url: url,
            auteur: champAuteur.value
        };

        var lienElt = creerElementLien(newLien);
        // Ajoute le nouveau lien en haut de la liste
        contenuElt.insertBefore(lienElt, contenuElt.childNodes[2]);

        // Message afficher de confirmation 
        
        ajaxPost("https://oc-jswebsrv.herokuapp.com/api/lien", newLien, function (reponse) {
            var confimationElt = document.createElement("div");
            confimationElt.id = "confirmation";
            divElt.innerHTML = "";
            divElt.appendChild(confimationElt);
            confimationElt.textContent = "Votre lien '" + champTitre.value + "' à bien été ajouté !";
        }, true);


        // Remise à zéro 
        setTimeout(function () {
            divElt.innerHTML = "";
            divElt.appendChild(boutonAjoutLien);
        }, 2000);
    })

})

// On insere le tout dans une balise p
var saisieElt = document.createElement("p");
saisieElt.appendChild(divElt);
document.getElementById("contenu").appendChild(saisieElt);

var contenuElt = document.getElementById("contenu");
// Parcours de la liste des liens et ajout d'un élément au DOM pour chaque lien

ajaxGet(" https://oc-jswebsrv.herokuapp.com/api/liens", function (reponse) {
    var reponseLien = JSON.parse(reponse);
    reponseLien.forEach(function (lien) {
        var lienElt = creerElementLien(lien);
        contenuElt.appendChild(lienElt);
    });
});