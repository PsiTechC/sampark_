// import React, { useEffect, useState } from "react";
// import Sidebar from "@/components/sidebar";

// function ConnectCalender() {
//   const [isVerified, setIsVerified] = useState(null);
//   const [status, setStatus] = useState("");

//   useEffect(() => {
//     // 1. Verify user on mount
//     fetch("/api/verify-token", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({}), // Token is in httpOnly cookie
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.isVerified) {
//           console.log("✅ User is verified");
//           setIsVerified(true);
//         } else {
//           console.log("❌ User is not verified");
//           setIsVerified(false);
//         }
//       })
//       .catch((err) => {
//         console.error("Error verifying token:", err);
//         setIsVerified(false);
//       });

//     // 2. Handle Google OAuth code from URL
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get("code");

//     if (code) {
//       fetch("/api/testcal", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code }), // Backend reads token from cookie
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.message === "Google tokens saved successfully") {
//             setStatus("✅ Google Calendar connected successfully.");
//           } else {
//             setStatus(`❌ Error: ${data.error || "Unknown error"}`);
//           }
//           // Clean up query param
//           window.history.replaceState(null, "", "/agents/ConnectCalender");
//         })
//         .catch((err) => {
//           console.error("❌ Failed to save Google tokens:", err);
//           setStatus("❌ Failed to connect Google Calendar.");
//         });
//     }
//   }, []);

//   const handleGoogleCalendarConnect = () => {
//     const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
//     const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
//     const scope = "https://www.googleapis.com/auth/calendar";

//     const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

//     window.open(authUrl, "_self");
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex flex-col items-start p-8">
//         <h1 className="text-2xl font-bold mb-4 text-gray-800">Connect Google Calendar</h1>

//         {isVerified === false && (
//           <p className="text-red-600 mb-4 text-sm font-medium">Please verify your email before connecting calendar.</p>
//         )}

//         <button
//           onClick={handleGoogleCalendarConnect}
//           className="bg-green-600 text-white px-4 py-2 rounded text-sm"
//           disabled={isVerified === false}
//         >
//           Connect Google Calendar
//         </button>

//         {status && (
//           <p className="mt-4 text-sm font-medium text-blue-700">{status}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ConnectCalender;

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
          <p className="text-red-600 mb-4 text-sm font-medium">Please verify your email before connecting calendar.</p>
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
