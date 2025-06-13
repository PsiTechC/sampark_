import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Alert from "../../components/ui/Alerts";

function ConnectCalender() {
  const [isVerified, setIsVerified] = useState(null);
  const [calendarStates, setCalendarStates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState("");


  const [status, setStatus] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });

  // Verify user on load
  useEffect(() => {
    fetch("/api/verify-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then(res => res.json())
      .then(data => setIsVerified(!!data.isVerified))
      .catch(() => setIsVerified(false));
  }, []);

  // On token success, detect calendar count
  useEffect(() => {
    if (isVerified) {
      fetch("/api/calendar/isverified")
        .then(res => res.json())
        .then(data => {
          if (data.connectedCalendars?.length > 0) {
            setCalendarStates(data.connectedCalendars.map((cal, index) => ({
              connected: true,
              accessField: cal.accessField,
              refreshField: cal.refreshField,
              calendarName: cal.calendarName || `Calendar ${index + 1}`,
            })));
          }
        });


      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        fetch("/api/testcal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })
          .then(res => res.json())
          .then(async (data) => {
            if (data.message === "Google tokens saved successfully") {
              setAlert({
                type: "success",
                message: "✅ Google Calendar connected successfully.",
                visible: true,
              });

              const result = await fetch("/api/calendar/isverified").then(r => r.json());
              if (result.connectedCalendars?.length > 0) {
                setCalendarStates(
                  result.connectedCalendars.map((cal, index) => ({
                    connected: true,
                    accessField: cal.accessField,
                    refreshField: cal.refreshField,
                    calendarName: cal.calendarName || `Calendar ${index + 1}`,
                  }))
                );
              } else {
                setCalendarStates([]);
              }
              
            } else {
              setStatus(`❌ Error: ${data.error || "Unknown error"}`);
            }

            // Clean URL
            window.history.replaceState(null, "", "/agents/ConnectCalender");
          })
          .catch(() => setStatus("❌ Failed to connect Google Calendar."));
      }
    }
  }, [isVerified]);

  const handleGoogleCalendarConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
    const scope = "https://www.googleapis.com/auth/calendar";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    window.open(authUrl, "_self");
  };


  const handleDisconnect = async (index) => {
    const calendar = calendarStates[index];
    try {
      const res = await fetch("/api/calendar/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessField: calendar.accessField,
          refreshField: calendar.refreshField
        })
      });

      const result = await res.json();

      if (result.success) {
        // 🔁 Re-fetch updated list from backend
        const response = await fetch("/api/calendar/isverified");
        const data = await response.json();

        if (data.connectedCalendars?.length > 0) {
          setCalendarStates(
            data.connectedCalendars.map((cal, index) => ({
              connected: true,
              accessField: cal.accessField,
              refreshField: cal.refreshField,
              calendarName: cal.calendarName || `Calendar ${index + 1}`,
            }))
          );
        } else {
          setCalendarStates([]); // no calendars left
        }

        setAlert({
          type: "success",
          message: "🛑 Google Calendar disconnected.",
          visible: true,
        });
      } else {
        setAlert({
          type: "error",
          message: "❌ Failed to disconnect: " + (result.message || ""),
          visible: true,
        });
      }
    } catch {
      setAlert({
        type: "error",
        message: "❌ Disconnect request failed.",
        visible: true,
      });
    }
  };


  const addNewCalendar = () => {
    setNewCalendarName("");
    setIsModalOpen(true);
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col items-start p-8 space-y-4 w-full">
        <div className="w-full flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Connect Google Calendar</h1>
          <button
            onClick={addNewCalendar}
            className="text-green-700 underline text-sm px-2 py-1 hover:text-green-800"
          >
            + Add another calendar
          </button>

        </div>

        {isVerified === false && (
          <p className="text-red-600 text-sm font-medium">
            Your email is not verified.{" "}
            <a href={process.env.NEXT_PUBLIC_API_BASE_URL} className="underline text-blue-600 ml-2">
              Logout
            </a>
          </p>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Name this Calendar</h2>
              <input
                type="text"
                value={newCalendarName}
                onChange={(e) => setNewCalendarName(e.target.value)}
                className="border p-2 w-full mb-4"
                placeholder="e.g., Sales Team Calendar"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:underline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    document.cookie = `pendingCalendarName=${encodeURIComponent(newCalendarName)}; path=/`;

                    setIsModalOpen(false);
                    handleGoogleCalendarConnect(); // trigger auth
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        )}


        {isVerified && (
          <>
            {calendarStates.length === 0 ? (
              <button
                onClick={() => {
                  setNewCalendarName("");
                  setIsModalOpen(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm mb-4"
              >
                Connect Google Calendar
              </button>
            ) : (
              calendarStates.map((cal, index) => (
                <div key={index} className="w-full">
                  {cal.connected ? (
                    <>
                      <p className="text-green-700 text-sm mb-1">✅ Calendar {index + 1} is connected.</p>
                      <button
                        onClick={() => handleDisconnect(index)}
                        className="bg-red-600 text-white px-4 py-2 rounded text-sm mb-4"
                      >
                        Disconnect {cal.calendarName}'s Calendar
                      </button>

                    </>
                  ) : (
                    <button
                      onClick={() => handleGoogleCalendarConnect(index)}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm mb-4"
                    >
                      Connect Google Calendar {calendarStates.length > 1 ? `(${index + 1})` : ""}
                    </button>
                  )}
                </div>
              ))
            )}
          </>
        )}


        {status && <p className="text-sm font-medium text-blue-700">{status}</p>}
      </div>

      {alert.visible && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, visible: false })}
          onConfirm={alert.onConfirm}
          isConfirm={alert.isConfirm}
        />
      )}
    </div>
  );
}

export default ConnectCalender;
