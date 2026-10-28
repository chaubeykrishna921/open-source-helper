import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubUserProfile } from '@/lib/github';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, token } = body;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const profile = await fetchGitHubUserProfile(username, { token });
    return NextResponse.json(profile);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username') || 'sarah-frontend';
  try {
    const profile = await fetchGitHubUserProfile(username);
    return NextResponse.json(profile);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch user profile' }, { status: 500 });
  }
}
