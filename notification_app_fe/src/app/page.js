"use client";
import { useEffect, useState } from "react";
import { fetchNotifications } from "@/lib/api";
import {
  Box, Typography, Chip, CircularProgress, Alert,
  Container, AppBar, Toolbar, Button, Badge
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Link from "next/link";

export default function Home() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readIds, setReadIds] = useState(new Set());

  useEffect(() => {
    fetchNotifications({ limit: 10 })
      .then((data) => {
        console.log("notifications:", data);
        setNotifications(data);
        setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const markRead = (id) => setReadIds((prev) => new Set([...prev, id]));

  const typeColor = { Placement: "success", Result: "primary", Event: "warning" };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AppBar position="static" sx={{ bgcolor: "#1a237e" }}>
        <Toolbar>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Campus Notifications</Typography>
          <Button color="inherit" component={Link} href="/priority">Priority Inbox</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          All Notifications
          <Badge badgeContent={notifications.filter(n => !readIds.has(n.ID)).length} color="error" sx={{ ml: 2 }} />
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {notifications.map((n) => (
          <Box
            key={n.ID}
            onClick={() => markRead(n.ID)}
            sx={{
              bgcolor: readIds.has(n.ID) ? "#fff" : "#e8eaf6",
              border: readIds.has(n.ID) ? "1px solid #ddd" : "2px solid #1a237e",
              borderRadius: 2, p: 2, mb: 2, cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { boxShadow: 3 }
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Chip label={n.Type} color={typeColor[n.Type] || "default"} size="small" />
              {!readIds.has(n.ID) && <Chip label="NEW" color="error" size="small" />}
            </Box>
            <Typography variant="body1" fontWeight="bold" mt={1}>{n.Message}</Typography>
            <Typography variant="caption" color="text.secondary">{n.Timestamp}</Typography>
          </Box>
        ))}
      </Container>
    </Box>
  );
}