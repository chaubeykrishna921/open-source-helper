import { NextRequest, NextResponse } from 'next/server';
import { reviewPRWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      diff,
      issueNumber,
      targetBranch,
      customApiKey,
      provider,
      ollamaModel,
      ollamaEndpoint,
    } = body;

    if (!title && !diff && !description) {
      return NextResponse.json(
        { error: 'At least PR title, description, or diff must be provided' },
        { status: 400 }
      );
    }

    const review = await reviewPRWithGemini(
      {
        title: title || 'Draft Pull Request',
        description: description || '',
        diff: diff || '',
        issueNumber: issueNumber || '',
        targetBranch: targetBranch || 'main',
      },
      {
        customApiKey,
        provider,
        ollamaModel,
        ollamaEndpoint,
      }
    );

    return NextResponse.json(review);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to review pull request' },
      { status: 500 }
    );
  }
}
