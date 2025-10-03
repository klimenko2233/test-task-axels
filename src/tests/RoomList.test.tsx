import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { RoomList } from "../components";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MockRoom, MockRoomsState, MockStoreState } from "../test-utils/types.ts";
import { vi } from "vitest";

interface MockCreateRoomDialogProps {
    open: boolean;
    onClose: () => void;
    onCreate: (roomName: string) => void;
}

interface MockEditRoomDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (roomName: string) => void;
    roomName: string;
}

vi.mock("../components/dialogs/CreateRoomDialog", () => ({
    CreateRoomDialog: ({ open, onClose, onCreate }: MockCreateRoomDialogProps) =>
        open ? (
            <div data-testid="create-dialog">
                <input data-testid="create-input" placeholder="Room name"/>
                <button onClick={() => onCreate("New Test Room")}>Create</button>
                <button onClick={onClose}>Close Create</button>
            </div>
        ) : null
}));

vi.mock("../components/dialogs/EditRoomDialog", () => ({
    EditRoomDialog: ({ open, onClose, onSave, roomName }: MockEditRoomDialogProps) =>
        open ? (
            <div data-testid="edit-dialog">
                <input data-testid="edit-input" defaultValue={roomName}/>
                <button onClick={() => onSave("Updated Room")}>Save</button>
                <button onClick={onClose}>Close Edit</button>
            </div>
        ) : null
}));

const mockConfirm = vi.fn();
const mockAlert = vi.fn();
Object.defineProperty(window, "confirm", { value: mockConfirm });
Object.defineProperty(window, "alert", { value: mockAlert });

const mockRooms: MockRoom[] = [
    { id: "1", name: "General", users: ["Alice", "Bob"] },
    { id: "2", name: "Random", users: [] }
];

const createMockStore = (currentRoom = "General") => {
    const mockState: MockStoreState = {
        rooms: {
            rooms: mockRooms,
            currentRoom
        }
    };
    return configureStore({
        reducer: {
            rooms: (state: MockRoomsState = mockState.rooms) => state
        }
    });
};

const findMenuButton = (roomName: string) => {
    const menuButtons = screen.getAllByRole("button");
    return menuButtons.find(btn =>
        btn.querySelector("svg[data-testid=\"MoreVertIcon\"]") &&
        btn.closest("li")?.textContent?.includes(roomName)
    );
};

describe("RoomList Component", () => {
    const mockOnRoomChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockConfirm.mockReturnValue(true);
    });

    describe("Initial rendering", () => {
        beforeEach(() => {
            render(
                <Provider store={createMockStore()}>
                    <RoomList currentRoom="General" onRoomChange={mockOnRoomChange}/>
                </Provider>
            );
        });

        it("should render rooms title", () => {
            expect(screen.getByText("Rooms")).toBeInTheDocument();
        });

        it("should render General room", () => {
            expect(screen.getByText("General")).toBeInTheDocument();
        });

        it("should render Random room", () => {
            expect(screen.getByText("Random")).toBeInTheDocument();
        });

        it("should display 2 users for General room", () => {
            expect(screen.getByText("2 users")).toBeInTheDocument();
        });

        it("should display 0 users for Random room", () => {
            expect(screen.getByText("0 users")).toBeInTheDocument();
        });
    });

    describe("Room selection", () => {
        it("should highlight current room with Mui-selected class", () => {
            render(
                <Provider store={createMockStore("Random")}>
                    <RoomList currentRoom="Random" onRoomChange={mockOnRoomChange}/>
                </Provider>
            );
            const randomRoomButtons = screen.getAllByRole("button");
            const randomRoomButton = randomRoomButtons.find(button =>
                button.textContent?.includes("Random")
            );
            expect(randomRoomButton).toHaveClass("Mui-selected");
        });

        it("should call onRoomChange when room is clicked", async () => {
            const user = userEvent.setup();
            render(
                <Provider store={createMockStore()}>
                    <RoomList currentRoom="General" onRoomChange={mockOnRoomChange}/>
                </Provider>
            );
            await user.click(screen.getByText("Random"));
            expect(mockOnRoomChange).toHaveBeenCalledWith("Random");
        });
    });

    describe("Create room functionality", () => {
        it("should open create room dialog when create button is clicked", async () => {
            const user = userEvent.setup();
            render(
                <Provider store={createMockStore()}>
                    <RoomList currentRoom="General" onRoomChange={mockOnRoomChange}/>
                </Provider>
            );
            await user.click(screen.getByText("+ New Room"));
            expect(screen.getByTestId("create-dialog")).toBeInTheDocument();
        });
    });

    describe("Room menu functionality", () => {
        beforeEach(() => {
            render(
                <Provider store={createMockStore()}>
                    <RoomList currentRoom="General" onRoomChange={mockOnRoomChange} />
                </Provider>
            );
        });

        it("should open menu when three dots icon is clicked", async () => {
            const user = userEvent.setup();
            const menuButton = findMenuButton("General");
            await user.click(menuButton!);
            expect(screen.getByRole("menu")).toBeInTheDocument();
        });

        it("should display Edit option in room menu", async () => {
            const user = userEvent.setup();
            await user.click(findMenuButton("General")!);
            expect(screen.getByText("Edit")).toBeInTheDocument();
        });

        it("should display Delete option in room menu", async () => {
            const user = userEvent.setup();
            await user.click(findMenuButton("General")!);
            expect(screen.getByText("Delete")).toBeInTheDocument();
        });

        it("should disable Delete menu item for General room", async () => {
            const user = userEvent.setup();
            await user.click(findMenuButton("General")!);
            expect(screen.getByRole("menuitem", { name: /delete/i })).toHaveClass("Mui-disabled");
        });

        it("should call window.confirm when deleting non-General room", async () => {
            const user = userEvent.setup();
            mockConfirm.mockReturnValue(true);
            await user.click(findMenuButton("Random")!);
            await user.click(screen.getByText("Delete"));
            expect(mockConfirm).toHaveBeenCalled();
        });

        it("should call window.confirm with correct message when deleting room", async () => {
            const user = userEvent.setup();
            mockConfirm.mockReturnValue(true);
            await user.click(findMenuButton("Random")!);
            await user.click(screen.getByText("Delete"));
            expect(mockConfirm).toHaveBeenCalledWith("Delete room \"Random\"? This action cannot be undone.");
        });
    });

    it("should match snapshot", () => {
        const { container } = render(
            <Provider store={createMockStore()}>
                <RoomList currentRoom="General" onRoomChange={mockOnRoomChange}/>
            </Provider>
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});