const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJqaGEudGFueWFhMTJAZ21haWwuY29tIiwiZXhwIjoxNzgwNDY5ODE1LCJpYXQiOjE3ODA0Njg5MTUsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJhYmJjNTVmOC0zNmRlLTQzYjctOGEyNi03MmQ2YzMyMzg2MGIiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJ0YW55YSBqaGEiLCJzdWIiOiJiM2I2Nzc5Yy0yMjI1LTQwNTQtYTEyOS00MGU4MGZhMDM3OGIifSwiZW1haWwiOiJqaGEudGFueWFhMTJAZ21haWwuY29tIiwibmFtZSI6InRhbnlhIGpoYSIsInJvbGxObyI6IjIzMDI5MDE1MjAxODQiLCJhY2Nlc3NDb2RlIjoic2RXV2djIiwiY2xpZW50SUQiOiJiM2I2Nzc5Yy0yMjI1LTQwNTQtYTEyOS00MGU4MGZhMDM3OGIiLCJjbGllbnRTZWNyZXQiOiJkY1RTWEhZcXVya3BFSmJXIn0.P8Ool18s0P12E8MHnLD1yMMb12cWtEq7o2zIlfhBM1k";

const LOG_API = "http://4.224.186.213/evaluation-service/logs";

async function Log(stack, level, package_name, message) {
  try {
    const res = await fetch(LOG_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: package_name,
        message,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Logging failed:", error.message);
  }
}

module.exports = { Log };