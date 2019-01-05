const serverURL = "https://faircorp-paul-breugnot.cleverapps.io/api/";
const getLights = serverURL + "lights/";
const getRooms = serverURL + "rooms/";
const getBuildings = serverURL + "buildings/";

function createLight(lien) {

    components.gridData.push({
        id: lien.id,
        roomId: lien.roomId,
        level: lien.level,
        hue: lien.hue,
        saturation: lien.saturation,
        connected: lien.connected,
        status: "status_" + lien.id,
        delete: "delete_" + lien.id
    });

    function checkLight() {

        if (document.getElementById("img_delete_" + lien.id)) {
            // Light id
            const idLight = document.getElementById("button_id_" + lien.id);

            // Room id
            const idRoom = document.getElementById("button_roomId_" + lien.id);

            // Level
            const spanLevel = document.getElementById("span_level_" + lien.id);
            const level = document.createElement("input");
            level.type = "range";
            level.min = 0;
            level.max = 255;
            level.value = lien.level;
            spanLevel.removeChild(spanLevel.firstChild);
            spanLevel.appendChild(level);

            // Hue
            const spanHue = document.getElementById("span_hue_" + lien.id);
            const hue = document.createElement("input");
            hue.type = "range";
            hue.min = 0;
            hue.max = 1;
            hue.step = 0.1;
            hue.value = lien.hue;
            spanHue.removeChild(spanHue.firstChild);
            spanHue.appendChild(hue);

            // Saturation
            const spanSaturation = document.getElementById("span_saturation_" + lien.id);
            const saturation = document.createElement("input");
            saturation.type = "range";
            saturation.min = 0;
            saturation.max = 1;
            saturation.step = 0.1;
            saturation.value = lien.saturation;
            spanSaturation.removeChild(spanSaturation.firstChild);
            spanSaturation.appendChild(saturation);

            // Connected light
            //button
            const connectedLight = document.getElementById("button_connected_" + lien.id);

            //CSS
            connectedLight.removeChild(connectedLight.lastChild);
            const connectedLightPitcure = document.getElementById("img_connected_" + lien.id);
            connectedLightPitcure.style.display = "flex";
            connectedLightPitcure.src = lien.connected ? "media/connected.svg" : "media/disconnected.svg";

            // Switch light
            //button
            const switchLight = document.getElementById("button_status_" + lien.id);

            //CSS
            switchLight.removeChild(switchLight.lastChild);
            const switchLightPitcure = document.getElementById("img_status_" + lien.id);
            switchLightPitcure.style.display = "flex";
            switchLightPitcure.src = lien.status == "ON" ? "media/light_bulb_on.png" : "media/light_bulb_off.png";

            // Delete light
            const deleteLight = document.getElementById("button_delete_" + lien.id);

            deleteLight.removeChild(deleteLight.lastChild);
            const deleteLightPicture = document.getElementById("img_delete_" + lien.id);
            deleteLightPicture.style.display = "flex";
            deleteLightPicture.src = "media/delete.png";

            //--------------------------------------------------------------------------
            // DOM actions
            //--------------------------------------------------------------------------   

            idLight.onclick = function () {
                cleanElement(formAddItem);
                modifyAddButton(true, "Add light");

                components.gridColumns = ['id', 'roomId', 'level', 'hue', 'saturation', 'connected', 'status', 'delete'];
                components.gridData = [];

                ajaxGet(getLights + lien.id, function (reponse) {
                    createLight(JSON.parse(reponse));
                });
            };

            idRoom.onclick = function () {
                cleanElement(formAddItem);
                modifyAddButton(true, "Add room");

                components.gridColumns = ['id', 'name', 'floor', 'status', 'delete'];
                components.gridData = [];

                ajaxGet(getRooms + lien.roomId, function (reponse) {
                    createRoom(JSON.parse(reponse));
                });
            };

            level.onchange = function (e) {
                lien.level = e.target.value;
                ajaxPost(getLights, lien, function (reponse) {
                    components.gridData = components.gridData.filter(el => el.id === lien.id ? {
                        id: lien.id,
                        roomId: lien.roomId,
                        level: lien.level,
                        hue: lien.hue,
                        saturation: lien.saturation,
                        connected: lien.connected,
                        color: "color_" + lien.id,
                        status: "status_" + lien.id,
                        delete: "delete_" + lien.id
                    } : el)
                }, true);
            };

            hue.onchange = function (e) {
                lien.hue = e.target.value;
                ajaxPost(getLights, lien, function (reponse) {
                    components.gridData = components.gridData.filter(el => el.id === lien.id ? {
                        id: lien.id,
                        roomId: lien.roomId,
                        level: lien.level,
                        hue: lien.hue,
                        saturation: lien.saturation,
                        connected: lien.connected,
                        color: "color_" + lien.id,
                        status: "status_" + lien.id,
                        delete: "delete_" + lien.id
                    } : el)
                }, true);
            };

            saturation.onchange = function (e) {
                lien.saturation = e.target.value;
                ajaxPost(getLights, lien, function (reponse) {
                    components.gridData = components.gridData.filter(el => el.id === lien.id ? {
                        id: lien.id,
                        roomId: lien.roomId,
                        level: lien.level,
                        hue: lien.hue,
                        saturation: lien.saturation,
                        connected: lien.connected,
                        color: "color_" + lien.id,
                        status: "status_" + lien.id,
                        delete: "delete_" + lien.id
                    } : el)
                }, true);
            };

            switchLight.onclick = function () {
                lien.status = lien.status == "ON" ? "OFF" : "ON";
                ajaxPost(getLights, lien, function (reponse) {
                    switchLightPitcure.src = lien.status == "ON" ? "media/light_bulb_on.png" : "media/light_bulb_off.png";
                }, true);
            };

            deleteLight.onclick = function () {
                ajaxDelete(getLights + lien.id, function (reponse) {
                    components.gridData = components.gridData.filter(el => el.id !== lien.id)
                }, true);
            };
        } else {
            setTimeout(checkLight, 100);
        }
    }

    checkLight();

}

