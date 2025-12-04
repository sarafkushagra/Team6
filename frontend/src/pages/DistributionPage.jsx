// src/pages/DistributionPage.jsx
import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc, query, collection, where, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function DistributionPage({ donationId }) {
  const [donation, setDonation] = useState(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!donationId) return;
    (async () => {
      const snap = await doc(db, "donations", donationId).get?.();
      // prefer getDoc; fallback using get
      try {
        const dref = doc(db, "donations", donationId);
        const dsnap = await dref.get?.();
      } catch(e){}
      const d = await (await import("firebase/firestore")).then(({ getDoc, doc: dref }) => getDoc(dref(db,"donations", donationId)));
      if (d.exists()) setDonation({ id: d.id, ...d.data() });
    })();
  }, [donationId]);

  useEffect(() => {
    // watch user's past distributed donations
    const u = auth.currentUser;
    if (!u) return;
    const q = query(collection(db, "donations"), where("status", "==", "DISTRIBUTED"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach(s => {
        const data = s.data();
        if (data.distributedBy === u.uid) arr.push({ id: s.id, ...data });
      });
      setHistory(arr);
    });
    return () => unsub();
  }, []);

  const onFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
    setPreviews(list.map(f => URL.createObjectURL(f)));
  };

  const markDistributed = async () => {
    if (!donation) return alert("Donation missing");
    if (files.length === 0) return alert("Upload at least 1 proof photo");
    setLoading(true);
    try {
      // upload files
      const uploadedUrls = [];
      for (const f of files) {
        const stRef = ref(storage, `distributionProof/${donation.id}/${Date.now()}-${f.name}`);
        const snap = await uploadBytes(stRef, f);
        const url = await getDownloadURL(snap.ref);
        uploadedUrls.push(url);
      }
      // update donation doc
      const dref = doc(db, "donations", donation.id);
      await updateDoc(dref, {
        status: "DISTRIBUTED",
        distributedAt: new Date().toISOString(),
        distributedBy: auth.currentUser.uid,
        distributionProof: uploadedUrls
      });
      alert("Marked distributed — thanks!");
      // refresh donation local
      const ds = await (await import("firebase/firestore")).then(({ getDoc, doc: dref2 }) => getDoc(dref2(db,"donations", donation.id)));
      if (ds.exists()) setDonation({ id: ds.id, ...ds.data() });
      setFiles([]); setPreviews([]);
    } catch (err) {
      console.error(err);
      alert("Failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:420, margin:"12px auto", fontFamily:"system-ui"}}>
      <div style={{background:"#fff", padding:12, borderRadius:10, boxShadow:"0 6px 18px rgba(0,0,0,0.06)"}}>
        <h3>Distribution & Proof</h3>
        <div style={{marginBottom:8}}>Donation: {donation?.foodType} • {donation?.quantityKg ? `${donation.quantityKg}kg` : ""}</div>
        <div style={{marginBottom:12}}>Upload photos showing delivery to recipient</div>
        <input type="file" accept="image/*" multiple onChange={onFiles} />
        <div style={{display:"flex", gap:8, marginTop:8, flexWrap:"wrap"}}>
          {previews.map((p,i)=> <img key={i} src={p} alt="preview" style={{width:90, height:90, objectFit:"cover", borderRadius:8}} />)}
        </div>
        <div style={{marginTop:12}}>
          <button onClick={markDistributed} style={btn} disabled={loading}>{loading ? "Uploading..." : "Mark Distributed"}</button>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <h4 style={{fontSize:16}}>Your distributed history</h4>
        <div style={{display:"grid", gap:8}}>
          {history.length===0 && <div style={{color:"#666"}}>No past distributions yet.</div>}
          {history.map(h => (
            <div key={h.id} style={{background:"#fff", padding:8, borderRadius:8, boxShadow:"0 4px 12px rgba(0,0,0,0.04)"}}>
              <div style={{fontWeight:700}}>{h.foodType} • {h.quantityKg ? `${h.quantityKg}kg` : ""}</div>
              <div style={{fontSize:13, color:"#555"}}>Distributed at: { new Date(h.distributedAt).toLocaleString() }</div>
              {Array.isArray(h.distributionProof) && h.distributionProof[0] && <img src={h.distributionProof[0]} alt="proof" style={{width:120, height:80, objectFit:"cover", marginTop:8, borderRadius:6}} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const btn = { padding:"8px 12px", borderRadius:8, border:"none", background:"#16a34a", color:"#fff", cursor:"pointer" };
