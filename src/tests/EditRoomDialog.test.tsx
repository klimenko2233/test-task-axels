import { render, screen, waitFor, act } from "@testing-library/react";
import { EditRoomDialog } from "../components/dialogs/EditRoomDialog.tsx";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

describe("EditRoomDialog", () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();
    const mockExistingRooms = ["General", "Random", "Private"];
    const roomName = "Random";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render dialog when open", async () => {
        await act(async () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
        });

        expect(screen.getByText("Edit Room")).toBeInTheDocument();
        expect(screen.getByLabelText("Room Name")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("should not render dialog when closed", async () => {
        await act(async () => {
            render(
                <EditRoomDialog
                    open={false}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
        });

        expect(screen.queryByText("Edit Room")).not.toBeInTheDocument();
    });

    it("should disable save button when room name is not changed", async () => {
        await act(async () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
        });

        const saveButton = screen.getByRole("button", { name: "Save" });
        expect(saveButton).toBeDisabled();
    });

    it("should enable save button when room name is changed to valid name", async () => {
        const user = userEvent.setup();

        await act(async () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
        });

        const saveButton = screen.getByRole("button", { name: "Save" });
        const roomNameInput = screen.getByLabelText("Room Name");

        await act(async () => {
            await user.clear(roomNameInput);
            await user.type(roomNameInput, "Updated Room");
        });

        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });
    });

    it("should call onSave with new room name when form is submitted", async () => {
        const user = userEvent.setup();

        await act(async () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
        });

        const roomNameInput = screen.getByLabelText("Room Name");
        await act(async () => {
            await user.clear(roomNameInput);
            await user.type(roomNameInput, "Updated Room");
        });

        const saveButton = screen.getByRole("button", { name: "Save" });
        await act(async () => {
            await user.click(saveButton);
        });

        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledWith("Updated Room");
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it("should not allow saving with same room name", async () => {
        await act(async () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
        });

        const saveButton = screen.getByRole("button", { name: "Save" });
        expect(saveButton).toBeDisabled();
    });

    it("should disable create button for duplicate room name", async () => {
        const user = userEvent.setup();

        await act(async () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
        });

        const roomNameInput = screen.getByLabelText("Room Name");
        await act(async () => {
            await user.clear(roomNameInput);
            await user.type(roomNameInput, "General");
        });

        const saveButton = screen.getByRole("button", { name: "Save" });
        await waitFor(() => {
            expect(saveButton).toBeDisabled();
        });
    });

    it("should disable create button for short room name", async () => {
        const user = userEvent.setup();

        await act(async () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
        });

        const roomNameInput = screen.getByLabelText("Room Name");
        await act(async () => {
            await user.clear(roomNameInput);
            await user.type(roomNameInput, "A");
        });

        const saveButton = screen.getByRole("button", { name: "Save" });
        await waitFor(() => {
            expect(saveButton).toBeDisabled();
        });
    });

    it("should enable save button when form becomes valid", async () => {
        const user = userEvent.setup();

        await act(async () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
        });

        const saveButton = screen.getByRole("button", { name: "Save" });
        const roomNameInput = screen.getByLabelText("Room Name");

        expect(saveButton).toBeDisabled();

        await act(async () => {
            await user.clear(roomNameInput);
            await user.type(roomNameInput, "A");
        });

        await waitFor(() => {
            expect(saveButton).toBeDisabled();
        });

        await act(async () => {
            await user.clear(roomNameInput);
            await user.type(roomNameInput, "Valid Name");
        });

        await waitFor(() => {
            expect(saveButton).not.toBeDisabled();
        });
    });

    it("should trim room name when submitted", async () => {
        const user = userEvent.setup();

        await act(async () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
        });

        const roomNameInput = screen.getByLabelText("Room Name");
        await act(async () => {
            await user.clear(roomNameInput);
            await user.type(roomNameInput, "  New Room  ");
        });

        const saveButton = screen.getByRole("button", { name: "Save" });
        await act(async () => {
            await user.click(saveButton);
        });

        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledWith("New Room");
        });
    });

    it("should call onClose when cancel button is clicked", async () => {
        const user = userEvent.setup();

        await act(async () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
        });

        await act(async () => {
            await user.click(screen.getByRole("button", { name: "Cancel" }));
        });

        expect(mockOnClose).toHaveBeenCalled();
    });

    it("should match snapshot when open", async () => {
        let container: any;

        await act(async () => {
            const result = render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            container = result;
        });

        expect(container.firstChild).toMatchSnapshot();
    });
});