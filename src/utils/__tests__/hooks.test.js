import { renderHook } from '@testing-library/react-hooks';
import { useIsMounted } from '../hooks';

describe('axios hooks', () => {
  it('can mount', () => {
    const mounted = renderHook(() => useIsMounted());

    expect(mounted.result.current.current).toBe(true);

    mounted.unmount();

    expect(mounted.result.current.current).toBe(false);
  });
});
