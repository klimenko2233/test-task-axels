import { render, screen, waitFor } from "@testing-library/react";
import { CreateRoomDialog } from "./CreateRoomDialog.tsx";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

describe("CreateRoomDialog", () => {
    const mockOnClose = vi.fn();
    const mockOnCreate = vi.fn();
    const mockExistingRooms = ["General", "Random"];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render dialog when open", () => {
        render(
            <CreateRoomDialog
                open={true}
                onClose={mockOnClose}
                onCreate={mockOnCreate}
                existingRooms={mockExistingRooms}
            />
        );
        expect(screen.getByText("Create New Room")).toBeInTheDocument();
        expect(screen.getByLabelText("Room Name")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
    });

    it("should not render dialog when closed", () => {
        render(
            <CreateRoomDialog
                open={false}
                onClose={mockOnClose}
                onCreate={mockOnCreate}
                existingRooms={mockExistingRooms}
            />
        );
        expect(screen.queryByText("Create New Room")).not.toBeInTheDocument();
    });

    it("should call onCreate with room name when create button is clicked", async () => {
        const user = userEvent.setup();
        render(
            <CreateRoomDialog
                open={true}
                onClose={mockOnClose}
                onCreate={mockOnCreate}
                existingRooms={mockExistingRooms}
            />
        );
        await user.type(screen.getByLabelText("Room Name"), "NewRoom");
        await user.click(screen.getByRole("button", { name: "Create" }));
        await waitFor(() => {
            expect(mockOnCreate).toHaveBeenCalledWith("NewRoom");
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it("should call onClose when cancel button is clicked", async () => {
        const user = userEvent.setup();
        render(
            <CreateRoomDialog
                open={true}
                onClose={mockOnClose}
                onCreate={mockOnCreate}
                existingRooms={mockExistingRooms}
            />
        );
        await user.click(screen.getByRole("button", { name: "Cancel" }));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it("should disable create button for duplicate room name", async () => {
        const user = userEvent.setup();
        render(
            <CreateRoomDialog
                open={true}
                onClose={mockOnClose}
                onCreate={mockOnCreate}
                existingRooms={mockExistingRooms}
            />
        );
        await user.type(screen.getByLabelText("Room Name"), "General");
        const createButton = screen.getByRole("button", { name: "Create" });
        expect(createButton).toBeDisabled();
    });

    it("should disable create button for short room name", async () => {
        const user = userEvent.setup();
        render(
            <CreateRoomDialog
                open={true}
                onClose={mockOnClose}
                onCreate={mockOnCreate}
                existingRooms={mockExistingRooms}
            />
        );
        await user.type(screen.getByLabelText("Room Name"),"A");
        const createButton = screen.getByRole("button", { name: "Create" });
        expect(createButton).toBeDisabled();
    });

    it("should disable create button for long room name", async () => {
        const user = userEvent.setup();
        render(
            <CreateRoomDialog
                open={true}
                onClose={mockOnClose}
                onCreate={mockOnCreate}
                existingRooms={mockExistingRooms}
            />
        );
        await user.type(screen.getByLabelText("Room Name"),"ThisIsAVeryLongRoomNameThatExceedsTheMaximumLength");
        const createButton = screen.getByRole("button", { name: "Create" });
        expect(createButton).toBeDisabled();
    });

    it("should disable create button when form is invalid", async () => {
        const user = userEvent.setup();
        render(
            <CreateRoomDialog
                open={true}
                onClose={mockOnClose}
                onCreate={mockOnCreate}
                existingRooms={mockExistingRooms}
            />
        );
        const createButton = screen.getByRole("button", { name: "Create" });
        expect(createButton).toBeDisabled();
        await user.type(screen.getByLabelText("Room Name"), "Valid Room");
        expect(createButton).not.toBeDisabled();
    });

    it("should trim room name when submitted", async () => {
        const user = userEvent.setup();
        render(
            <CreateRoomDialog
                open={true}
                onClose={mockOnClose}
                onCreate={mockOnCreate}
                existingRooms={mockExistingRooms}
            />
        );
        await user.type(screen.getByLabelText("Room Name"), "  New Room  ");
        await user.click(screen.getByRole("button", { name: "Create" }));
        await waitFor(() => {
            expect(mockOnCreate).toHaveBeenCalledWith("New Room");
        });
    });

    it("should match snapshot when open", () => {
        const { container } = render(
            <CreateRoomDialog
                open={true}
                onClose={mockOnClose}
                onCreate={mockOnCreate}
                existingRooms={mockExistingRooms}
            />
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});