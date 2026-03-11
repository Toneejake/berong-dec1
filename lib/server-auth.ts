import { cookies } from 'next/headers'
import { verifyToken, type UserJWTPayload } from './jwt'

/**
 * Server-side auth helper for use in Server Components and Server Actions.
 * 
 * Reads the `bfp_user` JWT cookie and verifies it, returning the user payload.
 * This avoids the client-side /api/auth/me round-trip that causes slow loading.
 * 
 * Returns null if the user is not authenticated or the token is invalid.
 */
export async function getServerUser(): Promise<UserJWTPayload | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get('bfp_user')?.value

    if (!token) {
        return null
    }

    return verifyToken(token)
}

/**
 * Compute user permissions from role (mirrors auth-context.tsx logic).
 */
export function getPermissions(role: string) {
    switch (role) {
        case 'admin':
            return { accessKids: true, accessAdult: true, accessProfessional: true, isAdmin: true }
        case 'professional':
            return { accessKids: true, accessAdult: true, accessProfessional: true, isAdmin: false }
        case 'adult':
            return { accessKids: false, accessAdult: true, accessProfessional: false, isAdmin: false }
        case 'kid':
            return { accessKids: true, accessAdult: false, accessProfessional: false, isAdmin: false }
        default:
            return { accessKids: false, accessAdult: false, accessProfessional: false, isAdmin: false }
    }
}
