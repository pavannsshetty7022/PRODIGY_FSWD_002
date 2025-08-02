exports.submitSupportForm = (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  console.log('--- New Support Form Submission ---');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);
  console.log('-----------------------------------');

  res.status(200).json({ message: 'Your message has been sent successfully. We will get back to you shortly.' });
};