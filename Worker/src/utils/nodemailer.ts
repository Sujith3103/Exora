import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

export async function sendLoginAlert(email: string) {
  console.log("reached the function", email);

  const time = new Date();

  await transporter.sendMail({
    from: `"Security Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "New Login Alert",
    html: `
    <h2>New Login Detected</h2>
    <p>We detected a login to your account:</p>
    <ul>
      <li><b>Time:</b> ${time.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true
    })}</li>
    </ul>
    <p>If this wasn't you, please reset your password immediately.</p>
  `,
  });

}


