import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>

      <p style={styles.text}>
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <Link to="/" style={styles.button}>
        Go Back Home
      </Link>
    </div>
  );
}

// Inline styles for simplicity
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f6fa",
    textAlign: "center",
    padding: "20px",
  },
  code: {
    fontSize: "6rem",
    fontWeight: "bold",
    color: "#ff4757",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "10px",
    color: "#2f3542",
  },
  text: {
    fontSize: "1rem",
    color: "#57606f",
    marginBottom: "20px",
    maxWidth: "400px",
  },
  button: {
    textDecoration: "none",
    padding: "10px 20px",
    background: "#3742fa",
    color: "#fff",
    borderRadius: "6px",
    fontWeight: "bold",
  },
};
