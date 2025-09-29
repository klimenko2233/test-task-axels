export interface Room {
    id: string;
    name: string;
    users?: string[];
}

export interface RoomsState {
    rooms: Room[];
    currentRoom: string;
}