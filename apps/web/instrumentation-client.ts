import * as Sentry from '@sentry/nextjs';

import { sentryOptions } from '@/configs/sentry';

/** Browser error tracking — see `configs/sentry.ts`. */
Sentry.init(sentryOptions);

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
