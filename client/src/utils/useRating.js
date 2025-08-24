// utils/useRating.js
"use client";
import { useCallback, useEffect, useState } from "react";

export default function useRating(productId) {
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [myRating, setMyRating] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = useCallback(async () => {
    if (!apiBase || !productId) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/ratings/${productId}`, { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        const d = json?.data || {};
        setAverage(Number(d.average || 0));
        setCount(Number(d.count || 0));
        setMyRating(d.myRating ?? null);
      }
    } finally {
      setLoading(false);
    }
  }, [apiBase, productId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const rate = useCallback(
    async (value) => {
      if (!apiBase) return;
      // optimistic
      const prev = { average, count, myRating };
      try {
        setMyRating(value);
        const res = await fetch(`${apiBase}/api/ratings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId, value }),
        });
        if (!res.ok) throw new Error("Rating failed");
        const json = await res.json();
        const d = json?.data || {};
        setAverage(Number(d.average || 0));
        setCount(Number(d.count || 0));
        setMyRating(d.myRating ?? value);
      } catch (e) {
        // revert
        setAverage(prev.average); setCount(prev.count); setMyRating(prev.myRating);
        throw e;
      }
    },
    [apiBase, productId, average, count, myRating]
  );

  const removeMyRating = useCallback(async () => {
    if (!apiBase) return;
    const prev = { average, count, myRating };
    try {
      setMyRating(null);
      const res = await fetch(`${apiBase}/api/ratings/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Remove failed");
      const json = await res.json();
      const d = json?.data || {};
      setAverage(Number(d.average || 0));
      setCount(Number(d.count || 0));
      setMyRating(null);
    } catch (e) {
      // revert
      setAverage(prev.average); setCount(prev.count); setMyRating(prev.myRating);
      throw e;
    }
  }, [apiBase, productId, average, count, myRating]);

  return { average, count, myRating, rate, removeMyRating, loading, refresh: fetchData };
}