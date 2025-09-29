export interface Message {
    id: string;
    author: string;
    text: string;
    timestamp: string;
    room: string;
}

export interface ChatState {
    messages: { [room: string]: Message[] };
    isConnected: boolean;
    error: string | null;
}