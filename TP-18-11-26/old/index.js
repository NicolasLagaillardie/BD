const serverURL = "https://faircorp-paul-breugnot.cleverapps.io/api/";
const getLights = serverURL + "lights/";
const getRooms = serverURL + "rooms/";
const getBuildings = serverURL + "buildings/";

//https://faircorp-paul-breugnot.cleverapps.io/api/lights/-1/switch

function modifyTable(type) {

    const cellId = document.createElement("th");
    const cellParentId = document.createElement("th");
    const cellLevel = document.createElement("th");
    const ccellColor = document.createElement("th");
    const cellSwitchLight = document.createElement("th");
    const cellName = document.createElement("th");
    const cellDelete = document.createElement("th");

    cellId.innerHTML = "Id";
    cellParentId.innerHTML = type == "Light" ? "Room Id" : type == "Room" ? "Building Id" : "";
    cellLevel.innerHTML = type == "Light" ? "Level" : "Floor";
    ccellColor.innerHTML = "Color";
    cellSwitchLight.innerHTML = "Status";
    cellName.innerHTML = "Name";
    cellDelete.innerHTML = "Delete";

    // add the cells to the line
    const line = document.createElement("tr");
    line.className = "columns";
    line.appendChild(cellId);

    if (type == "Light") {
        line.appendChild(cellParentId);
        line.appendChild(cellLevel);
        line.appendChild(ccellColor);
        line.appendChild(cellSwitchLight);
        line.appendChild(cellDelete);
    } else if (type == "Room") {
        line.appendChild(cellName);
        line.appendChild(cellLevel);
        line.appendChild(cellParentId);
        line.appendChild(cellSwitchLight);
        line.appendChild(cellDelete);
    } else {
        line.appendChild(cellName);
        line.appendChild(cellSwitchLight);
        line.appendChild(cellDelete);
    }

    return line;
}

function createLight(lien) {

    // Light id
    const idLight = document.createElement("button");
    idLight.appendChild(document.createTextNode(lien.id));

    idLight.addEventListener("click", function () {
        cleanElement(tableau);
        tableau.appendChild(modifyTable("Light"));
        ajaxGet(getLights + lien.id, function (reponse) {
            var lien = JSON.parse(reponse);
            var lienElt = createLight(lien);
            tableau.appendChild(lienElt);
        });
    });

    // Room id
    const idRoom = document.createElement("button");
    idRoom.appendChild(document.createTextNode(lien.roomId));

    idRoom.addEventListener("click", function () {
        cleanElement(tableau);
        tableau.appendChild(modifyTable("Room"));
        ajaxGet(getRooms + lien.roomId, function (reponse) {
            var lien = JSON.parse(reponse);
            var lienElt = createRoom(lien);
            tableau.appendChild(lienElt);
        });
    });

    // Level
    const level = document.createElement("span");
    level.appendChild(document.createTextNode(lien.level));

    // Level
    const color = document.createElement("input");
    color.type = "color";

    // Switch light
    //button
    const switchLight = document.createElement("button");
    switchLight.id = "switchLight" + lien.id;

    //CSS
    const switchLightPitcure = document.createElement("img");
    switchLightPitcure.src = lien.status == "ON" ? "media/light_bulb_on.png" : "media/light_bulb_off.png";

    switchLight.addEventListener("click", function () {
        lien.status = lien.status == "ON" ? "OFF" : "ON";
        ajaxPost(getLights, lien, function (reponse) {
            switchLightPitcure.src = lien.status == "ON" ? "media/light_bulb_on.png" : "media/light_bulb_off.png";
        }, true);
    });

    // Delete light
    //button
    const deleteLight = document.createElement("button");
    deleteLight.id = "deleteLight" + lien.id;

    //CSS
    const deleteLightPicture = document.createElement("img");
    deleteLightPicture.src = "media/delete.png";

    deleteLight.addEventListener("click", function () {
        ajaxDelete(getLights + lien.id, function (reponse) {
            tableau.removeChild(line);
        }, true);
    });

    const cellId = document.createElement("td");
    const cellRoomId = document.createElement("td");
    const cellLevel = document.createElement("td");
    const cellColor = document.createElement("td");
    const cellSwitchLight = document.createElement("td");
    const cellDeleteLight = document.createElement("td");

    switchLight.appendChild(switchLightPitcure);
    deleteLight.appendChild(deleteLightPicture);

    cellId.appendChild(idLight);
    cellRoomId.appendChild(idRoom);
    cellLevel.appendChild(level);
    cellColor.appendChild(color);
    cellSwitchLight.appendChild(switchLight);
    cellDeleteLight.appendChild(deleteLight);

    // add the cells to the line
    const line = document.createElement("tr");
    line.className = "cell";

    line.appendChild(cellId);
    line.appendChild(cellRoomId);
    line.appendChild(cellLevel);
    line.appendChild(cellColor);
    line.appendChild(cellSwitchLight);
    line.appendChild(cellDeleteLight);

    return line;
}

