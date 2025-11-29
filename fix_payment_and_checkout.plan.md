# Plan: Corregir Error de Pago y Mejorar Checkout

Este plan soluciona el error de la Edge Function (que se debe a la falta de secretos en el servidor) y mejora la experiencia de usuario en el checkout.

## 1. Configuración de Secretos (Acción del Usuario)
El error "Edge Function returned a non-2xx status code" confirma que **Supabase (en la nube)** no tiene tus claves de Flow. Aunque las pusimos en `.env` local, estas NO se suben automáticamente por seguridad.
- **Acción Crítica:** Te guiaré para que agregues `FLOW_API_KEY` y `FLOW_SECRET_KEY` en el Dashboard de Supabase.

## 2. Mejorar Checkout (Autocompletado)
Actualmente, el formulario de envío no se rellena si el perfil del usuario carga un poco después de la página.
- **Archivo:** `src/views/CheckoutView.tsx`
- **Cambio:** Agregar un `useEffect` que detecte cuando se carga la información del usuario (`profile`) y rellene automáticamente:
    - Teléfono
    - Dirección
    - Comuna
    - Región

## 3. Corregir Bug de Monto Total
He notado que el código actual cobra solo el valor de los productos (`total`), pero muestra al usuario el total + envío (`finalTotal`).
- **Archivo:** `src/views/CheckoutView.tsx`
- **Cambio:** Asegurar que se envíe `finalTotal` a Flow para que el cobro incluya el envío.

## Instrucciones para el Usuario
Al finalizar, deberás:
1. Ir al Dashboard de Supabase > Edge Functions > Secrets.
2. Agregar las claves que te proporcionaré en el chat.

