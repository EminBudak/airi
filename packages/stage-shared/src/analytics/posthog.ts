import type { BeforeSendFn, PostHogConfig } from 'posthog-js'

/** The browser-safe PostHog project key that every AIRI client surface shares. */
export const POSTHOG_PROJECT_KEY = 'phc_pzjziJjrVZpa9SqnQqq0QEKvkmuCPH7GDTA6TbRTEf9' // cspell:disable-line

const urlPropertyPattern = /(?:url|referrer)$/i

function stripUrlQueries(properties: Record<string, unknown> | undefined): void {
  if (!properties)
    return
  for (const [key, value] of Object.entries(properties)) {
    if (typeof value === 'string' && urlPropertyPattern.test(key))
      properties[key] = value.split(/[?#]/, 1)[0]
  }
}

/** Removes query strings and fragments from URL properties, so OAuth codes never enter analytics. */
export const stripPosthogUrlQueries: BeforeSendFn = (event) => {
  stripUrlQueries(event.properties)
  stripUrlQueries(event.$set)
  stripUrlQueries(event.$set_once)
  return event
}

/**
 * Shared PostHog options for AIRI single-page applications.
 *
 * Only route page views and the declared product events are captured. Each
 * other capture product is off because PostHog bills it separately.
 */
export const DEFAULT_POSTHOG_CONFIG = {
  api_host: 'https://t.airi.build',
  defaults: '2025-05-24',
  person_profiles: 'identified_only',
  capture_pageview: 'history_change',
  capture_pageleave: false,
  autocapture: false,
  rageclick: false,
  capture_dead_clicks: false,
  capture_heatmaps: false,
  capture_exceptions: false,
  capture_performance: false,
  disable_session_recording: true,
  disable_surveys: true,
  disable_web_experiments: true,
  disable_product_tours: true,
  disable_conversations: true,
  // No client reads a remote flag. Each flag request is billed.
  advanced_disable_flags: true,
  before_send: stripPosthogUrlQueries,
} as const satisfies Partial<PostHogConfig>
