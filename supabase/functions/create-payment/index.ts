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
        const body = await req.json()
        const { commerceOrder, subject, amount, email, urlConfirmation, urlReturn, optional } = body

        // Validate required fields
        if (!commerceOrder || !subject || !amount || !email || !urlConfirmation || !urlReturn) {
            console.error('Missing required fields:', { commerceOrder, subject, amount, email, urlConfirmation, urlReturn })
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        const FLOW_API_KEY = Deno.env.get('FLOW_API_KEY')
        const FLOW_SECRET_KEY = Deno.env.get('FLOW_SECRET_KEY')
        const FLOW_ENDPOINT = Deno.env.get('FLOW_ENDPOINT') || 'https://sandbox.flow.cl/api'

        if (!FLOW_API_KEY || !FLOW_SECRET_KEY) {
            console.error('Flow credentials not configured')
            return new Response(
                JSON.stringify({ error: 'Flow credentials not configured' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            )
        }

        // Prepare parameters
        const params: Record<string, any> = {
            apiKey: FLOW_API_KEY,
            commerceOrder,
            subject,
            currency: 'CLP',
            amount,
            email,
            urlConfirmation,
            urlReturn,
        }

        if (optional) {
            params.optional = optional
        }

        // Sort and sign parameters
        const sortedKeys = Object.keys(params).sort()
        let stringToSign = ''
        sortedKeys.forEach(key => {
            stringToSign += key + params[key]
        })

        console.log('String to sign:', stringToSign)
        const signature = await signHmacSHA256(stringToSign, FLOW_SECRET_KEY)
        params.s = signature

        // Make request to Flow
        const formData = new URLSearchParams(params)
        console.log('Calling Flow API:', `${FLOW_ENDPOINT}/payment/create`)

        const response = await fetch(`${FLOW_ENDPOINT}/payment/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        })

        const data = await response.json()
        console.log('Flow response status:', response.status)
        console.log('Flow response data:', data)

        if (!response.ok) {
            console.error('Flow API error:', data)
            return new Response(
                JSON.stringify({ error: data.message || 'Flow API error', details: data }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
            )
        }

        return new Response(
            JSON.stringify(data),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            },
        )
    } catch (error) {
        console.error('Edge Function error:', error)
        return new Response(
            JSON.stringify({ error: error.message || 'Internal server error', stack: error.stack }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
            },
        )
    }
})
