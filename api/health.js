export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }

  res.status(200).json({ success: true, message: 'AI Code Reviewer API is running' });
}
