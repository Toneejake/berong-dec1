import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, name, age } = body

    if (!username || !password || !name || !age) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    const ageNumber = parseInt(age, 10)
    if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 120) {
      return NextResponse.json(
        { success: false, error: 'Invalid age provided' },
        { status: 400 }
      )
    }

    const result = await registerUser(username, password, name, ageNumber)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // Set secure cookie
    const response = NextResponse.json(
      { success: true, user: result.user },
      { status: 201 }
    )
    
    response.cookies.set('bfp_user', JSON.stringify(result.user), {
      httpOnly: false, // Allow JS access for client-side routing
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Registration API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