function createRoom(lien) {

    // Room id
    const idRoom = document.createElement("button");
    idRoom.appendChild(document.createTextNode(lien.id));

    idRoom.addEventListener("click", function () {
        cleanElement(tableau);
        cleanElement(formAddItem);
        tableau.appendChild(modifyTable("Light"));
        modifyAddButton(true, "Add light");
        ajaxGet(getLights, function (reponse) {
            var lights = JSON.parse(reponse);
            lights.forEach(function (light) {
                if (light.roomId == lien.id) {
                    const lienElt = createLight(light);
                    tableau.appendChild(lienElt);
                }
            })
        });
    });

    // Building id
    const idBuilding = document.createElement("button");
    idBuilding.appendChild(document.createTextNode(lien.buildingId));

    idBuilding.addEventListener("click", function () {
        cleanElement(tableau);
        tableau.appendChild(modifyTable("Building"));
        ajaxGet(getBuildings + lien.buildingId, function (reponse) {
            var lien = JSON.parse(reponse);
            var lienElt = createBuilding(lien);
            tableau.appendChild(lienElt);
        });
    });

    // Name
    const name = document.createElement("span");
    name.appendChild(document.createTextNode(lien.name));

    // Floor
    const floor = document.createElement("button");
    floor.appendChild(document.createTextNode(lien.floor));

    floor.addEventListener("click", function () {
        cleanElement(tableau);
        tableau.appendChild(modifyTable("Room"));
        ajaxGet(getRooms, function (reponse) {
            var reponseLien = JSON.parse(reponse);
            reponseLien.forEach(function (thisLien) {
                if (thisLien.floor == lien.floor) {
                    var lienElt = createRoom(thisLien);
                    tableau.appendChild(lienElt);
                }
            });
        });
    });

    // Switch light
    //button
    const switchLightRoom = document.createElement("button");
    switchLightRoom.id = "switchLightRoom" + lien.id;

    //CSS
    const switchLightRoomPitcure = document.createElement("img");

    //Check if all the lights are on
    var isLightOn = false;
    switchLightRoomPitcure.src = "media/light_switch_off.png";

    switchLightRoom.addEventListener("click", function () {
        isLightOn = !isLightOn;

        ajaxGet(getLights, function (reponse) {
            const reponseLien = JSON.parse(reponse);
            reponseLien.forEach(function (thisLien) {
                if (thisLien.roomId == lien.id) {

                    thisLien.status = isLightOn ? "ON" : "OFF";

                    ajaxPost(getLights, thisLien, function (reponse) {

                    }, true);

                    switchLightRoomPitcure.src = isLightOn ? "media/light_switch_on.png" : "media/light_switch_off.png";
                }
            });
        });
    });

    ajaxGet(getLights, function (reponse) {
        const reponseLien = JSON.parse(reponse);
        reponseLien.forEach(function (thisLien) {
            if (thisLien.roomId == lien.id) {
                if (thisLien.status == "ON") {
                    isLightOn = true;
                    switchLightRoomPitcure.src = "media/light_switch_on.png";
                    return;
                }
            }
        });
    });

    // Delete room
    //button
    const deleteRoom = document.createElement("button");
    deleteRoom.id = "deleteRoom" + lien.id;

    //CSS
    const deleteRoomPicture = document.createElement("img");
    deleteRoomPicture.src = "media/delete.png";

    deleteRoom.addEventListener("click", function () {
        ajaxDelete(getRooms + lien.id, function (reponse) {
            tableau.removeChild(line);
        }, true);
    });

    switchLightRoom.appendChild(switchLightRoomPitcure);
    deleteRoom.appendChild(deleteRoomPicture);

    const cellId = document.createElement("td");
    const cellFloor = document.createElement("td");
    const cellName = document.createElement("td");
    const cellBuildingId = document.createElement("td");
    const cellSwitchLight = document.createElement("td");
    const cellDeleteRoom = document.createElement("td");

    cellId.appendChild(idRoom);
    cellFloor.appendChild(floor);
    cellName.appendChild(name);
    cellBuildingId.appendChild(idBuilding);
    cellSwitchLight.appendChild(switchLightRoom);
    cellDeleteRoom.appendChild(deleteRoom);

    // add the cells to the line
    const line = document.createElement("tr");
    line.className = "cell";
    line.appendChild(cellId);
    line.appendChild(cellName);
    line.appendChild(cellFloor);
    line.appendChild(cellBuildingId);
    line.appendChild(cellSwitchLight);
    line.appendChild(cellDeleteRoom);

    return line;
}

