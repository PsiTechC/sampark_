


// C:\botGIT\botGIT-main\pages\agents\numbers.js
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";

// Helper to display dates like "11th Mar, 2025"
function formatDateOrdinal(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day}${suffix} ${month}, ${year}`;
}

function getOrdinalSuffix(day) {
  // Handle teens 11th, 12th, 13th
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export default function NumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch phone numbers from your API
  const fetchPhoneNumbers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.bolna.dev/phone-numbers/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch phone numbers");
      }

      const data = await response.json();
      setPhoneNumbers(data);
    } catch (err) {
      console.error("❌ Error fetching phone numbers:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  // Placeholder for unlinking an agent from a phone
  const unlinkAgentFromPhone = (phoneId) => {
    console.log("Unlinking agent from phone with ID:", phoneId);
    // Add your real API call here
  };

  // Placeholder for deleting a phone
  const deletePhone = (phoneId) => {
    console.log("Deleting phone with ID:", phoneId);
    // Add your real API call here
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content on the right with top and horizontal margins */}
      <main className="flex-grow p-6 bg-white text-black mt-8 mx-4">
        {/* Header row: Title + "Buy phone number" button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">📞 Phone Numbers</h2>
          <button
            onClick={() => console.log("Buying a phone number...")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Buy phone number
          </button>
        </div>

        {/* Loading, Error, or No Data States */}
        {loading && <p>Loading phone numbers...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && !error && phoneNumbers.length === 0 && (
          <p>No phone numbers available.</p>
        )}

        {/* Table of phone numbers */}
        {!loading && !error && phoneNumbers.length > 0 && (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border text-left">Phone number</th>
                  <th className="px-4 py-2 border text-left">
                    Agent answering this phone number
                  </th>
                  <th className="px-4 py-2 border text-left">Telephony</th>
                  <th className="px-4 py-2 border text-left">Bought on</th>
                  <th className="px-4 py-2 border text-left">Renews on</th>
                  <th className="px-4 py-2 border text-left">Monthly rent</th>
                  <th className="px-4 py-2 border text-left">
                    Unlink agent from phone
                  </th>
                  <th className="px-4 py-2 border text-left">Delete phone</th>
                </tr>
              </thead>
              <tbody>
                {phoneNumbers.map((phone) => (
                  <tr key={phone.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border">
                      {phone.phone_number || "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      {phone.agent_name || phone.agent_id || "—"}
                    </td>
                    <td className="px-4 py-2 border">
                      {phone.telephony_provider || "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      {formatDateOrdinal(phone.created_at)}
                    </td>
                    <td className="px-4 py-2 border">
                      {formatDateOrdinal(phone.renewal_at)}
                    </td>
                    <td className="px-4 py-2 border">
                      {phone.price || "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => unlinkAgentFromPhone(phone.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Unlink agent
                      </button>
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => deletePhone(phone.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
