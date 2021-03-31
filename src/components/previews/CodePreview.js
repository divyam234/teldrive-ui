import { Box } from "@mui/material"
import useFileContent from "@/hooks/useFileContent"
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter'
import { getLanguageByFileName } from "@/utils/getPreviewType"
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { memo } from 'react';

const CodePreview = ({ id, name }) => {

    const url = `/api/media/${id}/${encodeURIComponent(name)}`

    const { response: content, error, validating } = useFileContent(url)


    return (
        <Box sx={{
            maxWidth: "64rem", width: '100%',
            margin: 'auto', padding: '1rem', position: "relative", height: '95vh'
        }}>
            {validating ? null :
                <SyntaxHighlighter
                    language={getLanguageByFileName(name)}
                    wrapLongLines={true}
                    showLineNumbers={true}
                    customStyle={{ height: '100%', overflowX: 'hidden' }}
                    style={atomDark}
                >
                    {content}
                </SyntaxHighlighter>}


        </Box>
    )
}

export default memo(CodePreview)