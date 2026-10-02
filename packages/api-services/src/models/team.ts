/** A team member as the public About page sees them — `GET /api/public/team`. */
export interface PublicTeamMember {
	uuid: string;
	firstName: string | null;
	lastName: string | null;
	designation: string | null;
	/** Uploaded photo, else their Google avatar. */
	photoUrl: string | null;
	isFounder: boolean;
	links: {
		linkedin: string | null;
		x: string | null;
		portfolio: string | null;
	};
}
