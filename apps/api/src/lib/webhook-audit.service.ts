audit.log({
  action: 'webhook.accepted',
  provider,
  webhookId,
});

audit.log({
  action: 'webhook.rejected',
  provider,
  reason: 'invalid_signature',
  webhookId,
});