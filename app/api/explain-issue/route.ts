import { NextRequest, NextResponse } from 'next/server';
import { explainIssueWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { issue, customApiKey } = body;

    if (!issue) {
      return NextResponse.json({ error: 'Issue payload is required' }, { status: 400 });
    }

    const explanation = await explainIssueWithGemini(issue, customApiKey);
    return NextResponse.json(explanation);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to explain issue' },
      { status: 500 }
    );
  }
}
