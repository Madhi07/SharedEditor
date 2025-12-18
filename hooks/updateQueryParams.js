import { useRouter } from 'next/router';

/**
 * Hook to update multiple query parameters in the URL.
 *
 * @returns {(params: Record<string, any>, options?: { replace?: boolean }) => void}
 */
const useUpdateQueryParams = () => {
  const router = useRouter();

  /**
   * Updates multiple query params in the URL.
   *
   * @param {Object} params - Key-value pairs to update. Use null/undefined/'' to remove a key.
   * @param {Object} [options] - Optional config.
   * @param {boolean} [options.replace=false] - Use router.replace instead of router.push.
   */
  const updateQueryParams = (
    params = {},
    { replace = false } = {}
  ) => {
    const newQuery = { ...router.query };

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        delete newQuery[key]; // Remove key
      } else {
        newQuery[key] = value; // Set/Update key
      }
    });

    const method = replace ? router.replace : router.push;

    method(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  return updateQueryParams;
};

export default useUpdateQueryParams;
