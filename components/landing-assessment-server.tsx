import { getServerUser } from '@/lib/server-auth'
import { LandingAssessmentSection } from './landing-assessment-section'

/**
 * Server Component wrapper for the assessment section.
 * 
 * Determines auth state on the server so the client component
 * can render immediately without waiting for /api/auth/me.
 */
export async function LandingAssessmentServer() {
    const user = await getServerUser()

    return (
        <LandingAssessmentSection
            serverUser={user ? {
                id: user.id,
                name: (user.name as string) || 'User',
                age: (user.age as number) ?? undefined,
                role: (user.role as string) || 'guest',
            } : null}
        />
    )
}