function createRoom(lien) {

    components.gridData.push({
        id: lien.id,
        name: lien.name,
        floor: lien.floor,
        buildingId: lien.buildingId,
        status: "status_" + lien.id,
        delete: "delete_" + lien.id
    });

    function checkRoom() {

        if (document.getElementById("img_delete_" + lien.id)) {

            // Room id
            const idRoom = document.getElementById("button_id_" + lien.id);

            // Name
            const idName = document.getElementById("button_name_" + lien.id);

            // Floor
            const idFloor = document.getElementById("button_floor_" + lien.id);

            // Building id
            const idBuilding = document.getElementById("button_buildingId_" + lien.id);

            // Switch light
            //button
            const switchLight = document.getElementById("button_status_" + lien.id);

            //CSS
            switchLight.removeChild(switchLight.lastChild);
            const switchLightPitcure = document.getElementById("img_status_" + lien.id);
            switchLightPitcure.style.display = "flex";
            switchLightPitcure.src = lien.status == "ON" ? "media/light_switch_on.png" : "media/light_switch_off.png";

            // Delete room
            const deleteRoom = document.getElementById("button_delete_" + lien.id);

            deleteRoom.removeChild(deleteRoom.lastChild);
            const deleteRoomPicture = document.getElementById("img_delete_" + lien.id);
            deleteRoomPicture.style.display = "flex";
            deleteRoomPicture.src = "media/delete.png";

            //--------------------------------------------------------------------------
            // DOM actions
            //--------------------------------------------------------------------------

            idRoom.onclick = function () {
                cleanElement(formAddItem);
                modifyAddButton(true, "Add light");

                components.gridColumns = ['id', 'roomId', 'level', 'hue', 'saturation', 'connected', 'status', 'delete'];
                components.gridData = [];

                ajaxGet(getRooms + lien.id + '/lights', function (reponse) {
                    const reponseLien = JSON.parse(reponse);
                    reponseLien.forEach(function (lien) {
                        createLight(lien);
                    });
                });
            };

            idBuilding.onclick = function () {
                cleanElement(formAddItem);
                modifyAddButton(true, "Add building");

                components.gridColumns = ['id', 'name', 'status', 'delete'];
                components.gridData = [];

                ajaxGet(getBuildings + lien.buildingId, function (reponse) {
                    createBuilding(JSON.parse(reponse));
                });
            };

            idFloor.onclick = function () {
                components.gridData = components.gridData.filter(el => el.floor === lien.floor)
            };

            switchLight.onclick = function () {
                lien.status = lien.status == "ON" ? "OFF" : "ON";
                ajaxPost(getRooms + lien.id + "/switch", lien, function (reponse) {
                    switchLightPitcure.src = lien.status == "ON" ? "media/light_switch_on.png" : "media/light_switch_off.png";
                }, true);
            };

            deleteRoomPicture.onclick = function () {
                ajaxDelete(getRooms + lien.id, function (reponse) {
                    components.gridData = components.gridData.filter(el => el.id !== lien.id)
                }, true);
            };
        } else {
            setTimeout(checkRoom, 100);
        }
    }

    checkRoom();
}

