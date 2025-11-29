import CryptoJS from 'crypto-js';

const FLOW_API_KEY = import.meta.env.VITE_FLOW_API_KEY || '';
const FLOW_SECRET_KEY = import.meta.env.VITE_FLOW_SECRET_KEY || '';
const FLOW_ENDPOINT = import.meta.env.VITE_FLOW_ENDPOINT || 'https://sandbox.flow.cl/api';

interface FlowPaymentParams {
    commerceOrder: string;
    subject: string;
    currency: string;
    amount: number;
    email: string;
    urlConfirmation: string;
    urlReturn: string;
    optional?: string;
}

interface FlowPaymentResponse {
    url: string;
    token: string;
    flowOrder?: number;
}

/**
 * Signs parameters with HMAC SHA256
 */
function signParameters(params: Record<string, any>): string {
    // Remove 's' parameter if exists
    const { s, ...paramsToSign } = params;

    // Sort parameters alphabetically
    const sortedKeys = Object.keys(paramsToSign).sort();

    // Concatenate: key1value1key2value2...
    let stringToSign = '';
    sortedKeys.forEach(key => {
        stringToSign += key + paramsToSign[key];
    });

    // Sign with HMAC SHA256
    const signature = CryptoJS.HmacSHA256(stringToSign, FLOW_SECRET_KEY).toString();

    return signature;
}

/**
 * Creates a payment order with Flow
 */
export async function createFlowPayment(params: FlowPaymentParams): Promise<FlowPaymentResponse> {
    const paymentParams: Record<string, any> = {
        apiKey: FLOW_API_KEY,
        commerceOrder: params.commerceOrder,
        subject: params.subject,
        currency: params.currency,
        amount: params.amount,
        email: params.email,
        urlConfirmation: params.urlConfirmation,
        urlReturn: params.urlReturn,
    };

    if (params.optional) {
        paymentParams.optional = params.optional;
    }

    // Sign the parameters
    const signature = signParameters(paymentParams);
    paymentParams.s = signature;

    // Make POST request
    const response = await fetch(`${FLOW_ENDPOINT}/payment/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(paymentParams).toString(),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating Flow payment');
    }

    return await response.json();
}

/**
 * Get payment status from Flow
 */
export async function getFlowPaymentStatus(token: string): Promise<any> {
    const params: Record<string, any> = {
        apiKey: FLOW_API_KEY,
        token,
    };

    // Sign the parameters
    const signature = signParameters(params);
    params.s = signature;

    // Make GET request
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${FLOW_ENDPOINT}/payment/getStatus?${queryString}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error getting payment status');
    }

    return await response.json();
}

/**
 * Generate unique commerce order ID
 */
export function generateCommerceOrder(): string {
    return `MYN-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
