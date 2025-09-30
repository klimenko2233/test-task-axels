import * as yup from "yup";

export const loginValidationSchema = yup.object({
    name: yup
        .string()
        .required("Name is required")
        .min(2, "Name must be at least 2 characters"),
    password: yup
        .string()
        .required("Password is required")
        .min(3, "Password must be at least 3 characters")
});