import {List,ListItem,ListItemButton,ListItemText,Typography,Button,Box,IconButton,Divider} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const RoomList = () => {
    return (
        <Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography variant="subtitle1" fontWeight="bold">
                    Rooms List
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    sx={{ textTransform: "none" }}
                >
                    Create Room
                </Button>
            </Box>
            <Divider />
            <List sx={{ p: 0 }}>
                {["General", "Frontend", "Backend", "Random"].map((room) => (
                    <ListItem
                        key={room}
                        secondaryAction={
                            <Box display="flex" gap={1}>
                                <IconButton size="small" edge="end" aria-label="edit">
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" edge="end" aria-label="delete">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        }
                        disablePadding
                    >
                        <ListItemButton sx={{ borderRadius: 1 }}>
                            <ListItemText primary={room} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

