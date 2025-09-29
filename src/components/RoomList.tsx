import React, { useState } from "react";
import {
    List, ListItem, ListItemButton, ListItemText, Typography,
    Button, Box, IconButton, Divider, Menu, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAppDispatch, useAppSelector } from "../hooks/redux.ts";
import { roomsActions, roomsSelectors } from "../store/ducks/rooms.duck.ts";
import { CreateRoomDialog } from "./dialogs/CreateRoomDialog.tsx";
import { EditRoomDialog } from "./dialogs/EditRoomDialog.tsx";

interface RoomListProps {
    currentRoom: string;
    onRoomChange: (room: string) => void;
}

export const RoomList = ({ currentRoom, onRoomChange }: RoomListProps) => {
    const dispatch = useAppDispatch();

    const rooms = useAppSelector(roomsSelectors.rooms);
    const roomNames = rooms.map(room => room.name);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, roomName: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedRoom(roomName);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCreateRoom = (roomName: string) => {
        dispatch(roomsActions.createRoom(roomName));
    };

    const handleEditRoom = () => {
        if (selectedRoom) {
            setEditDialogOpen(true);
            setAnchorEl(null);
        }
    };

    const handleSaveEdit = (newName: string) => {
        if (selectedRoom) {
            dispatch(roomsActions.editRoom(selectedRoom, newName));
            setEditDialogOpen(false);
            setSelectedRoom(null);
        }
    };

    const handleDeleteRoom = () => {
        if (selectedRoom && selectedRoom !== "General") {
            if (window.confirm(`Delete room "${selectedRoom}"? This action cannot be undone.`)) {
                dispatch(roomsActions.deleteRoom(selectedRoom));
            }
            setAnchorEl(null);
            setSelectedRoom(null);
        } else if (selectedRoom === "General") {
            alert("Cannot delete General room!");
            setAnchorEl(null);
            setSelectedRoom(null);
        }
    };
    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setSelectedRoom(null);
    };

    return (
        <Box>
            <CreateRoomDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onCreate={handleCreateRoom}
                existingRooms={roomNames}
            />

            <EditRoomDialog
                open={editDialogOpen}
                roomName={selectedRoom || ""}
                onClose={handleCloseEditDialog}
                onSave={handleSaveEdit}
                existingRooms={roomNames}
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEditRoom}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }}/> Edit
                </MenuItem>
                <MenuItem
                    onClick={handleDeleteRoom}
                    disabled={selectedRoom === "General"}
                    sx={{ color: selectedRoom !== "General" ? "error.main" : "text.disabled" }}
                >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }}/> Delete
                </MenuItem>
            </Menu>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">Rooms</Typography>
                <Button
                    variant="contained"
                    size="small"
                    sx={{ textTransform: "none" }}
                    onClick={() => setCreateDialogOpen(true)}
                >
                    + New Room
                </Button>
            </Box>

            <Divider/>

            <List sx={{ p: 0 }}>
                {rooms.map((room) => (
                    <ListItem
                        key={room.id}
                        disablePadding
                        secondaryAction={
                            <IconButton
                                size="small"
                                edge="end"
                                onClick={(event) => handleMenuOpen(event, room.name)}
                            >
                                <MoreVertIcon fontSize="small"/>
                            </IconButton>
                        }
                    >
                        <ListItemButton
                            selected={currentRoom === room.name}
                            onClick={() => onRoomChange(room.name)}
                            sx={{ borderRadius: 1 }}
                        >
                            <ListItemText
                                primary={room.name}
                                secondary={`${room.users?.length || 0} users`}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};