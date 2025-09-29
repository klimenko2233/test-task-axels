import { useFormik } from "formik";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { roomValidationSchema } from "../../schemas/roomValidation";

interface CreateRoomDialogProps {
    open: boolean;
    onClose: () => void;
    onCreate: (roomName: string) => void;
    existingRooms: string[];
}

export const CreateRoomDialog = (
    { open, onClose, onCreate, existingRooms }: CreateRoomDialogProps) => {

    const formik = useFormik({
        initialValues: {
            roomName: "",
        },
        validationSchema: roomValidationSchema(existingRooms),
        onSubmit: (values) => {
            onCreate(values.roomName.trim());
            formik.resetForm();
            onClose();
        },
    });

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>Create New Room</DialogTitle>
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
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};