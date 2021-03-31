import { Box } from "@mui/material"
import { memo } from 'react';

const PDFEmbedPreview = ({ id, name }) => {
    const pdfPath = encodeURIComponent(`/api/media/${id}/${name}`)
    const url = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${pdfPath}`

    return (
        <Box sx={{
            maxWidth: "64rem", width: '100%',
            margin: 'auto', padding: '1rem', position: "relative", height: '90vh'
        }}>
            <iframe style={{ border: 'none', borderRadius: 8 }} src={url} width="100%" height="100%" allowFullScreen />
        </Box>
    )
}

export default memo(PDFEmbedPreview)