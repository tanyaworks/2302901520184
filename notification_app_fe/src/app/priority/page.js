"use client";
import { useEffect, useState } from "react";
import { fetchNotifications, getTopN } from "@/lib/api";
import {
  Box, Typography, Chip, CircularProgress, Alert,
  Container, AppBar, Toolbar, Button, Select,
  MenuItem, FormControl, InputLabel, TextField
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchNotifications({ limit: 10, notification_type: filterType })
      .then((data) => { setNotifications(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [filterType]);

  const typeColor = { Placement: "success", Result: "primary", Event: "warning" };
  const priorityNotifications = getTopN(notifications, topN);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AppBar position="static" sx={{ bgcolor: "#1a237e" }}>
        <Toolbar>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Campus Notifications</Typography>
          <Button color="inherit" component={Link} href="/">All Notifications</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          <StarIcon sx={{ mr: 1, color: "#ffd600" }} />
          Priority Inbox
        </Typography>

        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            label="Top N notifications"
            type="number"
            size="small"
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
            inputProps={{ min: 1, max: 50 }}
            sx={{ width: 180 }}
          />
          <FormControl size="small" sx={{ width: 180 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select value={filterType} label="Filter by Type" onChange={(e) => setFilterType(e.target.value)}>
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {priorityNotifications.map((n, index) => (
          <Box
            key={n.ID}
            sx={{
              bgcolor: "#fff",
              border: "1px solid #ddd",
              borderLeft: `4px solid ${n.Type === "Placement" ? "#4caf50" : n.Type === "Result" ? "#1976d2" : "#ff9800"}`,
              borderRadius: 2, p: 2, mb: 2,
              "&:hover": { boxShadow: 3 }
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                #{index + 1}
              </Typography>
              <Chip label={n.Type} color={typeColor[n.Type] || "default"} size="small" />
            </Box>
            <Typography variant="body1" fontWeight="bold" mt={1}>{n.Message}</Typography>
            <Typography variant="caption" color="text.secondary">{n.Timestamp}</Typography>
          </Box>
        ))}
      </Container>
    </Box>
  );
}