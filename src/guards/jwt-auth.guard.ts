import { Injectable, UnauthorizedException, Logger, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard delegates to passport-jwt strategy.
 * Use in controllers as: @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    // run passport's JWT strategy
    return super.canActivate(context);
  }

  // called after the strategy; handle errors / missing user
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err) {
      this.logger.warn('Auth error: ' + (err?.message ?? JSON.stringify(err)));
      throw err;
    }
    if (!user) {
      // log basic info for debugging, avoid logging tokens
      this.logger.warn('Unauthorized — no user. Info: ' + JSON.stringify(info));
      throw new UnauthorizedException('Invalid or expired token');
    }

    // success — return the user object that will be attached to request.user
    return user;
  }
}