export default class RoomManagerException extends Error {
    constructor(message) {
        super(message)
        this.name = "RoomManagerException"
    }
}