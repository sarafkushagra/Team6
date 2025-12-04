// src/pages/AuthOnboardPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const styles = {
  container: { maxWidth: 420, margin: "24px auto", fontFamily: "system-ui, Roboto, Arial" },
  card: { background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", marginBottom: 12 },
  title: { textAlign: "center", marginBottom: 10 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", marginTop: 8 },
  btn: { padding: "10px 14px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
  btnGhost: { padding: "10px 14px", background: "transparent", color: "#333", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer" },
  small: { fontSize: 13, color: "#555", marginTop: 8 }
};

export default function AuthOnboardPage() {
  const [step, setStep] = useState("auth"); // auth, otp, location, profile, done
  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);

  // profile
  const [coords, setCoords] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("VOLUNTEER");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // cleanup preview object url when file changes/unmount
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Setup invisible reCAPTCHA only once when needed
    if (!recaptchaRef.current && typeof window !== "undefined") {
      try {
        recaptchaRef.current = new RecaptchaVerifier(
          "recaptcha-container",
          { size: "invisible" },
          auth
        );
      } catch (e) {
        // ignore if already set
      }
    }
  }, []);

  // --- Auth / OTP functions ---
  const sendOtp = async () => {
    if (!/^\+\d{10,15}$/.test(phone)) {
      alert("Phone number dalo in E.164 format (example: +919876543210)");
      return;
    }
    setLoading(true);
    try {
      const appVerifier = recaptchaRef.current;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      setStep("otp");
    } catch (err) {
      console.error(err);
      alert("OTP bhejne me error: " + (err.message || err));
      // try resetting recaptcha if available
      try { if (recaptchaRef.current) recaptchaRef.current.clear(); } catch(e){}
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!confirmationResult) return alert("No confirmation result, send OTP first");
    if (!otp.trim()) return alert("OTP daalo");
    setLoading(true);
    try {
      await confirmationResult.confirm(otp.trim());
      // signed in
      setStep("location");
    } catch (err) {
      console.error(err);
      alert("OTP verify failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await signOut(auth); setStep("auth"); setConfirmationResult(null); } catch(e){ console.error(e) }
  };

  // --- Location ---
  const askLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser geolocation supported nahi hai");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
        setStep("profile");
      },
      (err) => {
        console.error(err);
        setLoading(false);
        const useManual = window.confirm("Location access denied. Enter approximate coords manually?");
        if (useManual) {
          const lat = parseFloat(prompt("Latitude (e.g., 28.6)"));
          const lng = parseFloat(prompt("Longitude (e.g., 77.2)"));
          if (!isNaN(lat) && !isNaN(lng)) {
            setCoords({ lat, lng });
            setStep("profile");
          } else alert("Invalid values");
        }
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // --- Profile save ---
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return alert("Not signed in");
      if (!name.trim()) { alert("Name daalna zaroori hai"); setLoading(false); return; }

      let photoURL = null;
      if (file) {
        const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}-${file.name}`);
        const snap = await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(snap.ref);
      }

      const userDoc = {
        uid: user.uid,
        name: name.trim(),
        role,
        phoneNumber: user.phoneNumber || phone,
        photoURL,
        location: coords || null,
        verified: false,
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, "users", user.uid), userDoc);
      setStep("done");
    } catch (err) {
      console.error(err);
      alert("Profile save failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // --- Render per step ---
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Receiver Onboarding — Food Pickup</h1>

      {step === "auth" && (
        <div style={styles.card}>
          <h2>Login / Sign up (Phone)</h2>
          <p style={styles.small}>Enter phone in international format e.g. +919876543210</p>
          <input
            style={styles.input}
            placeholder="+91..."
            value={phone}
            onChange={(e) => setPhone(e.target.value.trim())}
          />
          <div id="recaptcha-container" style={{ marginTop: 8 }}></div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button style={styles.btn} onClick={sendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
          <p style={styles.small}>For dev: you can set test phone numbers in Firebase console to avoid actual SMS.</p>
        </div>
      )}

      {step === "otp" && (
        <div style={styles.card}>
          <h2>Enter OTP</h2>
          <input
            style={styles.input}
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.trim())}
          />
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <button style={styles.btn} onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button style={styles.btnGhost} onClick={() => { setStep("auth"); setConfirmationResult(null); }}>
              Back
            </button>
          </div>
        </div>
      )}

      {step === "location" && (
        <div style={styles.card}>
          <h2>Location Access</h2>
          <p style={styles.small}>We need your location to send nearby donation alerts.</p>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button style={styles.btn} onClick={askLocation} disabled={loading}>
              {loading ? "Getting..." : "Allow Location"}
            </button>
            <button style={styles.btnGhost} onClick={() => { setCoords(null); setStep("profile"); }}>
              Skip
            </button>
          </div>
        </div>
      )}

      {step === "profile" && (
        <div style={styles.card}>
          <h2>Profile Setup</h2>
          <input
            style={styles.input}
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div style={{ marginTop: 8 }}>
            <label style={{ fontSize: 13 }}>Role</label>
            <select style={{ ...styles.input, marginTop: 6 }} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="VOLUNTEER">Volunteer</option>
              <option value="NGO">NGO</option>
            </select>
          </div>

          <div style={{ marginTop: 8 }}>
            <label style={{ fontSize: 13 }}>Profile photo (optional)</label>
            <input style={{ marginTop: 6 }} type="file" accept="image/*" onChange={onFileChange} />
            {preview && <img src={preview} alt="preview" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, marginTop: 8 }} />}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button style={styles.btn} onClick={saveProfile} disabled={loading}>
              {loading ? "Saving..." : "Save & Continue"}
            </button>
            <button style={styles.btnGhost} onClick={logout}>Logout</button>
          </div>
          <div style={styles.small}>
            <div>Location: {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Not provided"}</div>
          </div>
        </div>
      )}

      {step === "done" && (
        <div style={styles.card}>
          <h2>Onboarding complete 🎉</h2>
          <p style={styles.small}>Aapka profile save ho gaya hai. Ab aap nearby donation alerts dekh sakte hain.</p>
          <div style={{ marginTop: 12 }}>
            <button style={styles.btn} onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 8 }}>
        <small style={{ color: "#666" }}>Built for hackathon demo — Firebase required.</small>
      </div>
    </div>
  );
}