function createBuilding(lien) {

    // Building id
    const idBuilding = document.createElement("button");
    idBuilding.appendChild(document.createTextNode(lien.id));

    idBuilding.addEventListener("click", function () {
        cleanElement(tableau);
        cleanElement(formAddItem);
        tableau.appendChild(modifyTable("Room"));
        modifyAddButton(true, "Add room");
        ajaxGet(getRooms, function (reponse) {
            var rooms = JSON.parse(reponse);
            rooms.forEach(function (room) {
                if (room.buildingId == lien.id) {
                    const lienElt = createRoom(room);
                    tableau.appendChild(lienElt);
                }
            })
        });
    });

    // Name
    const name = document.createElement("span");
    name.appendChild(document.createTextNode(lien.name));

    // Switch light
    //button
    const switchLightBuilding = document.createElement("button");
    switchLightBuilding.id = "switchLightBuilding" + lien.id;

    //CSS
    const switchLightBuildingPicture = document.createElement("img");

    //Check if all the lights are on
    var isLightOn = false;
    switchLightBuildingPicture.src = "media/light_switch_off.png";

    switchLightBuilding.addEventListener("click", function () {
        isLightOn = !isLightOn;

        ajaxGet(getRooms, function (reponseRoom) {
            const reponseRoomLien = JSON.parse(reponseRoom);
            reponseRoomLien.forEach(function (thisRoom) {
                if (thisRoom.buildingId == lien.id) {
                    ajaxGet(getLights, function (reponseLight) {
                        const reponseLightLien = JSON.parse(reponseLight);
                        reponseLightLien.forEach(function (thisLight) {
                            if (thisRoom.id == thisLight.roomId) {

                                thisLight.status = isLightOn ? "ON" : "OFF";

                                ajaxPost(getLights, thisLight, function (reponse) {

                                }, true);

                                switchLightBuildingPicture.src = isLightOn ? "media/light_switch_on.png" : "media/light_switch_off.png";
                            }
                        });
                    });
                }
            });
        });
    });

    ajaxGet(getRooms, function (reponseRoom) {
        const reponseRoomLien = JSON.parse(reponseRoom);
        reponseRoomLien.forEach(function (thisRoom) {
            if (thisRoom.buildingId == lien.id) {
                ajaxGet(getLights, function (reponseLight) {
                    const reponseLightLien = JSON.parse(reponseLight);
                    reponseLightLien.forEach(function (thisLight) {
                        if (thisLight.roomId == thisRoom.id) {
                            if (thisLight.status == "ON") {
                                isLightOn = true;
                                switchLightBuildingPicture.src = "media/light_switch_on.png";
                                return;
                            }
                        }
                    });
                });
            }
        });
    });

    // Delete building
    //button
    const deleteBuilding = document.createElement("button");
    deleteBuilding.id = "deleteBuilding" + lien.id;

    //CSS
    const deleteBuildingPicture = document.createElement("img");
    deleteBuildingPicture.src = "media/delete.png";

    deleteBuilding.addEventListener("click", function () {
        ajaxDelete(getBuildings + lien.id, function (reponse) {
            tableau.removeChild(line);
        }, true);
    });

    const cellId = document.createElement("td");
    const cellName = document.createElement("td");
    const cellSwitchLight = document.createElement("td");
    const cellDeleteBuilding = document.createElement("td");

    switchLightBuilding.appendChild(switchLightBuildingPicture);
    deleteBuilding.appendChild(deleteBuildingPicture);

    cellId.appendChild(idBuilding);
    cellName.appendChild(name);
    cellSwitchLight.appendChild(switchLightBuilding);
    cellDeleteBuilding.appendChild(deleteBuilding);

    // add the cells to the line
    const line = document.createElement("tr");
    line.className = "cell";
    line.appendChild(cellId);
    line.appendChild(cellName);
    line.appendChild(cellSwitchLight);
    line.appendChild(cellDeleteBuilding);

    return line;
}

