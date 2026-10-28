import { NextRequest, NextResponse } from 'next/server';
import { checkOllamaStatus } from '@/lib/ollama';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get('endpoint') || undefined;

  try {
    const status = await checkOllamaStatus(endpoint);
    return NextResponse.json(status);
  } catch (err: any) {
    return NextResponse.json(
      { running: false, models: [], error: err.message },
      { status: 500 }
    );
  }
}