function createBuilding(lien) {

    components.gridData.push({
        id: lien.id,
        name: lien.name,
        status: "status_" + lien.id,
        delete: "delete_" + lien.id
    });

    function checkBuilding() {

        if (document.getElementById("img_delete_" + lien.id)) {

            // Room id
            const idBuilding = document.getElementById("button_id_" + lien.id);

            // Name
            const idName = document.getElementById("button_name_" + lien.id);

            // Switch light
            //button
            const switchLight = document.getElementById("button_status_" + lien.id);

            //CSS
            switchLight.removeChild(switchLight.lastChild);
            const switchLightPitcure = document.getElementById("img_status_" + lien.id);
            switchLightPitcure.style.display = "flex";

            // Delete building
            const deleteBuilding = document.getElementById("button_delete_" + lien.id);

            deleteBuilding.removeChild(deleteBuilding.lastChild);
            const deleteBuildingPicture = document.getElementById("img_delete_" + lien.id);
            deleteBuildingPicture.style.display = "flex";
            deleteBuildingPicture.src = "media/delete.png";

            //Check if all the lights are on
            var isLightOn = false;
            switchLightPitcure.src = "media/light_switch_off.png";

            ajaxGet(getBuildings + lien.id + '/rooms', function (reponse) {
                const reponseLien = JSON.parse(reponse);
                reponseLien.forEach(function (thisLien) {
                    if (thisLien.status == "ON") {
                        isLightOn = true;
                        switchLightPitcure.src = "media/light_switch_on.png";
                        return;
                    };
                });
            });

            //--------------------------------------------------------------------------
            // DOM actions
            //--------------------------------------------------------------------------

            idBuilding.onclick = function () {
                cleanElement(formAddItem);
                modifyAddButton(true, "Add room");

                components.gridColumns = ['id', 'name', 'floor', 'buildingId', 'status', 'delete'];
                components.gridData = [];

                ajaxGet(getBuildings + lien.id + '/rooms', function (reponse) {
                    const reponseLien = JSON.parse(reponse);
                    reponseLien.forEach(function (lien) {
                        createRoom(lien);
                    });
                });
            };

            deleteBuilding.onclick = function () {
                ajaxDelete(getBuildings + lien.id, function (reponse) {
                    components.gridData = components.gridData.filter(el => el.id !== lien.id)
                }, true);
            };
        } else {
            setTimeout(checkBuilding, 100);
        }
    }

    checkBuilding();

}