function modifyAddButton(show, type) {
    addButton.innerHTML = type;
    divAddButton.style.display = show ? "block" : "none";
    addButton.addEventListener("click", function () {
        divFormAddItem.style.display = "block";
        divFormAddItem.style.animationName = "addItem";
        divFormAddItem.style.animationDuration = "2s";

        cleanElement(formAddItem);

        addItem(type);
    });
}

var isAddLightInitialized = false;
var isAddRoomInitialized = false;
var isAddBuildingInitialized = false;

function addItem(type) {

    divAddButton.style.display = "none";

    if (type == "Add light") {

        const roomId = document.createElement("select");

        ajaxGet(getRooms, function (reponse) {
            const reponseLien = JSON.parse(reponse);
            var index = 0;
            reponseLien.forEach(function (lien) {
                const option = document.createElement("option");
                option.value = lien.id;
                option.text = "Room ID : " + lien.id;
                roomId.options.add(option, index);
                index++;
            });
        });

        // Level
        const level = document.createElement("input");
        level.type = "range";
        level.min = "0";
        level.max = "255";
        level.value = "0";
        level.required = true;

        // Color
        const color = document.createElement("input");
        color.type = "color";

        const status = document.createElement("select");
        const on = document.createElement("option");
        const off = document.createElement("option");
        on.text = "ON";
        off.text = "OFF";
        status.options.add(on, 0);
        status.options.add(off, 1);

        const submit = document.createElement("input");
        submit.type = "submit";

        formAddItem.appendChild(roomId);
        formAddItem.appendChild(level);
        formAddItem.appendChild(color);
        formAddItem.appendChild(status);
        formAddItem.appendChild(submit);

        if (!isAddLightInitialized) {

            isAddLightInitialized = !isAddLightInitialized;

            function addLight(e) {
                e.preventDefault();

                ajaxPost(getLights, {
                    level: level.value,
                    status: status.value,
                    roomId: roomId.value
                }, function (reponse) {

                    const lienElt = createLight(JSON.parse(reponse));
                    tableau.appendChild(lienElt);

                    cleanElement(formAddItem);
                    divFormAddItem.style.display = "none";
                    modifyAddButton(true, type);

                    //formAddItem.removeEventListener("submit", addLight);

                }, true);

            }

            formAddItem.addEventListener("submit", addLight);

        }

    } else if (type == "Add room") {

        const name = document.createElement("input");
        name.type = "text";
        name.placeholder = "Name";
        name.required = true;

        const floor = document.createElement("input");
        floor.type = "number"
        floor.placeholder = "0";
        floor.required = true;

        const buildingId = document.createElement("select");

        ajaxGet(getBuildings, function (reponse) {
            const reponseLien = JSON.parse(reponse);
            var index = 0;
            reponseLien.forEach(function (lien) {
                const option = document.createElement("option");
                option.value = lien.id;
                option.text = "Building ID : " + lien.id;
                buildingId.options.add(option, index);
                index++;
            });
        });

        const submit = document.createElement("input");
        submit.type = "submit";

        formAddItem.appendChild(name);
        formAddItem.appendChild(floor);
        formAddItem.appendChild(buildingId);
        formAddItem.appendChild(submit);

        if (!isAddRoomInitialized) {

            isAddRoomInitialized = !isAddRoomInitialized;

            function addRoom(e) {
                e.preventDefault();

                ajaxPost(getRooms, {
                    name: name.value,
                    floor: floor.value,
                    buildingId: buildingId.value
                }, function (reponse) {

                    const lienElt = createRoom(JSON.parse(reponse));
                    tableau.appendChild(lienElt);

                    cleanElement(formAddItem);
                    divFormAddItem.style.display = "none";
                    modifyAddButton(true, type);

                    //formAddItem.removeEventListener("submit", addRoom);

                }, true);

            }

            formAddItem.addEventListener("submit", addRoom);

        }

    } else if (type == "Add building") {

        const name = document.createElement("input");
        name.type = "text";
        name.placeholder = "Name";
        name.required = true;

        const submit = document.createElement("input");
        submit.type = "submit";

        formAddItem.appendChild(name);
        formAddItem.appendChild(submit);

        if (!isAddBuildingInitialized) {

            isAddBuildingInitialized = !isAddBuildingInitialized;

            function addBuilding(e) {

                e.preventDefault();

                ajaxPost(getBuildings, {
                    name: name.value
                }, function (reponse) {

                    const lienElt = createBuilding(JSON.parse(reponse));
                    tableau.appendChild(lienElt);

                    cleanElement(formAddItem);
                    divFormAddItem.style.display = "none";
                    modifyAddButton(true, type);

                    //formAddItem.removeEventListener("submit", addBuilding);

                }, true);

            }

            formAddItem.addEventListener("submit", addBuilding);

        }
    }
}

function cleanElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

const tableau = document.getElementById("tableau");
const lightsButton = document.getElementById("lightsButton");
const roomsButton = document.getElementById("roomsButton");
const buildingsButton = document.getElementById("buildingsButton");
const addButton = document.getElementById("addButton");
const divAddButton = document.getElementById("divAddButton");
const formAddItem = document.getElementById("formAddItem");
const divFormAddItem = document.getElementById("divFormAddItem");

const tableLights = document.getElementById("lights");
const tableRooms = document.getElementById("rooms");
const tableBuildings = document.getElementById("buildings");

lightsButton.addEventListener("click", function () {
    cleanElement(tableau);
    cleanElement(formAddItem);
    tableau.appendChild(modifyTable("Light"));
    modifyAddButton(true, "Add light");
    ajaxGet(getLights, function (reponse) {
        const reponseLien = JSON.parse(reponse);
        reponseLien.forEach(function (lien) {
            const lienElt = createLight(lien);
            tableau.appendChild(lienElt);
        });
    });
});

roomsButton.addEventListener("click", function () {
    cleanElement(tableau);
    cleanElement(formAddItem);
    tableau.appendChild(modifyTable("Room"));
    modifyAddButton(true, "Add room");
    ajaxGet(getRooms, function (reponse) {
        const reponseLien = JSON.parse(reponse);
        reponseLien.forEach(function (lien) {
            const lienElt = createRoom(lien);
            tableau.appendChild(lienElt);
        });
    });
});


buildingsButton.addEventListener("click", function () {
    cleanElement(tableau);
    cleanElement(formAddItem);
    tableau.appendChild(modifyTable("Building"));
    modifyAddButton(true, "Add building");
    ajaxGet(getBuildings, function (reponse) {
        const reponseLien = JSON.parse(reponse);
        reponseLien.forEach(function (lien) {
            const lienElt = createBuilding(lien);
            tableau.appendChild(lienElt);
        });
    });
});
