import type { WealthProfile } from '@/lib/wealth-profile';

export type WealthUserRecord = {
  userId: string;
  profile: WealthProfile;
  updatedAt: string;
};

// Persistence boundary for the MVP. The interface is deliberately isolated so a database
// adapter can replace this implementation without changing the API or UI contracts.
const records = new Map<string, WealthUserRecord>();

export async function getWealthProfile(userId: string): Promise<WealthUserRecord | null> {
  return records.get(userId) ?? null;
}

export async function saveWealthProfile(userId: string, profile: WealthProfile): Promise<WealthUserRecord> {
  const record: WealthUserRecord = { userId, profile, updatedAt: new Date().toISOString() };
  records.set(userId, record);
  return record;
}
