var getLights = "https://faircorp.cleverapps.io/api/lights/";
var getRooms = "https://faircorp.cleverapps.io/api/rooms/";
var getBuildings = "https://faircorp.cleverapps.io/api/buildings/";

//https://faircorp-paul-breugnot.cleverapps.io/api/lights/-1/switch

function modifyTable(type) {

    var cellId = document.createElement("td");
    var cellParentId = document.createElement("td");
    var cellLevel = document.createElement("td");
    var cellSwitchLight = document.createElement("td");
    var cellName = document.createElement("td");

    cellId.innerHTML = "Id";
    cellParentId.innerHTML = type == "Light" ? "Room Id" : type == "Room" ? "Building Id" : "";
    cellLevel.innerHTML = type == "Light" ? "Level" : "Floor";
    cellSwitchLight.innerHTML = "Status";
    cellName.innerHTML = "Name";

    // add the cells to the line
    var line = document.createElement("tr");
    line.appendChild(cellId);

    if (type == "Light") {
        line.appendChild(cellParentId);
        line.appendChild(cellLevel);
        line.appendChild(cellSwitchLight);
    } else if (type == "Room") {
        line.appendChild(cellName);
        line.appendChild(cellLevel);
        line.appendChild(cellParentId);
    } else {
        line.appendChild(cellName);
    }

    return line;
}

function createLight(lien) {

    // Light id
    var idLight = document.createElement("a");
    idLight.href = getLights + lien.id;
    idLight.appendChild(document.createTextNode(lien.id));

    // Room id
    var idRoom = document.createElement("a");
    idRoom.href = getRooms + lien.roomId;
    idRoom.appendChild(document.createTextNode(lien.roomId));

    // Level
    var level = document.createElement("span");
    level.appendChild(document.createTextNode(lien.level));

    // Switch light
    //button
    var switchLight = document.createElement("button");
    switchLight.id = "switchLight" + lien.id;

    //CSS
    var switchLightPitcure = document.createElement("img");
    switchLightPitcure.src = lien.status == "ON" ? "media/light_bulb_on.png" : "media/light_bulb_off.png";

    switchLight.addEventListener("click", function () {


        lien.status = lien.status == "ON" ? "OFF" : "ON";

        ajaxPost(getLights, lien, function (reponse) {
            console.log(reponse);
            switchLightPitcure.src = lien.status == "ON" ? "media/light_bulb_on.png" : "media/light_bulb_off.png";
        }, true);

    })

    var cellId = document.createElement("td");
    var cellRoomId = document.createElement("td");
    var cellLevel = document.createElement("td");
    var cellSwitchLight = document.createElement("td");

    switchLight.appendChild(switchLightPitcure);

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
    idRoom.href = getRooms + lien.id;
    idRoom.appendChild(document.createTextNode(lien.id));

    // Building id
    var idBuilding = document.createElement("a");
    idBuilding.href = getBuildings + lien.buildingId;
    idBuilding.appendChild(document.createTextNode(lien.id));

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
    cellFloor.appendChild(floor);
    cellName.appendChild(name);
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
    idBuilding.href = getBuildings + lien.id;
    idBuilding.appendChild(document.createTextNode(lien.id));

    // Name
    var name = document.createElement("span");
    name.appendChild(document.createTextNode(lien.name));

    var cellId = document.createElement("td");
    var cellName = document.createElement("td");

    cellId.appendChild(idBuilding);
    cellName.appendChild(name);

    // add the cells to the line
    var line = document.createElement("tr");
    line.appendChild(cellId);
    line.appendChild(cellName);

    return line;
}

function cleanTableau() {
    while (tableau.firstChild) {
        tableau.removeChild(tableau.firstChild);
    }
}

const tableau = document.getElementById("tableau");
const lightsButton = document.getElementById("lightsButton");
const roomsButton = document.getElementById("roomsButton");
const buildingsButton = document.getElementById("buildingsButton");

lightsButton.addEventListener("click", function () {
    cleanTableau();
    tableau.appendChild(modifyTable("Light"));
    ajaxGet(getLights, function (reponse) {
        var reponseLien = JSON.parse(reponse);
        reponseLien.forEach(function (lien) {
            var lienElt = createLight(lien);
            tableau.appendChild(lienElt);
        });
    });
});

roomsButton.addEventListener("click", function () {
    cleanTableau();
    tableau.appendChild(modifyTable("Room"));
    ajaxGet(getRooms, function (reponse) {
        var reponseLien = JSON.parse(reponse);
        reponseLien.forEach(function (lien) {
            var lienElt = createRoom(lien);
            tableau.appendChild(lienElt);
        });
    });
});


buildingsButton.addEventListener("click", function () {
    cleanTableau();
    tableau.appendChild(modifyTable("Building"));
    ajaxGet(getBuildings, function (reponse) {
        var reponseLien = JSON.parse(reponse);
        reponseLien.forEach(function (lien) {
            var lienElt = createBuilding(lien);
            tableau.appendChild(lienElt);
        });
    });
});
