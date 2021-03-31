import 'plyr-react/plyr.css'
import Plyr from 'plyr-react';
import { Box, useTheme } from "@mui/material";
import { memo } from 'react';

const VideoPlayer = ({ videoName, videoUrl }) => {

    const theme = useTheme()

    const plyrSource = {
        type: 'video',
        title: videoName,
        sources: [
            {
                src: videoUrl,
                type: "video/mp4",
            },
        ]
    }
    const plyrOptions = {
        blankVideo: '',
        ratio: "16:9",
        iconUrl: "/img/plyr.svg",
        autoplay: true,
        loop: { active: true },
        fullscreen: { iosNative: true },
        controls: ['play-large', 'play', 'rewind', 'fast-forward', 'progress', 'current-time', 'mute', 'volume',
            , 'settings', 'pip', 'airplay', 'fullscreen']
    }


    return (
        <div style={{ "--plyr-color-main": theme.palette.primary.main }}>
            <Plyr id="plyr" source={plyrSource} options={plyrOptions} />
        </div>
    )
}

const VideoPreview = ({ id, name }) => {

    const videoUrl = `/api/media/${id}/${encodeURIComponent(name)}`

    return (
        <>
            {name &&
                <Box sx={{ maxWidth: "64rem", width: '100%', margin: 'auto', padding: '1rem' }}>
                    <VideoPlayer
                        videoName={name}
                        videoUrl={videoUrl}
                    />
                </Box>
            }
        </>
    )
}
export default memo(VideoPreview)