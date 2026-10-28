import { NextRequest, NextResponse } from 'next/server';
import { searchGitHubIssues } from '@/lib/github';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get('language') || undefined;
  const keyword = searchParams.get('keyword') || undefined;
  const hacktoberfestOnly = searchParams.get('hacktoberfestOnly') === 'true';
  const category = searchParams.get('category') || undefined;
  const token = req.headers.get('x-github-token') || undefined;

  try {
    const issues = await searchGitHubIssues({
      language,
      keyword,
      hacktoberfestOnly,
      category,
      token,
    });
    return NextResponse.json({ issues, total: issues.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to search issues' }, { status: 500 });
  }
}
