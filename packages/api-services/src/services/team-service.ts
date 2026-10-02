import { apiService } from './api-service';
import type { ApiContext } from '../models/api';
import type { PublicTeamMember } from '../models/team';

/** The About page roster, in the order admins set — no session. */
export function getPublicTeamService(context?: ApiContext) {
	return apiService<PublicTeamMember[]>('/public/team', { context });
}
