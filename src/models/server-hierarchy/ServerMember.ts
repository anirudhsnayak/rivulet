/**
 * Represents a member of a server ("guild") in the Redux store and UI layer.
 *
 * Members are scoped to a single guild via `parentGuildId`. The visible set
 * for the selected guild is stored in {@link UserState.visibleMembers}.
 *
 * @see {@link ServerMemberDB} — equivalent DB shape
 * @see {@link docs/architecture.md#domain-models} — domain model overview
 */
export interface ServerMember {
    /** The user's unique identifier. */
    memberUserId: number;
    /** Display name of the member. */
    memberName: string;
    /** The guild this member belongs to. */
    parentGuildId: number;
}

/**
 * Factory function for creating a {@link ServerMember} object.
 *
 * @param memberUserId - The user's unique identifier.
 * @param memberName - Display name of the member.
 * @param parentGuildId - The guild this member belongs to.
 * @returns A plain object conforming to the {@link ServerMember} interface.
 */
export function ServerMember(memberUserId: number, memberName: string, parentGuildId: number): ServerMember {
    return {
        memberUserId,
        memberName,
        parentGuildId
    };
}