const axios = require("axios");
const { Log } = require("../logging_midddleware/logger");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJqaGEudGFueWFhMTJAZ21haWwuY29tIiwiZXhwIjoxNzgwNDY5ODE1LCJpYXQiOjE3ODA0Njg5MTUsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJhYmJjNTVmOC0zNmRlLTQzYjctOGEyNi03MmQ2YzMyMzg2MGIiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJ0YW55YSBqaGEiLCJzdWIiOiJiM2I2Nzc5Yy0yMjI1LTQwNTQtYTEyOS00MGU4MGZhMDM3OGIifSwiZW1haWwiOiJqaGEudGFueWFhMTJAZ21haWwuY29tIiwibmFtZSI6InRhbnlhIGpoYSIsInJvbGxObyI6IjIzMDI5MDE1MjAxODQiLCJhY2Nlc3NDb2RlIjoic2RXV2djIiwiY2xpZW50SUQiOiJiM2I2Nzc5Yy0yMjI1LTQwNTQtYTEyOS00MGU4MGZhMDM3OGIiLCJjbGllbnRTZWNyZXQiOiJkY1RTWEhZcXVya3BFSmJXIn0.P8Ool18s0P12E8MHnLD1yMMb12cWtEq7o2zIlfhBM1k";

const API_URL = "http://4.224.186.213/evaluation-service/notifications";

const WEIGHTS = { Placement: 3, Result: 2, Event: 1 };

function getScore(notification) {
  const typeWeight = WEIGHTS[notification.Type] || 0;
  const timestamp = new Date(notification.Timestamp).getTime();
  return { ...notification, score: typeWeight * 1e12 + timestamp };
}

async function getPriorityInbox(topN = 10) {
  await Log("backend", "info", "service", "Fetching notifications from API");

  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    const notifications = response.data.notifications;
    await Log("backend", "info", "service", `Fetched ${notifications.length} notifications successfully`);

    const scored = notifications.map(getScore);
    scored.sort((a, b) => b.score - a.score);
    const topNotifications = scored.slice(0, topN);

    await Log("backend", "info", "service", `Returning top ${topN} priority notifications`);

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
    await Log("backend", "error", "service", `Failed to fetch notifications: ${error.message}`);
    console.error("Error fetching notifications:", error.message);
  }
}

getPriorityInbox(10);
