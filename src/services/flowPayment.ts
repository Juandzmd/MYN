import { supabase } from '../supabaseClient';

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
 * Creates a payment order with Flow via Supabase Edge Function
 */
export async function createFlowPayment(params: FlowPaymentParams): Promise<FlowPaymentResponse> {
    // Get auth session
    const { data: { session } } = await supabase.auth.getSession();

    const { data, error } = await supabase.functions.invoke('create-payment', {
        body: params
    });

    if (error) {
        console.error('Edge Function error:', error);
        throw new Error(error.message || 'Error creating payment');
    }

    if (data?.error) {
        console.error('Flow API error:', data.error);
        throw new Error(data.error);
    }

    return data;
}

/**
 * Get payment status from Flow via Supabase Edge Function
 */
export async function getFlowPaymentStatus(token: string): Promise<any> {
    const { data: { session } } = await supabase.auth.getSession();

    const { data, error } = await supabase.functions.invoke('get-payment-status', {
        body: { token }
    });

    if (error) {
        throw new Error(error.message || 'Error getting payment status');
    }

    if (data?.error) {
        throw new Error(data.error);
    }

    return data;
}

/**
 * Generate unique commerce order ID
 */
export function generateCommerceOrder(): string {
    return `MYN-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
