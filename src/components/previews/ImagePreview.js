/* eslint-disable @next/next/no-img-element */
import { Box } from "@mui/material"
import { memo } from 'react';

const ImagePreview = ({ id, name }) => {

    const url = `/api/media/${id}/${encodeURIComponent(name)}`
    return (
        <Box sx={{
            maxWidth: "64rem", width: '100%',
            margin: 'auto', padding: '1rem', position: "relative"
        }}>

            <img
                src={url}
                alt={name}
                style={{ maxWidth: "100%", height: "auto" }}
            />
        </Box>
    )
}

export default memo(ImagePreview)