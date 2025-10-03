import { describe } from "vitest";
import { roomsActions, roomsReducer } from "../store/ducks/rooms.duck.ts";

describe("Rooms Reducer - Unit Tests",()=>{
    const initialState = {
        rooms: [
            { id: "1", name: "General", users: ["Alice", "Bob"] },
            { id: "2", name: "FirstRoom", users: ["Bob"] },
            { id: "3", name: "AnotherRoom", users: ["John"] },
            { id: "4", name: "Random", users: [] }
        ],
        currentRoom: "General"
    };

    describe("Initial state and unknown action",()=>{
        it("should return initial state for unknown action",()=>{
            const action = { type: "UNKNOWN_ACTION" };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const state = roomsReducer(initialState,action as any);
            expect(state).toEqual(initialState);
        });
    });

    describe("CREATE_ROOM action",()=>{
        it("should increase room count when creating a new room",()=>{
            const action = roomsActions.createRoom("NewRoom");
            const state = roomsReducer(initialState,action);
            expect(state.rooms.length).toBe(5);
        });

        it("should create new room with empty users array",()=>{
            const action = roomsActions.createRoom("NewRoom");
            const state = roomsReducer(initialState,action);
            const newRoom = state.rooms[4];
            expect(newRoom.users).toEqual([]);
        });

        it("should create new room with string id",()=>{
            const action = roomsActions.createRoom("NewRoom");
            const state = roomsReducer(initialState,action);
            const newRoom = state.rooms[4];
            expect(typeof newRoom.id).toBe("string");
        });

        it("should switch to new created room",()=>{
            const action = roomsActions.createRoom("NewRoom");
            const state = roomsReducer(initialState,action);
            expect(state.currentRoom).toBe("NewRoom");
        });
    });

    describe("ROOM_SELECT action",()=>{
        it("should change current room when selecting a room",()=>{
            const action = roomsActions.selectRoom("Random");
            const state = roomsReducer(initialState,action);
            expect(state.currentRoom).toBe("Random");
        });

        it("should not modify rooms array when selecting a room",()=>{
            const action = roomsActions.selectRoom("Random");
            const state = roomsReducer(initialState,action);
            expect(state.rooms).toEqual(initialState.rooms);
        });
    });

    describe("ROOM_EDIT action",()=>{
        it("should update room name when editing a room",()=>{
            const action = roomsActions.editRoom("General","General2");
            const state = roomsReducer(initialState,action);
            const updatedRoom = state.rooms.find(room => room.name === "General2");
            expect(updatedRoom).toBeDefined();
        });

        it("should save room id when editing a room name",()=>{
            const action = roomsActions.editRoom("General","General2");
            const state = roomsReducer(initialState,action);
            const updatedRoom = state.rooms.find(room => room.name === "General2");
            expect(updatedRoom?.id).toBe("1");
        });

        it("should save room users when editing a room name",()=>{
            const action = roomsActions.editRoom("General","General2");
            const state = roomsReducer(initialState,action);
            const updatedRoom = state.rooms.find(room => room.name === "General2");
            expect(updatedRoom?.users).toEqual(["Alice","Bob"]);
        });

        it("should remove old room name when editing room",()=>{
            const action = roomsActions.editRoom("General","General2");
            const state = roomsReducer(initialState,action);
            const updatedRoom = state.rooms.find(room => room.name === "General2");
            expect(updatedRoom?.name).not.toBe("General");
        });

        it("should maintain rooms count when editing room",()=>{
            const action = roomsActions.editRoom("General","General2");
            const state = roomsReducer(initialState,action);
            expect(state.rooms.length).toBe(4);
        });

        it("should update current room when editing room",()=>{
            let state = roomsReducer(initialState,roomsActions.selectRoom("FirstRoom"));
            state = roomsReducer(state,roomsActions.editRoom("FirstRoom","FirstRoom2"));
            expect(state.currentRoom).toBe("FirstRoom2");
        });
    });

    describe("ROOM_DELETE action",()=>{
        it("should remove deleted room from rooms array",()=>{
            const action = roomsActions.deleteRoom("AnotherRoom");
            const state = roomsReducer(initialState,action);
            const deletedRoom = state.rooms.find(room => room.name === "AnotherRoom");
            expect(deletedRoom).toBeUndefined();
        });

        it("should switch to General room when deleting current room",()=>{
            let state = roomsReducer(initialState,roomsActions.selectRoom("FirstRoom"));
            state = roomsReducer(state,roomsActions.deleteRoom("FirstRoom"));
            expect(state.currentRoom).toBe("General");
        });

        it("should keep currentRoom when deleting non-current room",()=>{
            const action = roomsActions.deleteRoom("Random");
            const state = roomsReducer(initialState,action);
            expect(state.currentRoom).toBe("General");
        });

        it("should not allow deleting General room",()=>{
            const action = roomsActions.deleteRoom("General");
            const state = roomsReducer(initialState,action);
            expect(state).toEqual(initialState);
        });
    });
});