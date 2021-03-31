import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { alpha } from '@mui/material';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color: "#E3E3E3",
        backgroundColor: "#121212",
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: "#E3E3E3",
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: "rgba(255, 255, 255, 0.08)"
            },
            '&:hover': {
                backgroundColor: "rgba(255, 255, 255, 0.08)"
            }
        },
    },
}));

export default function ModalMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="outlined"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                    backgroundColor: alpha("#121212", 0.75),
                    border: `2px solid ${alpha("#FFFFFF", 0.52)} !important`,
                    color: "#C4C7C5",
                    '&:hover': {
                        backgroundColor: alpha("#121212", 0.45)
                    },
                    transition: 'none'
                }}
            >
                Open With
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose} disableRipple>
                    <FileCopyIcon />
                    Open In VLC
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    <FileCopyIcon />
                    Open In PotPlayer
                </MenuItem>
            </StyledMenu>
        </>
    );
}