import { Link } from "react-router-dom";
import { useEffect } from "react";
import notFoundImg from "../assets/notfound.png"; 

export default function NotFound() {
  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
        <img
          src={notFoundImg}
          alt="Page not found"
          style={styles.image}
        />

        <h2 style={styles.heading}>
          Sorry, we couldn’t find that page.
        </h2>

        <p style={styles.text}>
          Try searching or go to the homepage.
        </p>

        <Link to="/home" style={styles.button}>
          GO TO HOMEPAGE
        </Link>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  content: {
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
  },
  image: {
    display: "block",
    margin: "0 auto 30px auto", // forces perfect center
    maxWidth: "400px",
    width: "100%",
    height: "auto",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#111",
  },
  text: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "25px",
  },
  button: {
    display: "inline-block",
    padding: "12px 28px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "600",
  },
};
