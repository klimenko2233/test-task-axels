import * as yup from "yup";

export const roomValidationSchema = (existingRooms: string[]) =>
    yup.object({
        roomName: yup
            .string()
            .required("Room name is required")
            .min(2, "Room name must be at least 2 characters")
            .max(20, "Room name must be at most 20 characters")
            .test(
                "unique-name",
                "Room name already exists",
                (value) => !existingRooms.includes(value?.trim() || "")
            )
    });

export const editRoomValidationSchema = (existingRooms: string[], originalName: string) =>
    yup.object({
        roomName: yup
            .string()
            .required("Room name is required")
            .min(2, "Room name must be at least 2 characters")
            .max(20, "Room name must be at most 20 characters")
            .test(
                "unique-name",
                "Room name already exists",
                function (value) {
                    if (value === originalName) return true;
                    return !existingRooms.includes(value?.trim() || "");
                }
            )
    });