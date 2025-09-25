import React, { useState } from "react";
import { List, ListItem, ListItemButton, ListItemText, Typography, Button, Box, IconButton, Divider, useMediaQuery, Menu, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material/styles";

interface RoomListProps {
    currentRoom: string;
    onRoomChange: (room: string) => void;
}

export const RoomList = ({ currentRoom, onRoomChange }: RoomListProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const rooms = ["General", "FirstRoom", "AnotherRoom", "Random"];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">Rooms List</Typography>
                <Button variant="contained" size="small" sx={{ textTransform: "none" }}>Create Room</Button>
            </Box>
            <Divider/>
            <List sx={{ p: 0 }}>
                {rooms.map((room) => (
                    <ListItem key={room} disablePadding
                              secondaryAction={isMobile ? (
                                  <Box>
                                      <IconButton size="small" edge="end" onClick={handleMenuOpen}>
                                          <MoreVertIcon fontSize="small"/>
                                      </IconButton>
                                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                          <MenuItem onClick={handleMenuClose}>
                                              <EditIcon fontSize="small" style={{ marginRight: 8 }}/> Edit
                                          </MenuItem>
                                          <MenuItem onClick={handleMenuClose}>
                                              <DeleteIcon fontSize="small" style={{ marginRight: 8 }}/> Delete
                                          </MenuItem>
                                      </Menu>
                                  </Box>
                              ) : (
                                  <Box display="flex" gap={1}>
                                      <IconButton size="small" edge="end" aria-label="edit">
                                          <EditIcon fontSize="small"/>
                                      </IconButton>
                                      <IconButton size="small" edge="end" aria-label="delete">
                                          <DeleteIcon fontSize="small"/>
                                      </IconButton>
                                  </Box>
                              )
                              }
                    >
                        <ListItemButton selected={currentRoom === room} onClick={() => onRoomChange(room)}
                                        sx={{ borderRadius: 1 }}>
                            <ListItemText primary={room}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};