# Campus Hiring Evaluation - 2302901520184

## Student Details
- **Name:** Tanya Jha
- **Roll No:** 2302901520184
- **GitHub:** tanyaworks

## Repository Structure

### campus-notifications/
Priority inbox logic - fetches notifications from API and returns top 10 by priority score.

### logging_midddleware/
Reusable logging middleware that sends logs to the evaluation server.

### notification_app_fe/
Next.js frontend with two pages:
- All Notifications page
- Priority Inbox page with filtering and top N selection

### notification_system_design.md
System design answers for Stages 1-6.

## How to Run

### Frontend
cd notification_app_fe
npm install
npm run dev
Open http://localhost:3000

### Priority Inbox
cd campus-notifications
node priority_inbox.js
