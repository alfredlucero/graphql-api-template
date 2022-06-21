import { Response, NextFunction } from 'express';
import { IncomingMessage } from 'http';
import { GraphQLAPILogger } from '../logger';

// By default, the express-graphql request objects have this type which does not align exactly with express's "Request" type
export type ExpressGraphQLRequest = IncomingMessage & {
  url: string;
};

/**
 * scopes - corresponds to the scopes assigned to the group i.e. ["graphqlapi.users.read"]
 * userId - corresponds to the "sub" field in access token claims i.e. user@company.internal
 **/
export interface AuthTokenInfo {
  scopes: string[];
  userId: string;
}

// We will modify the request object to include the parsed out access token information needed to create our context object for all resolvers
// such as scopes and userId
export type AuthRequest = ExpressGraphQLRequest & Partial<AuthTokenInfo>;

interface AuthMiddlewareDependencies {
  verifyAuthToken: (token: string) => Promise<AuthTokenInfo>;
  logger: GraphQLAPILogger;
  authDisabled?: boolean;
}

export const createAuthMiddleware = ({ verifyAuthToken, logger, authDisabled = false }: AuthMiddlewareDependencies) => {
  return async (request: AuthRequest, response: Response, next: NextFunction) => {
    const { authorization } = request.headers;

    // Authorization header is required
    if (!authDisabled && !authorization) {
      logger.log('error', 'Missing authorization header.');
      return response.status(401).json({
        message: 'Missing authorization header.',
      });
    }

    // Authorization: Bearer token
    // We default the token to some value if auth is disabled
    const [authType, token] =
      !authDisabled && authorization ? authorization.trim().split(' ') : 'Bearer token'.split(' ');

    try {
      const { scopes, userId } = await verifyAuthToken(token);

      // Set scopes from access token on the request object so we can add to context later
      request.scopes = scopes;
      request.userId = userId;

      if (!authDisabled) {
        logger.log('info', 'Successfully verified authorization header.', {
          scopes,
          userId,
        });
      }

      next();
    } catch (err) {
      logger.log('error', 'Failed to verify authorization header JWT.', {
        err,
      });
      return response.status(401).json({
        message: 'Failed to verify authorization header JWT.',
      });
    }
  };
};
