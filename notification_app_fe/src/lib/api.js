const WEIGHTS = { Placement: 3, Result: 2, Event: 1 };

export async function fetchNotifications({ limit = 10, page = 1, notification_type = "" } = {}) {
  let url = `/api/notifications?limit=${limit}&page=${page}`;
  if (notification_type) url += `&notification_type=${notification_type}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  const data = await res.json();
  return data.notifications || [];
}

export function getPriorityScore(notification) {
  const weight = WEIGHTS[notification.Type] || 0;
  const timestamp = new Date(notification.Timestamp).getTime();
  return weight * 1e12 + timestamp;
}

export function getTopN(notifications, n = 10) {
  return [...notifications]
    .map((n) => ({ ...n, score: getPriorityScore(n) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}