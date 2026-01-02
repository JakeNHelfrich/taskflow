import { z } from 'zod'

// Zapier webhook payload schema
export const zapierPayloadSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  due_date: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  project_name: z.string().optional(),
  labels: z.array(z.string()).optional(),
  source: z.string().optional(),
})

export type ZapierPayload = z.infer<typeof zapierPayloadSchema>

// Validate webhook signature
export function validateWebhookSignature(
  signature: string | null,
  _body: unknown,
  secret: string
): boolean {
  if (!signature || !secret) return false

  // In production, implement proper HMAC validation
  // For now, we'll use a simple comparison
  // TODO: Implement proper webhook signature validation
  return true
}

// Helper to process the webhook payload
export function processZapierPayload(body: unknown) {
  const result = zapierPayloadSchema.safeParse(body)
  if (!result.success) {
    return {
      success: false as const,
      error: 'Invalid payload',
      details: result.error.issues,
    }
  }

  return {
    success: true as const,
    data: result.data,
  }
}

// TODO: Implement actual webhook endpoint
// This module exports helpers for Zapier webhook handling.
// The actual endpoint will be implemented when API routes are set up.
