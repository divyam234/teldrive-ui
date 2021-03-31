import axios from 'redaxios'
import { useEffect, useState } from 'react'

export default function useFileContent(url) {
    const [response, setResponse] = useState('')
    const [validating, setValidating] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        axios.get(url, { responseType: 'blob' })
            .then(async res => setResponse(await res.data.text()))
            .catch(e => setError(e.message))
            .finally(() => setValidating(false))
    }, [url])
    return { response, error, validating }
}