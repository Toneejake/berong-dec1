import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getServerUser, getPermissions } from "@/lib/server-auth"
import AdultPageClient from "./adult-page-client"

// Force dynamic rendering — requires auth cookie check
export const dynamic = 'force-dynamic'

export default async function AdultPage() {
  // Server-side auth check — no client-side waterfall
  const user = await getServerUser()

  if (!user) {
    redirect("/auth")
  }

  const permissions = getPermissions(user.role as string)
  if (!permissions.accessAdult && user.role !== 'admin') {
    redirect("/")
  }

  // Fetch blogs directly from database (no API round-trip)
  const blogs = await prisma.blogPost.findMany({
    where: {
      category: "adult",
      isPublished: true,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { name: true }
      }
    }
  })

  // Map to the format the client component expects
  const mappedBlogs = blogs.map(blog => ({
    id: String(blog.id),
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
    imageUrl: blog.imageUrl || '',
    category: blog.category as "adult" | "professional",
    author: blog.author.name,
    createdAt: blog.createdAt.toISOString(),
  }))

  return <AdultPageClient initialBlogs={mappedBlogs} />
}
