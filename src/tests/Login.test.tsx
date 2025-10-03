import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "../components";
import { vi } from "vitest";

const mockOnSubmit = vi.fn();

describe("Login Component", () => {
    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    it("should render name input field", () => {
        render(<Login onSubmit={mockOnSubmit} />);
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    it("should render password input field", () => {
        render(<Login onSubmit={mockOnSubmit} />);
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it("should render login button", () => {
        render(<Login onSubmit={mockOnSubmit} />);
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    it("should allow typing in name field", async () => {
        const user = userEvent.setup();
        render(<Login onSubmit={mockOnSubmit} />);
        const nameInput = screen.getByLabelText(/name/i);
        await user.type(nameInput, "testuser");
        expect(nameInput).toHaveValue("testuser");
    });

    it("should allow typing in password field", async () => {
        const user = userEvent.setup();
        render(<Login onSubmit={mockOnSubmit} />);
        const passwordInput = screen.getByLabelText(/password/i);
        await user.type(passwordInput, "testpass123");
        expect(passwordInput).toHaveValue("testpass123");
    });

    it("should call onSubmit with name when form is submitted", async () => {
        const user = userEvent.setup();
        const mockOnSubmit = vi.fn();
        render(<Login onSubmit={mockOnSubmit} />);
        await user.type(screen.getByLabelText(/name/i), "John");
        await user.type(screen.getByLabelText(/password/i), "password123");
        await user.click(screen.getByRole("button", { name: /login/i }));
        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith("John", "password123");
        });
    });

    it("should show name required error when submitting empty form", async () => {
        const user = userEvent.setup();
        render(<Login onSubmit={mockOnSubmit} />);
        await user.click(screen.getByRole("button", { name: /login/i }));
        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        });
    });

    it("should show password required error when submitting empty form", async () => {
        const user = userEvent.setup();
        render(<Login onSubmit={mockOnSubmit} />);
        await user.click(screen.getByRole("button", { name: /login/i }));
        await waitFor(() => {
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });

    it("should not call onSubmit when form has validation errors", async () => {
        const user = userEvent.setup();
        render(<Login onSubmit={mockOnSubmit} />);
        await user.click(screen.getByRole("button", { name: /login/i }));
        await waitFor(() => {
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });
    });

    it("should show validation error for short name", async () => {
        const user = userEvent.setup();
        render(<Login onSubmit={mockOnSubmit} />);
        await user.type(screen.getByLabelText(/name/i), "J");
        await user.click(screen.getByRole("button", { name: /login/i }));
        await waitFor(() => {
            expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
        });
    });

    it("should show validation error for short password", async () => {
        const user = userEvent.setup();
        render(<Login onSubmit={mockOnSubmit} />);
        await user.type(screen.getByLabelText(/password/i), "12");
        await user.click(screen.getByRole("button", { name: /login/i }));
        await waitFor(() => {
            expect(screen.getByText(/password must be at least 3 characters/i)).toBeInTheDocument();
        });
    });

    it("should match snapshot", () => {
        const { container } = render(<Login onSubmit={mockOnSubmit} />);
        expect(container.firstChild).toMatchSnapshot();
    });
});