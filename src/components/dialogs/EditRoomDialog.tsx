import { useFormik } from "formik";
import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { editRoomValidationSchema } from "../../schemas/roomValidation";

interface EditRoomDialogProps {
    open: boolean;
    roomName: string;
    onClose: () => void;
    onSave: (newName: string) => void;
    existingRooms: string[];
}

export const EditRoomDialog = (
    { open, roomName, onClose, onSave, existingRooms }: EditRoomDialogProps) => {

    const formik = useFormik({
        initialValues: {
            roomName: roomName,
            originalName: roomName,
        },
        validationSchema: editRoomValidationSchema(existingRooms, roomName),
        onSubmit: (values) => {
            onSave(values.roomName.trim());
            onClose();
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        if (open) {
            formik.setValues({
                roomName: roomName,
                originalName: roomName,
            });
            formik.setTouched({});
            formik.setErrors({});
        }
    }, [open, roomName]);

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>Edit Room</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        variant="outlined"
                        id="roomName"
                        name="roomName"
                        label="Room Name"
                        value={formik.values.roomName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.roomName && Boolean(formik.errors.roomName)}
                        helperText={formik.touched.roomName && formik.errors.roomName}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="button" onClick={handleClose}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!formik.isValid || !formik.dirty}
                    >
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};