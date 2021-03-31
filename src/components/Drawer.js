import {
    AppBar, Box, Drawer, DrawerProps, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Toolbar, Typography
}
    from "@mui/material";
import { useState, useEffect } from 'react';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import StarBorder from '@mui/icons-material/StarBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { useRouter } from "next/router";
import Link from "next/link";

const NavDrawer = (props) => {
    const { ...others } = props;

    const categories = [
        {
            id: 'my-drive',
            name: 'My Drive',
            icon: <AddToDriveIcon />,
            active: true,
        },
        { id: 'starred', name: 'Starred', icon: <StarBorder /> },
        { id: 'trash', name: 'Trash', icon: <DeleteOutlineIcon /> },
        { id: 'recent', name: 'recent', icon: <WatchLaterIcon /> }
    ];

    const router = useRouter();

    const { path } = router.query

    const [selectedIndex, setSelectedIndex] = useState('');

    useEffect(() => {
        if (path && path.length > 0) setSelectedIndex(path[0]);
    }, [path])

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
        router.push(index)
    };

    return (
        <Drawer variant="permanent" {...others}>
            <List >
                <Box>
                    <ListItem sx={{ py: 2, px: 3 }}>
                        <ListItemText sx={{ fontWeight: 'bold' }}>
                            <Typography as={Link} color="inherit"
                                href={'/my-drive'}
                                sx={{
                                    fontWeight: 500,
                                    letterSpacing: 0.5,
                                    fontSize: 20,
                                    textDecoration: 'none'
                                }}>
                                Teldrive
                            </Typography>
                        </ListItemText>
                    </ListItem>
                </Box>
                {categories.map(({ id: childId, name, icon }) => (
                    <ListItem key={childId}>
                        <ListItemButton selected={selectedIndex == childId}
                            onClick={(event) => handleListItemClick(event, childId)}>
                            <ListItemIcon >{icon}</ListItemIcon>
                            <ListItemText >{name}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default NavDrawer;