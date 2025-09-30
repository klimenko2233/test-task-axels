export interface UserCredo {
    name: string;
    password: string;
}

export type { User, AuthState } from "./auth";
export type { Message, ChatState } from "./chat";
export type { Room, RoomsState } from "./rooms";