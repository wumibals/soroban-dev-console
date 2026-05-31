const expected = createHmac(
  'sha256',
  webhookSecret,
)
.update(rawBody)
.digest('hex');

if (
  !timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  )
) {
  throw new UnauthorizedException(
    'Invalid webhook signature',
  );
}