/* eslint-disable react/display-name */
import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { telegramClient } from '@/utils/Telegram'
import { CustomFile } from 'telegram/client/uploads'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Box, Paper } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import { CancelOutlined } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { useIconData, ColorsLight } from '@bhunter179/chonky';
import { ChonkyIconFA } from '@bhunter179/chonky-icon-fontawesome';

const UploadItemEntry = () => {
    const [showCancel, setShowCancel] = useState(false)

    const { icon, colorCode } = useIconData({ name: 'new.mp4', isDir: 'false' })

    return (
        <ListItem onMouseEnter={() => setShowCancel(true)}
            onMouseLeave={() => setShowCancel(false)}
        >
            <ListItemIcon>
                <ChonkyIconFA icon={icon} style={{ color: ColorsLight[colorCode] }} />
            </ListItemIcon>
            <ListItemText primary="Bluetooth" />
            {showCancel ?
                <IconButton sx={{ color: 'text.primary' }}>
                    <CancelOutlined />
                </IconButton> :
                <Box sx={{ height: 40, width: 40, padding: 1 }}>
                    <CircularProgress size={24} variant="determinate" value={25} />
                </Box>
            }
        </ListItem>

    )
}

const Upload = forwardRef((props, ref) => {
    const cancelUploading = useRef(null)
    const parentPath = useRef(null)
    const filesWantToUpload = useRef([])

    // useEffect(() => {
    //     if (!fileList?.length) {
    //         parentPath.current = null
    //         filesWantToUpload.current = []
    //     }
    // }, [fileList])

    const fileInputRef = useRef()

    const [selectedFile, setSelectedFile] = useState();

    const showOpenFileDialog = () => {
        fileInputRef.current.click();
    };
    const handleChange = (event) => {
        setSelectedFile(event.target.files);
        uploadFiles(event.target.files[0])
    };

    useEffect(() => {
        async function connect() {
            await telegramClient.connect()
        }
        if (!ref.current) {
            ref.current = { showOpenFileDialog }
        }

        //connect()
    }, [])

    const uploadFiles = async (file) => {
        const client = await telegramClient.connect()
        const SPLIT_SIZE = 2 * 1024 * 1024 * 1024
        const filebuffer = file.arrayBuffer()
        const toUpload = new CustomFile(file.name, file.size, '', filebuffer);
        const uploadedfile = await client.uploadFile({
            file: toUpload,
            workers: 14,
            onProgress: console.log
        });
        await client.sendFile(-1001890818185, {
            file: uploadedfile, caption: file.name, forceDocument: true,
        })

    }

    const [open, setOpen] = React.useState(true);
    const [progress, setProgress] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    const hideProgress = () => {
        setProgress(false)
    };

    return (
        <>
            <input ref={fileInputRef} onChange={handleChange} type="file" style={{ display: "none" }} multiple />
            {progress &&
                <List
                    sx={{
                        width: '100%', maxWidth: 360, bgcolor: 'white',
                        position: 'fixed', bottom: 0, right: 8
                    }}
                    elevation={6}
                    component={Paper}
                    subheader={
                        <ListSubheader sx={{
                            bgcolor: 'background.default', display: 'flex',
                            justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <Typography variant='h6' component="h6">
                                Uploading 1 file
                            </Typography>
                            <Box>
                                <IconButton sx={{ color: 'text.primary' }} onClick={handleClick}>
                                    {open ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                                <IconButton sx={{ color: 'text.primary' }} onClick={hideProgress} >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </ListSubheader>}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <UploadItemEntry />
                        <UploadItemEntry />
                    </Collapse>
                </List>
            }
        </>
    )

})

export default Upload
