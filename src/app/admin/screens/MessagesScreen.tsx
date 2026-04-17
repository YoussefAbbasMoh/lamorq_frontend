"use client";

import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useAdmin } from "../admin-context";
import { loadAdminMessages } from "../loaders";

export function MessagesScreen() {
  const {
    t,
    isRTL,
    messages,
    searchQuery,
    setSearchQuery,
    messageStatusFilter,
    setMessageStatusFilter,
    handleViewMessage,
    handleToggleMessageStatus,
    handleDeleteMessage,
    setMessages,
  } = useAdmin();

  useEffect(() => {
    let cancelled = false;
    loadAdminMessages()
      .then((list) => {
        if (!cancelled) setMessages(list);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          alert(err instanceof Error ? err.message : "Failed to load messages");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [setMessages]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl text-foreground">{t.messages}</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring w-64"
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            value={messageStatusFilter}
            onChange={(e) => setMessageStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm text-gray-600`}>ID</th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm text-gray-600`}>Name</th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm text-gray-600`}>Email</th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm text-gray-600`}>Phone</th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm text-gray-600`}>
                  Subject
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm text-gray-600`}>Date</th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm text-gray-600`}>
                  Status
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm text-gray-600`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {messages
                .filter((message) => {
                  const q = searchQuery.trim().toLowerCase();
                  const matchesSearch =
                    q === "" ||
                    message.id.toString().includes(q) ||
                    message.firstName.toLowerCase().includes(q) ||
                    message.email.toLowerCase().includes(q) ||
                    message.subject.toLowerCase().includes(q);
                  const matchesStatus =
                    messageStatusFilter === "" ||
                    (messageStatusFilter === "read" && message.status === "read") ||
                    (messageStatusFilter === "unread" && message.status === "unread");
                  return matchesSearch && matchesStatus;
                })
                .map((message) => (
                  <tr key={message.id} className="border-b border-gray-100">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{message.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{message.firstName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{message.email || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{message.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{message.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{message.date}</td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleMessageStatus(message.id)}
                        className={`text-xs px-3 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                          message.status === "unread"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {message.status}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void handleViewMessage(message)}
                          className="text-primary text-sm hover:underline"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteMessage(message.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
