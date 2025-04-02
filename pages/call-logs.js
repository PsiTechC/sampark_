


// C:\botGIT\botGIT-main\pages\call-logs.js

import { useEffect, useState } from 'react';

const CallLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/call-logs');
        const data = await response.json();
        setLogs(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching call logs:', error);
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Call Logs</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th>Client Number</th>
            <th>Record ID</th>
            <th>Attended</th>
            <th>Call Time</th>
            <th>Duration (s)</th>
            <th>Recording</th>
            <th>Recording Text</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} className="border-b">
              <td>{log.clientNumber}</td>
              <td>{log.recordId}</td>
              <td>{log.attended ? 'Yes' : 'No'}</td>
              <td>{new Date(log.callTime).toLocaleString()}</td>
              <td>{log.duration}</td>
              <td>
                <audio controls>
                  <source src={log.recordingUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </td>
              <td>{log.recordingText}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CallLogs;
