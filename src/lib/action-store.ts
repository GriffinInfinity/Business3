import type { Opportunity } from '@/lib/opportunity-engine';

export type ActionStatus = 'new' | 'saved' | 'active' | 'completed' | 'dismissed';

export type WealthAction = {
  id: string;
  userId: string;
  opportunity: Opportunity;
  status: ActionStatus;
  note: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

const actions = new Map<string, WealthAction>();

export async function listActions(userId: string): Promise<WealthAction[]> {
  return [...actions.values()]
    .filter((action) => action.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function upsertAction(userId: string, opportunity: Opportunity, status: ActionStatus = 'saved', note = ''): Promise<WealthAction> {
  const existing = [...actions.values()].find((action) => action.userId === userId && action.opportunity.id === opportunity.id);
  const now = new Date().toISOString();
  const action: WealthAction = existing
    ? { ...existing, opportunity, status, note, updatedAt: now, completedAt: status === 'completed' ? existing.completedAt ?? now : status === 'dismissed' ? null : existing.completedAt }
    : { id: crypto.randomUUID(), userId, opportunity, status, note, createdAt: now, updatedAt: now, completedAt: status === 'completed' ? now : null };
  actions.set(action.id, action);
  return action;
}

export async function updateAction(userId: string, actionId: string, patch: Partial<Pick<WealthAction, 'status' | 'note'>>): Promise<WealthAction | null> {
  const current = actions.get(actionId);
  if (!current || current.userId !== userId) return null;
  const now = new Date().toISOString();
  const nextStatus = patch.status ?? current.status;
  const next: WealthAction = { ...current, ...patch, status: nextStatus, updatedAt: now, completedAt: nextStatus === 'completed' ? current.completedAt ?? now : nextStatus === 'dismissed' ? null : current.completedAt };
  actions.set(actionId, next);
  return next;
}
