
export interface ServerMember {
    memberUserId: number;
    memberName: string;
    parentGuildId: number;
}

export function ServerMember(memberUserId: number, memberName: string, parentGuildId: number): ServerMember {
    return {
        memberUserId,
        memberName,
        parentGuildId 
    };
}