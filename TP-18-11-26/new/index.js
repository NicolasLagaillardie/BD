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

function modifyAddButton(show, type) {
    addButton.innerHTML = type;
    addButton.style.display = show ? "flex" : "none";
    addButton.addEventListener("click", function () {

        cleanElement(formAddItem);

        addItem(type);
    });
}

function addItem(type) {

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

        const level = document.createElement("input");
        level.type = "range";
        level.min = "0";
        level.max = "255";
        level.value = "0";
        level.required = true;

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
        formAddItem.appendChild(status);
        formAddItem.appendChild(submit);

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

                formAddItem.removeEventListener("submit", addLight);

            }, true);

        }

        formAddItem.addEventListener("submit", addLight);

    } else if (type == "Add room") {

        const name = document.createElement("input");
        name.type = "text";
        name.value = "Name";
        name.required = true;

        const floor = document.createElement("input");
        floor.type = "text"
        floor.value = "Floor";
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

                formAddItem.removeEventListener("submit", addRoom);

            }, true);

        }

        formAddItem.addEventListener("submit", addRoom);

    } else if (type == "Add building") {

        const name = document.createElement("input");
        name.type = "text";
        name.value = "Name";
        name.required = true;

        const submit = document.createElement("input");
        submit.type = "submit";

        formAddItem.appendChild(name);
        formAddItem.appendChild(submit);

        function addBuilding(e) {

            e.preventDefault();

            ajaxPost(getBuildings, {
                name: name.value
            }, function (reponse) {

                const lienElt = createBuilding(JSON.parse(reponse));
                tableau.appendChild(lienElt);

                cleanElement(formAddItem);

                formAddItem.removeEventListener("submit", addBuilding);

            }, true);

        }

        formAddItem.addEventListener("submit", addBuilding);
    }
}

function cleanElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function showElement() {
    controlLights.seen = false;
    controlRooms.seen = false;
    controlBuildings.seen = false;
}

const tableau = document.getElementById("tableau");
const lightsButton = document.getElementById("lightsButton");
const roomsButton = document.getElementById("roomsButton");
const buildingsButton = document.getElementById("buildingsButton");
const addButton = document.getElementById("addButton");
const formAddItem = document.getElementById("formAddItem");

const tableLights = document.getElementById("lights");
const tableRooms = document.getElementById("rooms");
const tableBuildings = document.getElementById("buildings");

function switchLightGeneral(light) {
    light.status = light.status == "ON" ? "OFF" : "ON";

    axios
        .post(getLights, JSON.parse(JSON.stringify(light)));
}

function switchRoomGeneral(room) {

    console.log("0");

    axios
        .get(getLights)
        .then(function (response) {
            const lights = response.data;
            lights.forEach(function (light) {
                if (light.roomId == room.id) {
                    switchLightGeneral(light);
                    console.log("1");
                }
            })
        });
}

function checkRoom(room) {

    let switchStatus = "media/light_switch_off.png";

    axios
        .get(getLights)
        .then(function (response) {
            const lights = response.data;
            lights.forEach(function (light) {
                if (light.status == "ON" && light.roomId == room.id) {
                    switchStatus = "media/light_switch_on.png";
                    return;
                }
            })
        })

    return switchStatus;
}

lightsButton.addEventListener("click", function () {
    showElement();
    controlLights.seen = true;
});

const controlLights = new Vue({
    el: '#lights',
    data: {
        seen: false
    },
    data() {
        return {
            lights: null
        }
    },
    mounted() {
        axios
            .get(getLights)
            .then(response => (this.lights = response.data));
    },

    methods: {
        switchLight: function (light) {
            switchLightGeneral(light);
        },
        changePicture: function (light) {
            if (light.status == "ON") {
                return "media/light_bulb_on.png";
            } else {
                return "media/light_bulb_off.png";
            };
        },
        deleteLight: function (light) {

            axios
                .delete(getLights + light.id)
                .then(response =>
                    axios
                    .get(getLights)
                    .then(response => (this.lights = response.data)));
        }
    }
})

roomsButton.addEventListener("click", function () {
    showElement();
    controlRooms.seen = true;
});

const controlRooms = new Vue({
    el: '#rooms',
    data: {
        seen: false
    },
    data() {
        return {
            rooms: null
        }
    },
    mounted() {
        axios
            .get(getRooms)
            .then(response => (this.rooms = response.data));
    },

    methods: {
        switchLight: function (room) {

            switchRoomGeneral(room);

        },
        changePicture: function (room) {

            return checkRoom(room);
        },
        deleteRoom: function (room) {

            axios
                .delete(getRooms + room.id)
                .then(response =>
                    axios
                    .get(getRooms)
                    .then(response => (this.rooms = response.data)));
        }
    }
})


buildingsButton.addEventListener("click", function () {
    showElement();
    controlBuildings.seen = true;
});

const controlBuildings = new Vue({
    el: '#buildings',
    data: {
        seen: false
    },
    data() {
        return {
            buildings: null
        }
    },
    mounted() {
        axios
            .get(getBuildings)
            .then(response => (this.buildings = response.data));
    },

    methods: {
        switchLight: function (building) {

            axios
                .get(getRooms)
                .then(function (response) {
                    const rooms = response.data;
                    rooms.forEach(function (room) {
                        if (building.id == room.buildingId) {
                            switchRoomGeneral(room);
                        }
                    })
                });

        },
        changePicture: function (building) {

            let switchStatus = "media/light_switch_off.png";

            axios
                .get(getRooms)
                .then(function (response) {
                    const rooms = response.data;
                    rooms.forEach(function (room) {
                        if (room.buildingId == building.id) {

                            switchStatus = checkRoom(room);

                        }
                    })
                })

            return switchStatus;
        },
        deleteBuilding: function (building) {

            axios
                .delete(getBuildings + building.id)
                .then(response =>
                    axios
                    .get(getBuildings)
                    .then(response => (this.buildings = response.data)));
        }
    }
})
