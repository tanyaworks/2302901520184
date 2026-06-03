const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJqaGEudGFueWFhMTJAZ21haWwuY29tIiwiZXhwIjoxNzgwNDY0NjMyLCJpYXQiOjE3ODA0NjM3MzIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI4ZWFkOTQ1Ny0wYmE1LTQ4ODYtYmJhYi1hMTM5MDQzNTcwYTAiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJ0YW55YSBqaGEiLCJzdWIiOiJiM2I2Nzc5Yy0yMjI1LTQwNTQtYTEyOS00MGU4MGZhMDM3OGIifSwiZW1haWwiOiJqaGEudGFueWFhMTJAZ21haWwuY29tIiwibmFtZSI6InRhbnlhIGpoYSIsInJvbGxObyI6IjIzMDI5MDE1MjAxODQiLCJhY2Nlc3NDb2RlIjoic2RXV2djIiwiY2xpZW50SUQiOiJiM2I2Nzc5Yy0yMjI1LTQwNTQtYTEyOS00MGU4MGZhMDM3OGIiLCJjbGllbnRTZWNyZXQiOiJkY1RTWEhZcXVya3BFSmJXIn0.Wqb7-emvkLrzQ3j22gw-I0wQijJHGWyJ3wa_zABm5Sg";

const API_URL = "http://4.224.186.213/evaluation-service/notifications";

// Priority weights as per requirement: Placement > Result > Event
const WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function getScore(notification) {
  const typeWeight = WEIGHTS[notification.Type] || 0;
  const timestamp = new Date(notification.Timestamp).getTime();
  return { ...notification, score: typeWeight * 1e12 + timestamp };
}

async function getPriorityInbox(topN = 10) {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const notifications = response.data.notifications;

    // Score each notification
    const scored = notifications.map(getScore);

    // Sort by score descending (highest priority first)
    scored.sort((a, b) => b.score - a.score);

    // Get top N
    const topNotifications = scored.slice(0, topN);

    console.log(`\n===== TOP ${topN} PRIORITY NOTIFICATIONS =====\n`);
    topNotifications.forEach((n, index) => {
      console.log(`#${index + 1}`);
      console.log(`  Type      : ${n.Type}`);
      console.log(`  Message   : ${n.Message}`);
      console.log(`  Timestamp : ${n.Timestamp}`);
      console.log(`  Score     : ${n.score}`);
      console.log("");
    });

  } catch (error) {
    console.error("Error fetching notifications:", error.message);
  }
}

getPriorityInbox(10);