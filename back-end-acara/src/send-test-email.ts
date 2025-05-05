import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "aldowiranata16@gmail.com",
    pass: "2025_one_day", // Ganti ini dengan App Password jika pakai 2FA
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection failed:", error);
  } else {
    console.log("SMTP server is ready to take messages:", success);
  }
});

transporter.sendMail({
  from: "aldowiranata16@gmail.com",
  to: "aldowiranata16@gmail.com",
  subject: "Tes Kirim Email Zoho SMTP",
  html: "<h1>Ini hanya tes email</h1><p>Jika kamu melihat ini, SMTP bekerja.</p>",
})
.then((info) => {
  console.log("✅ Email berhasil dikirim:", info);
})
.catch((error) => {
  console.error("❌ Gagal mengirim email:", error);
});
