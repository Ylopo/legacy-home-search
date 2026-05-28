/**
 * platformCredentials — singleton document storing per-platform connection metadata.
 *
 * Secrets (tokens, API keys) stay in Vercel env vars and are never stored here.
 * This document holds only non-secret IDs and connection state:
 *   - display names (confirmed by testing the credential)
 *   - platform-specific IDs (page IDs, channel IDs, org IDs)
 *   - timestamps (connectedAt, token issue date for expiry warnings)
 *
 * Written by /api/admin/connect/* routes when a credential is tested.
 * Read by /admin/connect to show live connection status.
 */

export default {
  name: 'platformCredentials',
  title: 'Platform Credentials',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'facebook',
      title: 'Facebook',
      type: 'object',
      fields: [
        { name: 'pageId',      title: 'Page ID',      type: 'string' },
        { name: 'pageName',    title: 'Page Name',    type: 'string' },
        { name: 'connectedAt', title: 'Connected At', type: 'datetime' },
      ],
    },
    {
      name: 'instagram',
      title: 'Instagram',
      type: 'object',
      fields: [
        { name: 'businessAccountId', title: 'Business Account ID', type: 'string' },
        { name: 'username',          title: 'Username',            type: 'string' },
        { name: 'connectedAt',       title: 'Connected At',        type: 'datetime' },
      ],
    },
    {
      name: 'youtube',
      title: 'YouTube',
      type: 'object',
      fields: [
        { name: 'channelId',   title: 'Channel ID',   type: 'string' },
        { name: 'channelName', title: 'Channel Name', type: 'string' },
        { name: 'connectedAt', title: 'Connected At', type: 'datetime' },
      ],
    },
    {
      name: 'tiktok',
      title: 'TikTok',
      type: 'object',
      fields: [
        { name: 'username',    title: 'Username',     type: 'string' },
        { name: 'connectedAt', title: 'Connected At', type: 'datetime' },
      ],
    },
    {
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'object',
      fields: [
        { name: 'organizationId',  title: 'Organization ID',   type: 'string' },
        { name: 'orgName',         title: 'Org Name',          type: 'string' },
        { name: 'tokenIssuedAt',   title: 'Token Issued At',   type: 'datetime' },
        { name: 'connectedAt',     title: 'Connected At',      type: 'datetime' },
      ],
    },
    {
      name: 'ga4',
      title: 'Google Analytics 4',
      type: 'object',
      fields: [
        { name: 'propertyId',  title: 'Property ID',  type: 'string' },
        { name: 'connectedAt', title: 'Connected At', type: 'datetime' },
      ],
    },
    {
      name: 'gsc',
      title: 'Google Search Console',
      type: 'object',
      fields: [
        { name: 'siteUrl',     title: 'Site URL',     type: 'string' },
        { name: 'connectedAt', title: 'Connected At', type: 'datetime' },
      ],
    },
  ],
}
