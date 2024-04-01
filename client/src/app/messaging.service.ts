import { io } from 'socket.io-client';

export class messagingService {
    private url = 'localhost:3080';
    private socket;

    constructor() {
        //this.socket = io(this.url);
    }
}