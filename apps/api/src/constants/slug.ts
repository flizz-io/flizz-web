/** Lower-case letters and digits, single hyphens between them. */
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Longest slug any record may have. */
export const maxSlugLength = 100;
