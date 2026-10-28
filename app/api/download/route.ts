import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const zipPath = path.join(process.cwd(), 'public', 'gitstart-ai.zip');
  const fallbackZipPath = path.join(process.cwd(), '..', 'gitstart-ai.zip');

  const targetPath = fs.existsSync(zipPath) ? zipPath : fallbackZipPath;

  if (!fs.existsSync(targetPath)) {
    return NextResponse.json({ error: 'Zip file not found' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(targetPath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="gitstart-ai.zip"',
      'Content-Length': fileBuffer.length.toString(),
    },
  });
}
