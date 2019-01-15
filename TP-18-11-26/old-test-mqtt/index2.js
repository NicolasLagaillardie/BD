

//--------------------------------------------------------------------------
// MQTT
//--------------------------------------------------------------------------

const client = mqtt.connect("ws://ec2-54-236-113-5.compute-1.amazonaws.com:9001");

function subscribe() {
    console.log("Connecting...");

    // subscribe to some topic
    client.on("connect", function () {
        client.subscribe("test_topic", function (err) {
            console.log("Subscribing...");
            if (err) {
                console.log(err);
            } else {
                console.log("Connected");
            }
        });
    });
    
    console.log("Connection...");

    // this will be called when a message is received
    client.on("message", function (topic, payload) {
        const message = new TextDecoder("utf-8").decode(payload);
        console.log("Message received");
        console.log(topic);
        console.log(message);

    });
    
    console.log("Receiving messages...");
    
    console.log(client);

};

subscribe();