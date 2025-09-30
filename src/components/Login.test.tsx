import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "./Login";

const mockOnSubmit = jest.fn();

describe("Login Component", () => {
    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    it("should render login form with all elements", () => {
        render(<Login onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    it("should match snapshot", () => {
        const { container } = render(<Login onSubmit={mockOnSubmit} />);
        expect(container.firstChild).toMatchSnapshot();
    });

    it("should allow typing in name and password fields", async () => {
        const user = userEvent.setup();
        render(<Login onSubmit={mockOnSubmit} />);

        const nameInput = screen.getByLabelText(/name/i);
        const passwordInput = screen.getByLabelText(/password/i);

        await user.type(nameInput, "testuser");
        await user.type(passwordInput, "testpass123");

        expect(nameInput).toHaveValue("testuser");
        expect(passwordInput).toHaveValue("testpass123");
    });

    it("should call onSubmit when form is submitted with valid data", async () => {
        const user = userEvent.setup();
        const mockOnSubmit = jest.fn();
        render(<Login onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText(/name/i), "John");
        await user.type(screen.getByLabelText(/password/i), "password123");

        await user.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith("John", "password123");
        });
    });

    it("should show validation errors when submitting empty form", async () => {
        const user = userEvent.setup();
        render(<Login onSubmit={mockOnSubmit} />);

        await user.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
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
});