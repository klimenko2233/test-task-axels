export interface MockRoom {
    id:string;
    name:string;
    users?:string[];
}
export interface MockRoomsState {
    rooms: MockRoom[];
    currentRoom: string;
}
export interface MockStoreState {
    rooms: MockRoomsState;
}