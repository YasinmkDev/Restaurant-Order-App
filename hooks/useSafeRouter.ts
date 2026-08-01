import { useRouter as useExpoRouter } from 'expo-router';
import { useCallback } from 'react';

// Module-level navigation debouncing across the entire app
let lastNavigationTimestamp = 0;
let lastNavigationTarget = '';
const MIN_INTERVAL_BETWEEN_PAGES_MS = 600;
const DUPLICATE_TARGET_COOLDOWN_MS = 1000;
const BACK_NAV_COOLDOWN_MS = 350;

/**
 * Enhanced router hook that prevents double-tap / rapid tap bugs
 * where screens open twice or duplicate in the navigation stack.
 */
export function useSafeRouter() {
  const router = useExpoRouter();

  const safePush = useCallback(
    (href: Parameters<typeof router.push>[0], options?: Parameters<typeof router.push>[1]) => {
      const now = Date.now();
      const targetStr = typeof href === 'string' ? href : JSON.stringify(href);

      // Block duplicate rapid navigation to the exact same screen
      if (
        targetStr === lastNavigationTarget &&
        now - lastNavigationTimestamp < DUPLICATE_TARGET_COOLDOWN_MS
      ) {
        return;
      }

      // Block any secondary navigation during ongoing screen transition
      if (now - lastNavigationTimestamp < MIN_INTERVAL_BETWEEN_PAGES_MS) {
        return;
      }

      lastNavigationTimestamp = now;
      lastNavigationTarget = targetStr;
      // Use navigate instead of push to avoid stacking duplicates
      router.navigate(href as any, options as any);
    },
    [router]
  );

  const safeNavigate = useCallback(
    (href: Parameters<typeof router.navigate>[0], options?: Parameters<typeof router.navigate>[1]) => {
      const now = Date.now();
      const targetStr = typeof href === 'string' ? href : JSON.stringify(href);

      if (
        targetStr === lastNavigationTarget &&
        now - lastNavigationTimestamp < DUPLICATE_TARGET_COOLDOWN_MS
      ) {
        return;
      }

      if (now - lastNavigationTimestamp < MIN_INTERVAL_BETWEEN_PAGES_MS) {
        return;
      }

      lastNavigationTimestamp = now;
      lastNavigationTarget = targetStr;
      router.navigate(href as any, options as any);
    },
    [router]
  );

  const safeReplace = useCallback(
    (href: Parameters<typeof router.replace>[0], options?: Parameters<typeof router.replace>[1]) => {
      const now = Date.now();
      if (now - lastNavigationTimestamp < BACK_NAV_COOLDOWN_MS) {
        return;
      }
      lastNavigationTimestamp = now;
      lastNavigationTarget = typeof href === 'string' ? href : JSON.stringify(href);
      router.replace(href as any, options as any);
    },
    [router]
  );

  const safeBack = useCallback(() => {
    const now = Date.now();
    // Prevent rapid double-tapping back button from skipping previous screens
    if (now - lastNavigationTimestamp < BACK_NAV_COOLDOWN_MS) {
      return;
    }
    lastNavigationTimestamp = now;
    lastNavigationTarget = '';
    router.back();
  }, [router]);

  return {
    ...router,
    push: safePush,
    navigate: safeNavigate,
    replace: safeReplace,
    back: safeBack,
  };
}
