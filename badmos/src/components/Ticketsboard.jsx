// /src/components/TicketsBoard.js
import React, { useEffect, useState } from "react";

const API_URL = "https://api.quicksell.co/v1/internal/frontend-assignment";

const TicketsBoard = () => {
  const [tickets, setTickets] = useState([]); // Initialize as an empty array
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setTickets(Array.isArray(data) ? data : data.tickets || []);
      } catch (err) {
        setError("Failed to fetch tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const groupedTickets = Array.isArray(tickets)
    ? tickets.reduce((groups, ticket) => {
        const groupKey = ticket[groupBy];
        groups[groupKey] = groups[groupKey]
          ? [...groups[groupKey], ticket]
          : [ticket];
        return groups;
      }, {})
    : {};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Kanban Tickets Board</h1>

      <div style={styles.controls}>
        <label style={styles.label}>
          Group By:
          <select
            style={styles.select}
            onChange={(e) => setGroupBy(e.target.value)}
            value={groupBy}
          >
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </label>
        <label style={styles.label}>
          Sort By:
          <select
            style={styles.select}
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
          >
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <div style={styles.board}>
          {Object.keys(groupedTickets).map((group) => (
            <div key={group} style={styles.column}>
              <h2 style={styles.columnTitle}>{group}</h2>
              {groupedTickets[group]
                .sort((a, b) =>
                  sortBy === "priority"
                    ? b.priority - a.priority
                    : a.title.localeCompare(b.title)
                )
                .map((ticket) => (
                  <div key={ticket.id} style={styles.card}>
                    <h3 style={styles.cardTitle}>{ticket.title}</h3>
                    <p style={styles.cardText}>Priority: {ticket.priority}</p>
                    <p style={styles.cardText}>Status: {ticket.status}</p>
                    <p style={styles.cardText}>User: {ticket.user}</p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: "20px",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#f4f7fa",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "20px",
  },
  label: {
    fontSize: "16px",
    color: "#333",
  },
  select: {
    marginLeft: "8px",
    padding: "5px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  board: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    paddingBottom: "10px",
  },
  column: {
    minWidth: "200px",
    padding: "10px",
    backgroundColor: "#e0e7ff",
    borderRadius: "8px",
  },
  columnTitle: {
    textAlign: "center",
    fontSize: "20px",
    color: "#555",
    borderBottom: "2px solid #333",
    paddingBottom: "5px",
    marginBottom: "10px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "6px",
    padding: "10px",
    marginBottom: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "box-shadow 0.3s ease",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "8px",
  },
  cardText: {
    fontSize: "14px",
    color: "#666",
    margin: "4px 0",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#777",
  },
  error: {
    textAlign: "center",
    fontSize: "18px",
    color: "#d9534f",
  },
};

export default TicketsBoard;
