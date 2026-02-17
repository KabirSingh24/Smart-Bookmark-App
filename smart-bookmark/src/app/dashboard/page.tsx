"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/");
        return;
      }

      setUser(data.user);
      setLoading(false);
    };

    getUser();
  }, [router]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setBookmarks(data);
      }
    };

    fetchBookmarks();

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBookmarks();
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addBookmark = async () => {
    if (!title.trim() || !url.trim()) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .insert([{ title, url, user_id: user.id }])
      .select()
      .single();

    if (!error && data) {
      setBookmarks((prev) => [data, ...prev]);
    }

    setTitle("");
    setUrl("");
  };

  const deleteBookmark = async (id: string) => {
    // Optimistically remove from UI first
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Smart Bookmark</h1>
            <p className="text-sm text-gray-500 mt-1">
              {user?.email?.charAt(0).toUpperCase()} is logged in
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Add Bookmark Card */}
        <div className="bg-white shadow-sm rounded-2xl p-6 mb-8 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Add New Bookmark
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Bookmark Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-gray-800 placeholder-gray-400 bg-white transition"
            />

            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-gray-800 placeholder-gray-400 bg-white transition"
            />

            <button
              onClick={addBookmark}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-medium transition cursor-pointer"
            >
              Add Bookmark
            </button>
          </div>
        </div>

        {/* Bookmark List */}
        <div className="space-y-4">
          {bookmarks.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm border border-gray-100">
              No bookmarks yet.
            </div>
          )}

          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <p className="text-sm text-gray-500 mt-1 truncate max-w-md">
                  {bookmark.created_at.split("T")[0]}
                </p>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-gray-800 hover:underline"
                >
                  {bookmark.title}
                </a>
                <p className="text-sm text-gray-500 mt-1 truncate max-w-md">
                  {bookmark.url}
                </p>
              </div>

              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="text-sm text-red-500 hover:text-red-700 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
