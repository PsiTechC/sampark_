import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Alert from "../../components/ui/Alerts"; // Adjust path if different


function ConnectCalender() {
  const [isVerified, setIsVerified] = useState(null);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [status, setStatus] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });


  useEffect(() => {
    // Step 1: Verify user token
    fetch("/api/verify-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsVerified(!!data.isVerified);
      })
      .catch((err) => {
        console.error("Error verifying token:", err);
        setIsVerified(false);
      });
  }, []);

  useEffect(() => {
    if (isVerified === true) {
      // Step 2: Check calendar connection status
      fetch("/api/calendar/isverified")
        .then((res) => res.json())
        .then((data) => {
          setCalendarConnected(data.isCalendarConnected || false);
        })
        .catch((err) => {
          console.error("Error checking calendar connection:", err);
        });

      // Step 3: Handle code from Google redirect
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        fetch("/api/testcal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message === "Google tokens saved successfully") {
              setAlert({ type: "success", message: "✅ Google Calendar connected successfully.", visible: true });

              setCalendarConnected(true);
            } else {
              setStatus(`❌ Error: ${data.error || "Unknown error"}`);
            }
            window.history.replaceState(null, "", "/agents/ConnectCalender");
          })
          .catch((err) => {
            console.error("❌ Failed to save Google tokens:", err);
            setStatus("❌ Failed to connect Google Calendar.");
          });
      }
    }
  }, [isVerified]);


  const handleMondayConnect = () => {
    const mondayClientId = process.env.NEXT_PUBLIC_MONDAY_CLIENT_ID;
    const mondayRedirectUri = process.env.NEXT_PUBLIC_MONDAY_REDIRECT_URI;
  
    const authUrl = `https://auth.monday.com/oauth2/authorize?client_id=${mondayClientId}&redirect_uri=${mondayRedirectUri}&response_type=code`;
  
    window.open(authUrl, "_self");
  };

  
  const handleGoogleCalendarConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
    const scope = "https://www.googleapis.com/auth/calendar";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    window.open(authUrl, "_self");
  };

  const handleDisconnect = async () => {
    try {
      const res = await fetch("/api/calendar/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const result = await res.json();
  
      if (result.success) {
        setCalendarConnected(false);
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
    } catch (error) {
      console.error("Error disconnecting calendar:", error);
      setAlert({
        type: "error",
        message: "❌ Disconnect request failed.",
        visible: true,
      });
    }
  };
  


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col items-start p-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Connect Google Calendar</h1>

        {isVerified === false && (
          <p className="text-red-600 mb-4 text-sm font-medium">
          Your email is not verified or needs to be verified again to connect Google Calendar.{" "}
          <a
            href={process.env.NEXT_PUBLIC_API_BASE_URL}
            className="underline text-blue-600 hover:text-blue-800 ml-2"
          >
            Logout
          </a>
        </p>
        
        )}

        {isVerified && calendarConnected ? (
          <>
            <p className="text-green-700 text-sm mb-2">✅ Calendar is connected.</p>
            <button
              onClick={handleDisconnect}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Disconnect
            </button>
          </>
        ) : isVerified === true && (
          <button
            onClick={handleGoogleCalendarConnect}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm"
          >
            Connect Google Calendar
          </button>
        )}

        {status && (
          <p className="mt-4 text-sm font-medium text-blue-700">{status}</p>
        )}
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
