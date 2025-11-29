import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// HMAC SHA256 signing using Web Crypto API
async function signHmacSHA256(message: string, secret: string): Promise<string> {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const messageData = encoder.encode(message)

    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', key, messageData)

    // Convert to hex string
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { token } = await req.json()

        const FLOW_API_KEY = Deno.env.get('FLOW_API_KEY')!
        const FLOW_SECRET_KEY = Deno.env.get('FLOW_SECRET_KEY')!
        const FLOW_ENDPOINT = Deno.env.get('FLOW_ENDPOINT') || 'https://sandbox.flow.cl/api'

        // Prepare parameters
        const params: Record<string, any> = {
            apiKey: FLOW_API_KEY,
            token,
        }

        // Sort and sign parameters
        const sortedKeys = Object.keys(params).sort()
        let stringToSign = ''
        sortedKeys.forEach(key => {
            stringToSign += key + params[key]
        })

        const signature = await signHmacSHA256(stringToSign, FLOW_SECRET_KEY)
        params.s = signature

        // Make request to Flow
        const queryString = new URLSearchParams(params).toString()
        const response = await fetch(`${FLOW_ENDPOINT}/payment/getStatus?${queryString}`)

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Flow API error')
        }

        return new Response(
            JSON.stringify(data),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            },
        )
    }
})
