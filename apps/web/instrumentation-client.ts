import * as Sentry from '@sentry/nextjs';

import { sentryOptions } from '@/configs/sentry';

/** Browser error tracking — see `configs/sentry.ts`. */
if (sentryOptions.enabled) Sentry.init(sentryOptions);

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
