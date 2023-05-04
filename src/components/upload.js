/* eslint-disable react/display-name */
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, memo } from 'react'
import { TGClient } from '@/utils/TGClient'
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
import { useSession } from '@/hooks/useAuth';
import useHover from '@/hooks/useHover';
import { realPath } from '@/utils/common';
import { useRouter } from 'next/router';
import http from '@/utils/http';
import { useQueryClient } from '@tanstack/react-query';


const UploadItemEntry = memo(({ name, progress }) => {

    const { icon, colorCode } = useIconData({ name, isDir: 'false' })

    const [hoverRef, isHovered] = useHover();

    return (
        <ListItem ref={hoverRef}>
            <ListItemIcon>
                <ChonkyIconFA icon={icon} style={{ color: ColorsLight[colorCode] }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{
                sx: {
                    overflow: 'hidden',
                    whiteSpace: 'nowrap', textOverflow: 'ellipsis'
                }
            }}
                primary={name} />
            {isHovered ?
                <IconButton sx={{ color: 'text.primary' }}>
                    <CancelOutlined />
                </IconButton> :
                <Box sx={{ height: 40, width: 40, padding: 1 }}>
                    <CircularProgress size={24} variant="determinate" value={progress} />
                </Box>
            }
        </ListItem>

    )
})

const uploadFile = async (file, path, queryClient, onProgress) => {
    const client = await TGClient.connect()
    const SPLIT_SIZE = 2 * 1024 * 1024 * 1024 - 128 * 1024 * 1024
    const fileParts = Math.ceil(file.size / SPLIT_SIZE)
    const filebuffer = file.arrayBuffer()
    try {
        let msgIds = []
        for (let part = 0; part < fileParts; part++) {
            const start = part * SPLIT_SIZE
            const end = Math.min(part * SPLIT_SIZE + SPLIT_SIZE, file.size)
            const fileSize = end - start
            const fileBlob = fileParts > 1 ? filebuffer.slice(start, end) : filebuffer
            const fileName = fileParts > 1 ? `${file.name}.part.${zeroPad(j + 1, 3)}` : file.name
            const toUpload = new CustomFile(fileName, fileSize, '', fileBlob);
            const uploadedfile = await client.uploadFile({
                file: toUpload,
                workers: 16,
                onProgress
            });
            const message = await client.sendFile(-1001890818185, {
                file: uploadedfile, caption: fileName, forceDocument: true
            })
            msgIds.push(message.id)
        }
        let payload = {
            'name': file.name,
            'mime_type': file.type,
            'type': 'file',
            'part_ids': msgIds,
            'size': file.size,
            'path': realPath(path),
            'channel_id': -1001890818185,
            'user_id': '6402f8b7d647f695aae2a636'
        }

        let res = await http.post('/api/files', payload)
        if (res.data) queryClient.invalidateQueries('files')
    }
    catch {

    }

}

const modifyFile = (file) => ({
    'name': file.name,
    'size': file.size,
    'type': file.type,
    'progress': 0,
    'status': 'idle',
    file
})

const Upload = forwardRef((props, ref) => {

    const fileInputRef = useRef()

    const [files, setFiles] = useState([]);

    const [currentFile, setcurrentFile] = useState({})

    const [open, setOpen] = useState(true);

    const [progress, setProgress] = useState(false);

    const { session } = useSession()

    const router = useRouter()

    const { path } = router.query

    const queryClient = useQueryClient()

    const showOpenFileDialog = () => {
        fileInputRef.current.click();
    };

    const handleChange = (event) => {
        setProgress(true)
        setFiles(prev => ([...prev, ...Array.from(event.target.files).map(file => modifyFile(file))]));
    };

    useEffect(() => {
        if (!currentFile.name && files.length > 0) {
            setcurrentFile({ name: files[0].name, index: 0, status: 'idle' })
        }

        if (currentFile.name && currentFile.status === 'idle') {
            setcurrentFile(prev => ({ ...prev, status: 'uploading' }))
            uploadFile(files[currentFile.index].file, path, queryClient, (progress) => {
                setcurrentFile(prev => ({ ...prev, progress }))
            }).then(() => {
                //setcurrentFile({ name: files[1].name, index: 1 })
            })
        }
    }, [files, currentFile, setcurrentFile])


    useImperativeHandle(ref, () => {
        return { showOpenFileDialog };

    }, []);

    useEffect(() => {
        if (session?.gramjs_session && !TGClient.client) {
            TGClient.init(session?.gramjs_session)
            TGClient.connect()
        }
        return () => TGClient.disconnect()
    }, [session?.gramjs_session])


    const handleClick = () => {
        setOpen(!open);
    };

    const hideProgress = () => {
        setProgress(false)
        setFiles([])
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
                    <Collapse in={open} timeout="auto" unmountOnExit
                        sx={{ maxHeight: 200, overflow: 'auto' }}>
                        {files.length > 0 && files.map((file, index) => (
                            <UploadItemEntry key={index} {...file} progress={currentFile.index === index ?
                                currentFile.progress * 100 : 0} />
                        ))}
                    </Collapse>
                </List>
            }
        </>
    )

})

export default Upload
