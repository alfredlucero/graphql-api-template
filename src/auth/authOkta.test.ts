import { determineEnvOktaGroup, OktaCustomClaims } from './authOkta';

describe('determineEnvOktaGroup', () => {
  const defaultCustomClaims: OktaCustomClaims = {
    groups: [],
    iss: 'mockIss',
    sub: 'mockSub',
    aud: 'mockAud',
    exp: 12,
  };

  it('should return Unknown Okta Group if groups do not exist', () => {
    const result = determineEnvOktaGroup(defaultCustomClaims, 'test');

    expect(result).toBe('Unknown');
  });

  it('should return Preprod Okta Group if in non production environment and user has Preprod Okta Group', () => {
    const mockCustomClaims = { ...defaultCustomClaims, groups: ['Preprod Admin', 'Prod Admin'] };

    const result = determineEnvOktaGroup(mockCustomClaims, 'test');

    expect(result).toBe('Preprod Admin');
  });

  it('should return Unknown Okta Group if in non production environment and user does not have Preprod Okta Group', () => {
    const mockCustomClaims = { ...defaultCustomClaims, groups: ['Prod Admin'] };

    const result = determineEnvOktaGroup(mockCustomClaims, 'test');

    expect(result).toBe('Unknown');
  });

  it('should return Prod Okta Group if in production environment and user has Prod Okta Group', () => {
    const mockCustomClaims = { ...defaultCustomClaims, groups: ['Preprod Admin', 'Prod Admin'] };

    const result = determineEnvOktaGroup(mockCustomClaims, 'production');

    expect(result).toBe('Prod Admin');
  });

  it('should return Unknown Okta Group if in production environment and user does not have Prod Okta Group', () => {
    const mockCustomClaims = { ...defaultCustomClaims, groups: ['Preprod Admin'] };

    const result = determineEnvOktaGroup(mockCustomClaims, 'production');

    expect(result).toBe('Unknown');
  });
});
