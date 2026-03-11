import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getServerUser, getPermissions } from "@/lib/server-auth"
import ProfessionalPageClient from "./professional-page-client"

// Force dynamic rendering — requires auth cookie check
export const dynamic = 'force-dynamic'

export default async function ProfessionalPage() {
  // Server-side auth check — no client-side waterfall
  const user = await getServerUser()

  if (!user) {
    redirect("/auth")
  }

  const permissions = getPermissions(user.role as string)
  if (!permissions.accessProfessional && user.role !== 'admin') {
    redirect("/")
  }

  // Fetch videos directly from database (no API round-trip)
  const videos = await prisma.video.findMany({
    where: {
      isActive: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Map to the format the client component expects
  const mappedVideos = videos.map(video => ({
    id: String(video.id),
    title: video.title,
    description: video.description || '',
    youtubeId: video.youtubeId,
    category: video.category as "professional" | "adult" | "kids",
    duration: video.duration || '',
  }))

  return <ProfessionalPageClient initialVideos={mappedVideos} />
}
