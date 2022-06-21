import { objectType, enumType } from 'nexus';

export const ErrorCode = enumType({
  name: 'ErrorCode',
  members: ['NOT_FOUND', 'ACCESS_FORBIDDEN', 'BAD_REQUEST'],
  description: 'Error code types such as Not Found, Access Forbidden, etc',
});

export const ErrorInfo = objectType({
  name: 'ErrorInfo',
  description: 'Error info including code and message',
  definition(t) {
    t.nonNull.field('code', {
      type: ErrorCode,
    });
    t.nonNull.string('message');
  },
});
