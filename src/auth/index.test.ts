import { createAuthMiddleware, AuthRequest } from './index';
import { Response } from 'express';

describe('AuthMiddleware', () => {
  test('should return 401 and log error if no authorization header is passed through', async () => {
    const verifyAuthToken = jest.fn();
    const request = {
      headers: {},
    } as AuthRequest;
    const response = {} as Response;
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    const next = jest.fn();
    const logger = {
      log: jest.fn(),
    };
    const authMiddleware = createAuthMiddleware({ verifyAuthToken, logger });

    await authMiddleware(request, response, next);

    expect(logger.log).toHaveBeenCalledWith('error', 'Missing authorization header.');
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      message: 'Missing authorization header.',
    });
  });

  test('should return 401 and log error if failed to verify auth token', async () => {
    const authTokenError = new Error('Failed to verify JWT.');
    const verifyAuthToken = jest.fn().mockImplementation(() => {
      throw authTokenError;
    });
    const request = {
      headers: {
        authorization: 'Bearer token',
      },
    } as AuthRequest;
    const response = {} as Response;
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    const next = jest.fn();
    const logger = {
      log: jest.fn(),
    };
    const authMiddleware = createAuthMiddleware({ verifyAuthToken, logger });

    await authMiddleware(request, response, next);

    expect(logger.log).toHaveBeenCalledWith('error', 'Failed to verify authorization header JWT.', {
      err: authTokenError,
    });
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: 'Failed to verify authorization header JWT.' });
  });

  test('should log out scopes, userId, and call next if successfully verified and parsed auth token', async () => {
    const scopes = ['graphqlapi.users.read'];
    const userId = 'user@company.internal';
    const verifyAuthToken = jest.fn().mockImplementation(() => {
      return {
        scopes,
        userId,
      };
    });
    const request = {
      headers: {
        authorization: 'Bearer token',
      },
    } as AuthRequest;
    const response = {} as Response;
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    const next = jest.fn();
    const logger = {
      log: jest.fn(),
    };
    const authMiddleware = createAuthMiddleware({ verifyAuthToken, logger });

    await authMiddleware(request, response, next);

    expect(verifyAuthToken).toHaveBeenCalledWith('token');
    expect(logger.log).toHaveBeenCalledWith('info', 'Successfully verified authorization header.', {
      scopes,
      userId,
    });
    expect(next).toHaveBeenCalled();
  });
});
