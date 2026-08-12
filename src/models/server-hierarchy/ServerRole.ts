export type ServerRole = 'member' | 'admin' | 'creator';

export function canManageServer(role: ServerRole | undefined): boolean {
    return role === 'admin' || role === 'creator';
}
