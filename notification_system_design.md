# Stage 1

## Overview
I built a Priority Inbox system that fetches notifications from the campus notifications API and returns the top 10 most important unread notifications based on priority and recency.

## Approach

### Priority Scoring
I assigned weights to each notification type based on importance:
- Placement → weight 3 (highest)
- Result → weight 2
- Event → weight 1 (lowest)

The final score is calculated by multiplying the type weight by a large number and adding the timestamp in milliseconds. This ensures type always dominates, and recency breaks ties within the same type.

### Fetching Notifications
I used axios to call the protected GET API with a Bearer token in the Authorization header.

### Maintaining Top 10 Efficiently
After scoring all notifications, I sort them in descending order and slice the top 10. To handle new notifications coming in efficiently, a min-heap of size 10 would be ideal. When a new notification arrives, compare its score with the minimum in the heap. If higher, replace and re-heapify. This gives O(log 10) insertion instead of re-sorting everything each time.

## Files
- priority_inbox.js — main code file
- Screenshots of output included in repository