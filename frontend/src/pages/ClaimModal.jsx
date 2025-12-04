import React, { useEffect, useState, useRef } from "react";
import { doc, runTransaction, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function ClaimModal({
  donationId,
  onClose,
  onClaimed,
  claimWindowMinutes = 30,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(null); // seconds left (local)
  const dialogRef = useRef(null);

  // focus + escape
  useEffect(() => {
    const timer = setTimeout(() => {
      dialogRef.current?.querySelector("button")?.focus();
    }, 0);
    const onKey = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // read existing donation doc to show server-based countdown if available
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const donationRef = doc(db, "donations", donationId);
        const snap = await getDoc(donationRef);
        if (!mounted || !snap.exists()) return;
        const data = snap.data();
        if (data?.claimExpires) {
          const expiresAt = Date.parse(data.claimExpires);
          const secs = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
          setCountdown(secs > 0 ? secs : 0);
        } else {
          setCountdown(null);
        }
      } catch (e) {
        // non-fatal — keep UI usable
        console.warn("Could not load donation doc:", e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [donationId]);

  // countdown tick
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(0);
      return;
    }
    const id = setInterval(() => setCountdown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const formatTime = (secs) => {
    if (secs == null) {
      const m = String(claimWindowMinutes).padStart(2, "0");
      return `${m}:00`;
    }
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const confirmClaim = async () => {
    setError("");
    setSuccess("");
    const user = auth.currentUser;
    if (!user) return setError("Login required. Please sign in first.");
    if (!window.confirm("Confirm claim? You will have limited time to pickup.")) return;

    setLoading(true);
    try {
      const donationRef = doc(db, "donations", donationId);
      await runTransaction(db, async (t) => {
        const ds = await t.get(donationRef);
        if (!ds.exists()) throw new Error("Donation has been removed.");
        const data = ds.data();
        if (data.status !== "ACTIVE") throw new Error("Already claimed or not active.");

        const claimExpires = new Date(Date.now() + claimWindowMinutes * 60 * 1000).toISOString();
        t.update(donationRef, {
          status: "CLAIMED",
          claimedBy: user.uid,
          claimedAt: new Date().toISOString(),
          claimExpires,
        });
      });

      // start local countdown (claim window)
      setCountdown(claimWindowMinutes * 60);
      setSuccess("Claim successful — go pickup! OTP will be used for verification.");
      onClaimed && onClaimed();

      // auto-close shortly after success, but allow user to see message
      setTimeout(() => {
        onClose && onClose();
      }, 1100);
    } catch (err) {
      console.error("Claim error", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  // close when clicking overlay (but not when clicking inside modal); prevent close during loading
  const onOverlayClick = (e) => {
    if (loading) return;
    if (e.target === e.currentTarget) onClose && onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      aria-hidden={false}
      onClick={onOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-modal-title"
        aria-describedby="claim-modal-desc"
        className="bg-white rounded-2xl shadow-lg w-[92%] max-w-md p-6 border-2 border-green-100 relative"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="claim-modal-title" className="text-lg font-semibold text-green-900">
              Confirm Claim
            </h3>
            <p id="claim-modal-desc" className="mt-2 text-sm text-green-800/90">
              You will have <span className="font-medium">{claimWindowMinutes} minutes</span> to reach the donor. OTP will be used at pickup for verification.
            </p>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-green-50 transition"
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M6 18L18 6" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-100 text-green-800 text-sm">
            {success}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs text-green-700/90">Pickup window</div>
            <div className="mt-1 text-xl font-mono text-green-900">{formatTime(countdown)}</div>
            <div className="mt-2 text-xs text-slate-600">Bring a valid ID. Share OTP with donor only at pickup.</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={confirmClaim}
              disabled={loading}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-white font-medium transition ${loading ? "opacity-60 cursor-not-allowed" : "bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"}`}
            >
              {loading ? (
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="3" strokeOpacity="0.25" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 5v14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
              <span>{loading ? "Claiming..." : "Confirm & Claim"}</span>
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className="px-3 py-2 rounded-lg bg-white border border-green-200 text-green-800 text-sm hover:bg-green-50 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-500">By claiming you agree to pick up within the time window and follow donor instructions.</div>

        {/* loading overlay to prevent accidental interactions */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl">
            <div className="flex items-center gap-2 text-sm text-green-900">
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#064e3b" strokeWidth="3" strokeOpacity="0.25" />
                <path d="M22 12a10 10 0 00-10-10" stroke="#064e3b" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Processing…
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
