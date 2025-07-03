import { useEffect, useState } from "react";

const Dropdown = ({
  apiEndpoint = "/api/admin/get-clients",
  value,
  onChange,
  labelKey = "companyName",
  valueKey = "_id",
  placeholder = "Select Client",
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔍 Verify user role from the server
  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await fetch("/api/verify-token", { method: "POST" });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Verification failed");

        console.log("🔍 Verified user role:", data.role);
        if (data.role === "admin") {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("❌ Role verification failed:", err);
      }
    };

    checkRole();
  }, []);

  // 🔄 Fetch dropdown options only if admin
  useEffect(() => {
    const fetchOptions = async () => {
      if (!isAdmin) return;

      try {
        setLoading(true);
        const res = await fetch(apiEndpoint);
        const data = await res.json();

        if (res.ok) {
          setOptions(data.clients || data);
        } else {
          throw new Error(data.message || "Failed to fetch options");
        }
      } catch (err) {
        setError(err.message);
        console.error("Dropdown fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [apiEndpoint, isAdmin]);

  if (!isAdmin) return null;

  return (
    <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
      {loading ? (
        <p className="text-sm text-gray-500">Loading options...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border p-2 rounded text-sm"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option[valueKey]} value={option[valueKey]}>
              {option[labelKey]}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Dropdown;