function modifyAddButton(show, type) {
    addButton.innerHTML = type;
    divAddButton.style.display = show ? "block" : "none";
    addButton.onclick = function () {
        divFormAddItem.style.display = "block";
        divFormAddItem.style.animationName = "addItem";
        divFormAddItem.style.animationDuration = "2s";

        cleanElement(formAddItem);

        addItem(type);
    };
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

<<<<<<< HEAD
        formAddItem.onsubmit = function (e) {
            e.preventDefault();
=======
        if (!isAddLightInitialized) {
>>>>>>> 3741fb9567860910c1998991159893ad18f3e23c

            isAddLightInitialized = !isAddLightInitialized;

<<<<<<< HEAD
                createLight(JSON.parse(reponse));
=======
            function addLight(e) {
                e.preventDefault();

                ajaxPost(getLights, {
                    level: level.value,
                    status: status.value,
                    roomId: roomId.value
                }, function (reponse) {
>>>>>>> 3741fb9567860910c1998991159893ad18f3e23c

                    const lienElt = createLight(JSON.parse(reponse));
                    tableau.appendChild(lienElt);

                    cleanElement(formAddItem);
                    divFormAddItem.style.display = "none";
                    modifyAddButton(true, type);

                    //formAddItem.removeEventListener("submit", addLight);

                }, true);

            }

<<<<<<< HEAD
=======
            formAddItem.addEventListener("submit", addLight);

        }

>>>>>>> 3741fb9567860910c1998991159893ad18f3e23c
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

<<<<<<< HEAD
        formAddItem.onsubmit = function (e) {
            e.preventDefault();
=======
        if (!isAddRoomInitialized) {
>>>>>>> 3741fb9567860910c1998991159893ad18f3e23c

            isAddRoomInitialized = !isAddRoomInitialized;

<<<<<<< HEAD
                createRoom(JSON.parse(reponse));
=======
            function addRoom(e) {
                e.preventDefault();

                ajaxPost(getRooms, {
                    name: name.value,
                    floor: floor.value,
                    buildingId: buildingId.value
                }, function (reponse) {
>>>>>>> 3741fb9567860910c1998991159893ad18f3e23c

                    const lienElt = createRoom(JSON.parse(reponse));
                    tableau.appendChild(lienElt);

                    cleanElement(formAddItem);
                    divFormAddItem.style.display = "none";
                    modifyAddButton(true, type);

                    //formAddItem.removeEventListener("submit", addRoom);

                }, true);

<<<<<<< HEAD
=======
            }

            formAddItem.addEventListener("submit", addRoom);

        }

>>>>>>> 3741fb9567860910c1998991159893ad18f3e23c
    } else if (type == "Add building") {

        const name = document.createElement("input");
        name.type = "text";
        name.placeholder = "Name";
        name.required = true;

        const submit = document.createElement("input");
        submit.type = "submit";

        formAddItem.appendChild(name);
        formAddItem.appendChild(submit);

<<<<<<< HEAD
        formAddItem.onsubmit = function (e) {
=======
        if (!isAddBuildingInitialized) {
>>>>>>> 3741fb9567860910c1998991159893ad18f3e23c

            isAddBuildingInitialized = !isAddBuildingInitialized;

            function addBuilding(e) {

<<<<<<< HEAD
                createBuilding(JSON.parse(reponse));
=======
                e.preventDefault();

                ajaxPost(getBuildings, {
                    name: name.value
                }, function (reponse) {
>>>>>>> 3741fb9567860910c1998991159893ad18f3e23c

                    const lienElt = createBuilding(JSON.parse(reponse));
                    tableau.appendChild(lienElt);

                    cleanElement(formAddItem);
                    divFormAddItem.style.display = "none";
                    modifyAddButton(true, type);

<<<<<<< HEAD
=======
                    //formAddItem.removeEventListener("submit", addBuilding);

                }, true);

            }

            formAddItem.addEventListener("submit", addBuilding);

>>>>>>> 3741fb9567860910c1998991159893ad18f3e23c
        }
    }
}

function cleanElement(element) {
    if (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
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

lightsButton.onclick = function () {
    cleanElement(formAddItem);
    modifyAddButton(true, "Add light");

    components.gridColumns = ['id', 'roomId', 'level', 'hue', 'saturation', 'connected', 'status', 'delete'];
    components.gridData = [];

    ajaxGet(getLights, function (reponse) {
        const reponseLien = JSON.parse(reponse);
        reponseLien.forEach(function (lien) {
            createLight(lien);
        });
    });
};

roomsButton.onclick = function () {
    cleanElement(formAddItem);
    modifyAddButton(true, "Add room");

    components.gridColumns = ['id', 'name', 'floor', 'buildingId', 'status', 'delete'];
    components.gridData = [];

    ajaxGet(getRooms, function (reponse) {
        const reponseLien = JSON.parse(reponse);
        reponseLien.forEach(function (lien) {
            createRoom(lien);
        });
    });
};


buildingsButton.onclick = function () {
    cleanElement(formAddItem);
    modifyAddButton(true, "Add building");

    components.gridColumns = ['id', 'name', 'status', 'delete'];
    components.gridData = [];

    ajaxGet(getBuildings, function (reponse) {
        const reponseLien = JSON.parse(reponse);
        reponseLien.forEach(function (lien) {
            createBuilding(lien);
        });
    });
};

// register the grid component
Vue.component('components-grid', {
    template: '#components-grid-template',
    props: {
        data: Array,
        columns: Array,
        filterKey: String
    },
    data: function () {
        var sortOrders = {}
        this.columns.forEach(function (key) {
            sortOrders[key] = 1
        })
        return {
            sortKey: '',
            sortOrders: sortOrders
        }
    },
    computed: {
        filteredData: function () {
            var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            var order = this.sortOrders[sortKey] || 1
            var data = this.data
            if (filterKey) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }

            return data
        }
    },
    filters: {
        capitalize: function (str) {
            let temp = str.split(/(?=[A-Z])/);
            temp[0] = temp[0].charAt(0).toUpperCase() + temp[0].slice(1)
            return temp.join(' ');
        }
    },
    methods: {
        sortBy: function (key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        }
    }
})

const components = new Vue({
    el: '#components',
    data: {
        searchQuery: '',
        gridColumns: [],
        gridData: []
    }
})
