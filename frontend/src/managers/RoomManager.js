import Room from "../components/Room/Room";
import RoomManagerException from "../Exceptions/RoomManagerException";

export default class RoomManager {
    constructor(room: Room, room_id) {
        this.client = null
        this.room = room
        this.room_id = room_id
        this.connect()
        this.changeInput = this.changeInput.bind(this)
    }

    connect(){
        if (this.room_id !== undefined) {
            this.client = new WebSocket(`ws://localhost:8000/ws/room/${this.room_id}`)
            if (this.client !== undefined) {
                this.setClientFunctions()
            } else {
                throw new RoomManagerException("Could not connect to websocket")
            }
        } else {
            throw new RoomManagerException("room_id not defined")
        }
    }

    lostConnection(){
        console.log("Connection lost, trying to reconnect.")
        this.connect()
    }

    setClientFunctions() {
        console.log(this.client)
        if (this.client !== undefined) {
            this.client.onopen = this.onopen.bind(this)

            this.client.onerror = this.onerror.bind(this)

            this.client.onmessage = this.onmessage.bind(this)

            this.client.onclose = this.onclose.bind(this)
        } else {
            this.lostConnection()
        }
    }

    onopen(){
        console.log(`Websocket client connected!`)
        this.client.send(JSON.stringify({
            'type': 'authorization',
            'data': {
                'Authorization': localStorage.getItem('token')
            }
        }))
    }

    onerror(e) {
        console.log(`Websocket error: ${e}`)
        console.log(`Websocket: trying to reconnect in 5s`)

        setTimeout(this.lostConnection.bind(this), 5000)
    }

    onmessage(message) {
        let obj = JSON.parse(message.data)
        console.log(obj)

        switch (obj["type"]) {
            case "authorization_response":
                this.authorization_response(obj)
                break;
            case "setup_room":
                this.setup_room(obj)
                break;
            case "player_detail_update":
                this.player_detail_update(obj["data"]["data"])
                break;
            case "room_detail_update":
                this.room_detail_update(obj["data"])
                break;
            default:
                break;
        }
    }

    onclose() {
        console.log('WebSocket Client closed!')
        setTimeout(this.lostConnection.bind(this), 5000)
    }

    authorization_response(json) {
        if (json["data"]["accepted"]) {
            console.log("Authorization accepted")
            this.client.send(JSON.stringify({
                "type": "setup_room"
            }))
        } else {
            console.log("Authorization rejected")
        }
    }

    setup_room(json) {
        let _this = this
        json["data"]["details"].forEach(function (o, k) {
            console.log(o)
            _this.room_detail_update(o)
        })

        this.player_detail_update(json["data"]["player"]["details"]["data"])

        console.log(this.room.state)
    }

    player_detail_update(data){
        let player = this.room.state.player
        for (const [key, value] of Object.entries(data)) {
            for (const [key_data, value_data] of Object.entries(value)) {
                player[`${key.toLowerCase()}_${key_data}`] = value_data
            }
        }

        this.room.setState({
            player: player
        })
    }

    room_detail_update(data){
        let details = this.room.state.details

        let name = data.name.toLowerCase().replace(" ", "_")
        for (const [key, value] of Object.entries(data["data"])) {
            details[`id#${data.id}_${name}_${key.toLowerCase()}`] = value
        }

        this.room.setState({
            details: details
        })
    }

    changeInput(reference, value){
        let msg = {
            type: "update",
            data: {
                reference: reference,
                value: value
            }
        }
        console.log(msg)
        this.client.send(JSON.stringify(msg))
    }
}
