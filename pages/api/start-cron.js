// pages/api/start-cron.js
import { initCronJobs } from '../../lib/cron';

initCronJobs(); // Starts once, safely

export default function handler(req, res) {
  res.status(200).json({ message: 'Cron initialized (if not already)' });
}
