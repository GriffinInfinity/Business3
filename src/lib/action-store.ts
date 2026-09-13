export type ActionStatus = 'new' | 'saved' | 'active' | 'completed' | 'dismissed';

export type WealthAction = {
  id: string;
  userId: string;
  opportunityId: string;
  title: string;
  category: string;
  nextStep: string;
  score: number;
  status: ActionStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

const actions = new Map<string, WealthAction>();

function key(userId: string, opportunityId: string) {
  return `${userId}:${opportunityId}`;
}

export async function listActions(userId: string): Promise<WealthAction[]> {
  return [...actions.values()]
    .filter((action) => action.userId === userId)
    .sort((a, b) => b.score - a.score || b.updatedAt.localeCompare(a.updatedAt));
}

export async function upsertAction(input: Omit<WealthAction, 'id' | 'createdAt' | 'updatedAt'>): Promise<WealthAction> {
  const now = new Date().toISOString();
  const existing = actions.get(key(input.userId, input.opportunityId));
  const action: WealthAction = {
    ...input,
    id: existing?.id ?? crypto.randomUUID(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  actions.set(key(input.userId, input.opportunityId), action);
  return action;
}

export async function updateActionStatus(userId: string, opportunityId: string, status: ActionStatus, notes?: string) {
  const existing = actions.get(key(userId, opportunityId));
  if (!existing) return null;
  const updated = { ...existing, status, notes: notes ?? existing.notes, updatedAt: new Date().toISOString() };
  actions.set(key(userId, opportunityId), updated);
  return updated;
}
