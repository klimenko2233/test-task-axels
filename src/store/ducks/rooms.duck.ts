export interface Room {
    id: string;
    name: string;
    users?: string[];
}

export interface RoomsState {
    rooms: Room[];
    currentRoom: string;
}

const ROOM_CREATE = "rooms/CREATE_ROOM";
const ROOM_SELECT = "rooms/SELECT_ROOM";
const ROOM_EDIT = "rooms/EDIT_ROOM";
const ROOM_DELETE = "rooms/DELETE_ROOM";

const initialState: RoomsState = {
    rooms: [
        { id: "1", name: "General", users: ["Alice", "Bob"] },
        { id: "2", name: "FirstRoom", users: ["Bob"] },
        { id: "3", name: "AnotherRoom", users: ["Eve"] },
        { id: "4", name: "Random", users: [] }
    ],
    currentRoom: "General"
};

export const roomsActions = {
    createRoom: (roomName: string) => ({
        type: ROOM_CREATE as typeof ROOM_CREATE,
        payload: roomName
    }),

    selectRoom: (roomName: string) => ({
        type: ROOM_SELECT as typeof ROOM_SELECT,
        payload: roomName
    }),
    editRoom: (oldName: string, newName: string) => ({
        type: ROOM_EDIT as typeof ROOM_EDIT,
        payload: { oldName, newName }
    }),
    deleteRoom: (roomName: string) => ({
        type: ROOM_DELETE as typeof ROOM_DELETE,
        payload: roomName
    })
};

type RoomsAction =
    | ReturnType<typeof roomsActions.createRoom>
    | ReturnType<typeof roomsActions.selectRoom>
    | ReturnType<typeof roomsActions.editRoom>
    | ReturnType<typeof roomsActions.deleteRoom>;

export function roomsReducer(state = initialState, action: RoomsAction): RoomsState {
    switch (action.type) {
        case ROOM_CREATE: {
            const newRoom: Room = {
                id: Date.now().toString(),
                name: action.payload,
                users: []
            };
            return {
                ...state,
                rooms: [...state.rooms, newRoom],
                currentRoom: newRoom.name
            };
        }

        case ROOM_SELECT:
            return {
                ...state,
                currentRoom: action.payload
            };

        case ROOM_EDIT: {
            const { oldName, newName } = (action as ReturnType<typeof roomsActions.editRoom>).payload;
            return {
                ...state,
                rooms: state.rooms.map(room =>
                    room.name === oldName ? { ...room, name: newName } : room
                ),
                currentRoom: state.currentRoom === oldName ? newName : state.currentRoom
            };
        }

        case ROOM_DELETE: {
            const roomName = (action as ReturnType<typeof roomsActions.deleteRoom>).payload;
            if (roomName === "General") return state;
            const filteredRooms = state.rooms.filter(room => room.name !== roomName);
            return {
                ...state,
                rooms: filteredRooms,
                currentRoom: state.currentRoom === roomName ? "General" : state.currentRoom
            };
        }
        default:
            return state;
    }
}

export const roomsSelectors = {
    rooms: (state: { rooms: RoomsState }) => state.rooms.rooms,
    currentRoom: (state: { rooms: RoomsState }) => state.rooms.currentRoom
};