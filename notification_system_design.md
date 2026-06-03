cat > notification_system_design.md << 'ENDOFFILE'
# Stage 1

## Overview
I built a Priority Inbox system that fetches notifications from the campus notifications API and returns the top 10 most important unread notifications based on priority and recency.

## Approach

### Priority Scoring
- Placement = weight 3 (highest)
- Result = weight 2
- Event = weight 1 (lowest)

Score = typeWeight * 1e12 + timestamp in milliseconds. Type always dominates, recency breaks ties.

### Fetching Notifications
Used axios with Bearer token in Authorization header.

### Maintaining Top 10 Efficiently
A min-heap of size 10 is ideal. New notification arrives, compare with heap minimum. If higher, replace and re-heapify in O(log 10) time instead of re-sorting everything.

---

# Stage 2

## Database Choice
PostgreSQL - reliable relational DB, structured schema, supports indexing.

## DB Schema
CREATE TABLE students (id UUID PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE, roll_no VARCHAR(50), created_at TIMESTAMP DEFAULT NOW());

CREATE TABLE notifications (id UUID PRIMARY KEY, student_id UUID REFERENCES students(id), type VARCHAR(50), message TEXT, is_read BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT NOW());

## Problems at Scale
- Full table scans slow without indexes
- Storage costs increase
- Concurrent reads cause locking

## Solutions
- Add indexes on student_id, is_read, created_at
- Use pagination
- Archive old notifications

---

# Stage 3

## Query Analysis
Original query does full table scan on 5,000,000 rows - very slow.

## Fix
CREATE INDEX idx_notifications_student_read_created ON notifications(studentID, isRead, createdAt);

This makes lookup O(log n) instead of O(n).

## Index on every column?
No. Each index slows INSERT/UPDATE/DELETE and wastes disk space. Only index frequently queried columns.

## Placement notifications last 7 days
SELECT DISTINCT studentID FROM notifications WHERE notificationType = 'Placement' AND createdAt >= NOW() - INTERVAL '7 days';

---

# Stage 4

## Problem
DB overloaded by fetching notifications on every page load for 50,000 students.

## Solution: Redis Cache
1. Request comes in - check Redis first
2. Cache hit - return instantly
3. Cache miss - fetch from DB, store in Redis with 60 second TTL, return data

Cache key: notifications:{studentId}:{page}:{type}

Invalidate cache when new notification is created for that student.

## Tradeoffs
Redis Cache: very fast, reduces DB load but needs extra infrastructure.
DB Indexing only: no extra infra but still hits DB every request.
Pagination only: reduces data per query but still hits DB every request.

---

# Stage 5

## Shortcomings of Current Implementation
1. Not fault tolerant - if send_email fails at student 200, remaining 49800 never get notified
2. Sequential - 50000 students one by one is very slow
3. No retry mechanism - failed notifications lost permanently
4. Tight coupling - email, DB, push happen together, one failure affects all
5. No transaction safety

## Should DB save and email happen together?
No. DB save should happen first independently. Email and push can fail and be retried without affecting DB.

## Redesigned Solution: Message Queue
Save to DB first with status pending, then enqueue job.
Workers process queue in parallel.
On failure: retry up to 3 times, then mark as failed and log.

Why better:
- Parallel processing - much faster
- Fault tolerant - auto retry
- Decoupled - DB save separate from delivery
- Resumable - queue picks up from where it stopped

---

# Stage 6

## Overview
Priority Inbox fetching top 10 notifications by weight and recency.

## Scoring
- Placement = weight 3
- Result = weight 2
- Event = weight 1

Score = typeWeight * 1e12 + timestamp_milliseconds

## Efficient Top 10
Min-heap of size 10. New notification compared with heap minimum. If higher score, replace and re-heapify in O(log 10) time.

## Files
- campus-notifications/priority_inbox.js
- Screenshots in repository
ENDOFFILE