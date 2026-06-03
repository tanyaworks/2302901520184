import { NextResponse } from "next/server";

const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJqaGEudGFueWFhMTJAZ21haWwuY29tIiwiZXhwIjoxNzgwNDY2ODE3LCJpYXQiOjE3ODA0NjU5MTcsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI5YzVkMWUyZC04MzBkLTQwMzgtOGU2Mi1jN2U4OTVlZWI3MDYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJ0YW55YSBqaGEiLCJzdWIiOiJiM2I2Nzc5Yy0yMjI1LTQwNTQtYTEyOS00MGU4MGZhMDM3OGIifSwiZW1haWwiOiJqaGEudGFueWFhMTJAZ21haWwuY29tIiwibmFtZSI6InRhbnlhIGpoYSIsInJvbGxObyI6IjIzMDI5MDE1MjAxODQiLCJhY2Nlc3NDb2RlIjoic2RXV2djIiwiY2xpZW50SUQiOiJiM2I2Nzc5Yy0yMjI1LTQwNTQtYTEyOS00MGU4MGZhMDM3OGIiLCJjbGllbnRTZWNyZXQiOiJkY1RTWEhZcXVya3BFSmJXIn0.s0Q1xXS1TzzACEp1FIeU0Kpacg2pk6B4aoK_c80L2Ss";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || 10;
  const page = searchParams.get("page") || 1;
  const notification_type = searchParams.get("notification_type") || "";

  let url = `${API_URL}?limit=${limit}&page=${page}`;
  if (notification_type) url += `&notification_type=${notification_type}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  const data = await res.json();
  return NextResponse.json(data);
}