import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { EditRoomDialog } from "../components/dialogs/EditRoomDialog.tsx";
import userEvent from "@testing-library/user-event";

describe("EditRoomDialog", () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();
    const mockExistingRooms = ["General", "Random", "Private"];
    const roomName = "Random";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Dialog visibility", () => {
        it("should display dialog title when open", () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            expect(screen.getByText("Edit Room")).toBeInTheDocument();
        });

        it("should display room name input when open", () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            expect(screen.getByLabelText("Room Name")).toBeInTheDocument();
        });

        it("should display cancel button when open", () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        });

        it("should display save button when open", () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
        });

        it("should not render dialog when closed", () => {
            render(
                <EditRoomDialog
                    open={false}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            expect(screen.queryByText("Edit Room")).not.toBeInTheDocument();
        });
    });

    describe("Form validation", () => {
        it("should disable save button when dialog opens with unchanged room name", () => {
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            const saveButton = screen.getByRole("button", { name: "Save" });
            expect(saveButton).toBeDisabled();
        });

        it("should disable save button for duplicate room name", async () => {
            const user = userEvent.setup();
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            const roomNameInput = screen.getByLabelText("Room Name");
            await user.clear(roomNameInput);
            await user.type(roomNameInput, "General");
            const saveButton = screen.getByRole("button", { name: "Save" });
            await waitFor(() => {
                expect(saveButton).toBeDisabled();
            });
        });

        it("should disable save button for short room name", async () => {
            const user = userEvent.setup();
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            const roomNameInput = screen.getByLabelText("Room Name");
            await user.clear(roomNameInput);
            await user.type(roomNameInput, "A");
            const saveButton = screen.getByRole("button", { name: "Save" });
            await waitFor(() => {
                expect(saveButton).toBeDisabled();
            });
        });

        it("should enable save button when valid room name is entered", async () => {
            const user = userEvent.setup();
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            const saveButton = screen.getByRole("button", { name: "Save" });
            const roomNameInput = screen.getByLabelText("Room Name");
            await user.clear(roomNameInput);
            await user.type(roomNameInput, "Valid Room");
            await waitFor(() => {
                expect(saveButton).not.toBeDisabled();
            });
        });
    });
    describe("Save functionality", () => {
        it("should call onSave with new room name when form is submitted", async () => {
            const user = userEvent.setup();
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            const roomNameInput = screen.getByLabelText("Room Name");
            await user.clear(roomNameInput);
            await user.type(roomNameInput, "New Room");
            await user.click(screen.getByRole("button", { name: "Save" }));
            await waitFor(() => {
                expect(mockOnSave).toHaveBeenCalledWith("New Room");
            });
        });

        it("should call onClose after successful room save", async () => {
            const user = userEvent.setup();
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            const roomNameInput = screen.getByLabelText("Room Name");
            await user.clear(roomNameInput);
            await user.type(roomNameInput, "New Room");
            await user.click(screen.getByRole("button", { name: "Save" }));
            await waitFor(() => {
                expect(mockOnClose).toHaveBeenCalled();
            });
        });

        it("should trim room name when submitted", async () => {
            const user = userEvent.setup();
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            const roomNameInput = screen.getByLabelText("Room Name");
            await user.clear(roomNameInput);
            await user.type(roomNameInput, "  New Room  ");
            await user.click(screen.getByRole("button", { name: "Save" }));
            await waitFor(() => {
                expect(mockOnSave).toHaveBeenCalledWith("New Room");
            });
        });
    });

    describe("Cancel functionality", () => {
        it("should call onClose when cancel button is clicked", async () => {
            const user = userEvent.setup();
            render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            await user.click(screen.getByRole("button", { name: "Cancel" }));
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    describe("Snapshot", () => {
        it("should match snapshot when open", () => {
            const { container } = render(
                <EditRoomDialog
                    open={true}
                    roomName={roomName}
                    onClose={mockOnClose}
                    onSave={mockOnSave}
                    existingRooms={mockExistingRooms}
                />
            );
            expect(container.firstChild).toMatchSnapshot();
        });
    });
});