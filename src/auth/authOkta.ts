import OktaJwtVerifier from '@okta/jwt-verifier';
import AppConfig from '../config';
import { AuthTokenInfo } from './index';

// Disable Okta auth if we want it disabled or if it's running in unit tests
export const authDisabled = AppConfig.okta.disabled || AppConfig.server.nodeEnv === 'test';

const oktaJwtVerifier = authDisabled
  ? ({} as OktaJwtVerifier)
  : new OktaJwtVerifier({
      issuer: AppConfig.okta.issuer,
      clientId: AppConfig.okta.clientId,
    });

export type OktaCustomClaims = OktaJwtVerifier.JwtClaims & {
  groups?: string[];
};

export const verifyAuthTokenOkta = async (token: string): Promise<AuthTokenInfo> => {
  if (authDisabled) {
    return {
      scopes: ['graphqlapi.users.read', 'graphqlapi.users.manage'],
      userId: 'user@company.internal',
    };
  }

  const { claims } = await oktaJwtVerifier.verifyAccessToken(token, AppConfig.okta.audience);
  const customClaims: OktaCustomClaims = claims;

  const group = determineEnvOktaGroup(customClaims, AppConfig.server.deployedEnv);

  return {
    // In real implementation, map group to scopes and keep track of the mapping either in database or in server
    scopes: group !== 'Unknown' ? ['graphqlapi.users.read', 'graphqlapi.users.manage'] : [],
    userId: customClaims.sub,
  };
};

export const determineEnvOktaGroup = (customClaims: OktaCustomClaims, environment: string): string => {
  let group = 'Unknown';

  if (customClaims.groups && customClaims.groups.length > 0) {
    if (environment !== 'production') {
      const preProdRegex = /^Preprod/;
      const preProdGroup = customClaims.groups.find((group) => preProdRegex.test(group));
      if (preProdGroup) {
        group = preProdGroup;
      }
    } else {
      const prodRegex = /^Prod/;
      const prodGroup = customClaims.groups.find((group) => prodRegex.test(group));
      if (prodGroup) {
        group = prodGroup;
      }
    }
  }

  return group;
};
