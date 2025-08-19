import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();   // ✅ from AuthContext
  const navigate = useNavigate(); // ✅ for redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = { name, email, password };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // ✅ store in AuthContext
      login(data.user, data.token);

      // ✅ redirect
      navigate("/dashboard");
    } catch (err) {
      console.error("Register error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
      <h2>Create account</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginTop: 12 }}>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />

        <label style={{ display: "block", marginTop: 12 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />

        <label style={{ display: "block", marginTop: 12 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 18, padding: "10px 14px" }}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {error && (
          <div style={{ color: "red", marginTop: 10 }}>{error}</div>
        )}
      </form>
    </div>
  );
}
