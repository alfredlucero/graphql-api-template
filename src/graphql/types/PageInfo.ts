import { objectType } from 'nexus';

/**
  Notes about cursor pagination and forming pageInfo:

  Say default page limit is 10 and we're fetching data
  We will do a best effort cursor pagination assuming the before/afterKeys are based on data returned back from prior results

  When fetching first page of results without any before/afterKey
  - beforeKey = null; afterKey = result.length > limit ? result[limit - 1] aka second to last element : null
  - LIMIT (limit + 1), ORDER BY user.id ASC

  When going to the next page with an afterKey
  - beforeKey = result.length > 0 ? result[0] : null aka first element; afterKey = result.length > limit ? result[limit - 1] : null
  - WHERE user.id > afterKey
  - LIMIT (limit + 1), ORDER BY user.id ASC

  When going to the previous page with a beforeKey
  - beforeKey = result.length > limit ? result[limit - 1] aka second to last result : null; afterKey = result.length > 0 ? result[0] : null aka first element 
  - WHERE user.id < beforeKey
  - LIMIT (limit + 1), ORDER BY user.id DESC
  - Make sure to reverse the results after to have it returned in the same order as the next page/general results
*/
export const PageInfo = objectType({
  name: 'PageInfo',
  description:
    'Pagination info - afterKey will be null if there is no next page and beforeKey will be null if there is no prev page; otherwise, they will have some cursor value if the next/prev page exists',
  definition(t) {
    t.string('afterKey');
    t.string('beforeKey');
  },
});

/** Default page limit for cursor pagination i.e. 10 */
export const DEFAULT_PAGE_LIMIT = 10;
