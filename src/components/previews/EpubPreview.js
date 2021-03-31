
import { Box } from "@mui/material"
import { useState, useRef } from "react"
import { ReactReader } from 'react-reader'
import { memo } from 'react';

const EpubPreview = ({ id, name }) => {

    const url = `/api/media/${id}/${encodeURIComponent(name)}`

    const epubContainer = useRef(null)

    const [location, setLocation] = useState()

    const onLocationChange = (cfiStr) => setLocation(cfiStr)

    const fixEpub = rendition => {
        const spineGet = rendition.book.spine.get.bind(rendition.book.spine)
        rendition.book.spine.get = function (target) {
            const targetStr = target
            let t = spineGet(target)
            while (t == null && targetStr.startsWith('../')) {
                target = targetStr.substring(3)
                t = spineGet(target)
            }
            return t
        }
    }


    return (
        <Box ref={epubContainer} sx={{
            maxWidth: "64rem", width: '100%',
            margin: 'auto', padding: '1rem', position: "relative", height: '90vh'
        }}>

            <ReactReader
                url={url}
                getRendition={rendition => fixEpub(rendition)}
                location={location}
                locationChanged={onLocationChange}
                epubInitOptions={{ openAs: 'epub' }}
                epubOptions={{ flow: 'scrolled', allowPopups: true }}
            />
        </Box>
    )
}

export default memo(EpubPreview)