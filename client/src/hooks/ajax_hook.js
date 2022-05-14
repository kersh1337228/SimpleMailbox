import {useState, useCallback} from 'react'


export default function ajax() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const request = useCallback(async (url, method, body, headers) => {
        try {
            const response = await fetch(url, {method, body, headers})
            const data = await response.json()
            if (!response.ok) throw Error(JSON.stringify(data.errors))
            return data
        } catch (error) {

        }
    })

    return{loading, request}
}
