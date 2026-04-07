import { RootPage } from '@payloadcms/next/views';
import configPromise from '@/payload.config';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return RootPage({ params, searchParams, config: await configPromise });
}
