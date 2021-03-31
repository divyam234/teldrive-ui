import React, { memo, useCallback } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useUpdateFile, useDeleteFile, useCreateFile } from '@/hooks/queryhooks'
import { RenameFile } from '@/utils/chonkyactions';
import { ChonkyActions } from '@bhunter179/chonky';
import { realPath } from "@/utils/common";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    p: 4,
};

export default memo(function FileModal({ modalState, setModalState, queryParams, path }) {

    const handleClose = useCallback(() => setModalState(prev => ({ ...prev, open: false })), [])

    const { mutation: updateMutation } = useUpdateFile(queryParams)

    const { mutation: deleteMutation } = useDeleteFile(queryParams)

    const { mutation: createMutation } = useCreateFile()


    const { file, open, operation } = modalState

    const onUpdate = useCallback(() => {

        if (operation === RenameFile.id)
            updateMutation.mutate({
                id: file.id, payload: {
                    name: file.name
                }
            })

        if (operation === ChonkyActions.CreateFolder.id)
            createMutation.mutate({
                payload: {
                    name: file.name,
                    type: 'folder',
                    path: realPath(path),
                    depth: path.length,
                    user_id: '6402f8b7d647f695aae2a636'
                }
            })

        handleClose()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, operation, updateMutation, handleClose, createMutation])

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Paper sx={style} elevation={3}>
                    <Typography id="transition-modal-title" variant="h6" component="h2">
                        {operation == RenameFile.id && 'Rename'}
                        {operation == ChonkyActions.CreateFolder.id &&
                            ChonkyActions.CreateFolder.button.name}
                    </Typography>
                    <TextField
                        fullWidth
                        focused
                        value={file.name}
                        variant="outlined"
                        inputProps={{ autoComplete: 'off' }}
                        onChange={(e) => setModalState(prev => ({
                            ...prev,
                            file: { ...prev.file, name: e.target.value }
                        }))} />
                    <Box sx={{ display: 'inline-flex', justifyContent: 'flex-end', gap: "1.2rem" }}>
                        <Button sx={{ fontWeight: 'normal' }} variant="text"
                            onClick={handleClose} disableElevation>Cancel</Button>
                        <Button disabled={!file.name} sx={{ fontWeight: 'normal' }}
                            variant="contained"
                            onClick={onUpdate}
                            disableElevation>OK</Button>
                    </Box>
                </Paper>
            </Fade>
        </Modal>
    );
})