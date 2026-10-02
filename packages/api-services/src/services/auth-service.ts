import { apiService } from './api-service';
import type { ApiContext } from '../models/api';
import type { AuthUser } from '../models/auth';

/** `GET /api/auth/me` — the signed-in user. */
export function getMeService(context?: ApiContext) {
	return apiService<AuthUser>('/auth/me', { context });
}
