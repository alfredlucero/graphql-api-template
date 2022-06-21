import { AuthRequest } from './auth';
import { GraphQLAPIServices } from './app';

/** Shared context across all GraphQL resolvers */
export interface Context {
  /** Dependency inject the services our resolvers will use */
  services: GraphQLAPIServices;
  /** Corresponds to the scopes assigned to the group */
  scopes: string[];
  /** Corresponds to the "sub" field in access token claims i.e. user@company.internal */
  userId: string;
}

export type ContextServiceInfo = Pick<Context, 'scopes' | 'userId'>;

interface ContextInfo {
  req: AuthRequest;
  services: GraphQLAPIServices;
}

export const createContext = ({ req, services }: ContextInfo): Context => {
  return {
    services,
    scopes: req.scopes ?? [],
    userId: req.userId ?? '',
  };
};
