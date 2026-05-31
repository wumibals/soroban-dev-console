@Injectable()
export class WebhookSignatureGuard
  implements CanActivate
{
  async canActivate(
    context: ExecutionContext,
  ) {
    const request =
      context.switchToHttp().getRequest();

    await this.signatureService.verify(
      request,
    );

    await this.replayService.verify(
      request,
    );

    return true;
  }
}