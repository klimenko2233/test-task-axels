import { roomsActions, roomsReducer } from "../rooms.duck.ts";
import { expect } from "vitest";

describe("Rooms Reducer - Unit Tests", () => {
    const initialState = {
        rooms: [
            { id: "1", name: "General", users: ["Alice", "Bob"] },
            { id: "2", name: "FirstRoom", users: ["Bob"] },
            { id: "3", name: "AnotherRoom", users: ["Eve"] },
            { id: "4", name: "Random", users: [] }
        ],
        currentRoom: "General"
    };

    it("should handle ROOM_CREATE - create new room and switch to it", () => {
        const action = roomsActions.createRoom("NewRoom");
        const state = roomsReducer(initialState, action);
        expect(state.rooms).toHaveLength(5);
        const newRoom = state.rooms[4];
        expect(newRoom.users).toEqual([]);
        expect(typeof newRoom.id).toBe("string");
        expect(state.currentRoom).toBe("NewRoom");
    });

    it("should handle ROOM_SELECT - change current room", () => {
        const action = roomsActions.selectRoom("Random");
        const state = roomsReducer(initialState, action);
        expect(state.currentRoom).toBe("Random");
        expect(state.rooms).toEqual(initialState.rooms);
    });

    it("should handle ROOM_EDIT - edit room name", () => {
        const action = roomsActions.editRoom("General", "General2");
        const state = roomsReducer(initialState, action);
        const updatedRoom = state.rooms.find(room => room.name === "General2");
        expect(updatedRoom).toBeDefined();
        expect(updatedRoom?.id).toBe("1");
        expect(updatedRoom?.users).toEqual(["Alice", "Bob"]);
        expect(state.rooms.find(room=>room.name=="General")).toBeUndefined();
        expect(state.rooms).toHaveLength(4);
    });

    it("should handle ROOM_EDIT - when editing current room, update currentRoom too", () => {
        let state = roomsReducer(initialState, roomsActions.selectRoom("FirstRoom"));
        expect(state.currentRoom).toBe("FirstRoom");
        state = roomsReducer(state,roomsActions.editRoom("FirstRoom","FirstRoom2"));
        expect(state.currentRoom).toBe("FirstRoom2");
    });

    it("should handle ROOM_DELETE - delete room and switch to General if deleted was current", () => {
        let state = roomsReducer(initialState,roomsActions.selectRoom("FirstRoom"));
        expect(state.currentRoom).toBe("FirstRoom");
        state = roomsReducer(state,roomsActions.deleteRoom("FirstRoom"));
        expect(state.rooms).toHaveLength(3);
        expect(state.rooms.find(room=>room.name==="FirstRoom")).toBeUndefined();
        expect(state.currentRoom).toBe("General");
    });

    it("should handle ROOM_DELETE - delete room but keep currentRoom if different", () => {
        const action = roomsActions.deleteRoom("AnotherRoom");
        const state = roomsReducer(initialState, action);
        expect(state.rooms).toHaveLength(3);
        expect(state.rooms.find(room=>room.name === "AnotherRoom")).toBeUndefined();
        expect(state.currentRoom).toBe("General");
    });

    it("should NOT allow deleting General room", () => {
        const action = roomsActions.deleteRoom("General");
        const state = roomsReducer(initialState,action);
        expect(state).toEqual(initialState);
    });

    it("should return initial state for unknown action", () => {
        const action = { type: "UNKNOWN_ACTION" } as any;
        const state = roomsReducer(initialState,action);
        expect(state).toEqual(initialState);
    });
});