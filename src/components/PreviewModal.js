import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useIconData, ColorsLight } from '@bhunter179/chonky';
import { ChonkyIconFA } from '@bhunter179/chonky-icon-fontawesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { alpha } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { getExtension } from '@/utils/common';
import { getPreviewType, preview } from '@/utils/getPreviewType';
import VideoPreview from './previews/VideoPreview';
import PDFPreview from './previews/PdfPreview';
import CodePreview from './previews/CodePreview';
import ImagePreview from './previews/ImagePreview';
import EpubPreview from './previews/EpubPreview';
import { selectors } from '@bhunter179/chonky'
import { useSelector } from 'react-redux';
import ModalMenu from './ModalMenu';


export default memo(function PreviewModal({ modalState, setModalState }) {

    const lastitem = useSelector(state => state.lastClick);
    const displayFileIds = useSelector(selectors.getDisplayFileIds);
    const fileMap = useSelector(state => state.fileMap)
    const filesRef = useRef(null)
    const [currFile, setCurrFile] = useState({})

    useEffect(() => {
        if (!filesRef.current) {
            filesRef.current = { lastitem, displayFileIds, fileMap }
            setCurrFile({ ...filesRef.current.fileMap[lastitem.fileId], currIndex: lastitem.index })
        }
    }, [lastitem, displayFileIds, fileMap])

    const { open } = modalState

    const { id, name, currIndex } = currFile

    const { icon, colorCode } = useIconData({ name: name ?? '', isDir: 'false' })

    const videoUrl = `/api/media/${id}/${encodeURIComponent(name)}?&d=1`

    const playNext = () => {
        const data = filesRef.current
        let index = currIndex + 1
        if (index >= data.displayFileIds.length) index = 0
        setCurrFile({ ...data.fileMap[data.displayFileIds[index]], currIndex: index })
    }

    const playPrev = () => {
        const data = filesRef.current
        let index = currIndex - 1
        if (index < 0) index = 0
        setCurrFile({ ...data.fileMap[data.displayFileIds[index]], currIndex: index })
    }

    const handleClose = useCallback(() => setModalState(prev => ({ ...prev, open: false })), [])


    const renderPreview = useCallback(() => {
        const previewType = getPreviewType(getExtension(name))

        if (previewType) {
            switch (previewType) {

                case preview.video:
                    return <VideoPreview id={id} name={name} />

                case preview.pdf:
                    return <PDFPreview id={id} name={name} />

                case preview.code:
                    return <CodePreview id={id} name={name} />

                case preview.image:
                    return <ImagePreview id={id} name={name} />

                case preview.epub:
                    return <EpubPreview id={id} name={name} />

                default:
                    return null
            }
        }
    }, [id, name])

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            sx={{ display: 'flex' }}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    sx: {
                        bgcolor: (theme) => alpha(theme.palette.shadow, 0.7)
                    }
                }
            }}
        >
            <>
                {id && name &&
                    <>
                        <IconButton sx={{
                            position: 'absolute', left: 32, color: 'white', top: '50%', zIndex: 100,
                            background: '#1F1F1F'
                        }}
                            color="inherit" edge="start"
                            onClick={playPrev}>
                            <NavigateBeforeIcon />
                        </IconButton>

                        <IconButton sx={{
                            position: 'absolute', right: 32, color: 'white', top: '50%', zIndex: 100,
                            background: '#1F1F1F'
                        }}
                            color="inherit" edge="start"
                            onClick={playNext}>
                            <NavigateNextIcon />
                        </IconButton>

                        <Box sx={{
                            position: 'absolute', height: 64, width: "100%", top: 0,
                            padding: 2,
                            color: 'white', display: 'flex', justifyContent: 'space-between'
                        }}>
                            <Box sx={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                width: '30%', position: 'absolute', left: '1rem'
                            }}>
                                <IconButton color="inherit" edge="start" onClick={handleClose}>
                                    <ArrowBackIcon />
                                </IconButton>
                                <ChonkyIconFA icon={icon} style={{ color: ColorsLight[colorCode] }} />
                                <Typography sx={{
                                    whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
                                    fontSize: '1rem', cursor: 'pointer'
                                }}
                                    variant='h6' component="h6" title={name}>
                                    {name}
                                </Typography>
                            </Box>
                            <Box sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                marginRight: "-50%",
                                transform: "translate(-50%,-50%)"
                            }}><ModalMenu /></Box>
                            <Box sx={{
                                display: 'inline-flex', alignItems: 'center', gap: '1rem', position: 'absolute',
                                right: '1rem'
                            }}>
                                <IconButton component={Link} target="_blank"
                                    rel="noopener noreferrer" href={videoUrl} color="inherit" edge="start">
                                    <FileDownloadOutlinedIcon />
                                </IconButton>
                                <IconButton color="inherit" edge="start">
                                    <MoreVertOutlinedIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        {renderPreview()}
                    </>
                }
            </>
        </Modal >
    );
})