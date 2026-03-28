const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
    port: Number(process.env.MAILTRAP_PORT || 25),
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USER || "",
        pass: process.env.MAILTRAP_PASS || "",
    },
});

const defaultFrom = process.env.MAIL_FROM || "admin@hehehe.com";
const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="160" viewBox="0 0 600 160">
  <rect width="600" height="160" fill="#0f172a"/>
  <rect x="24" y="24" width="110" height="110" rx="20" fill="#22c55e"/>
  <text x="79" y="95" text-anchor="middle" font-size="44" font-family="Arial, sans-serif" fill="#ffffff">U</text>
  <text x="165" y="72" font-size="34" font-family="Arial, sans-serif" fill="#ffffff">User Account</text>
  <text x="165" y="112" font-size="20" font-family="Arial, sans-serif" fill="#cbd5e1">NNPTUD-C6 import notification</text>
</svg>
`;

async function sendMail(options) {
    return transporter.sendMail({
        from: defaultFrom,
        ...options,
    });
}

async function sendResetPasswordMail(to, url) {
    return sendMail({
        to: to,
        subject: "reset pass",
        text: `click vao day de doi mat khau: ${url}`,
        html: `click vao <a href="${url}">day</a> de doi mat khau`,
    });
}

async function sendUserCredentialsMail(to, username, password) {
    return sendMail({
        to: to,
        subject: "Thong tin tai khoan moi",
        text: `Tai khoan cua ban da duoc tao. Username: ${username}. Password tam thoi: ${password}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #0f172a;">
                <img src="cid:user-import-banner" alt="User import banner" style="width: 100%; max-width: 600px; border-radius: 12px; display: block; margin-bottom: 24px;" />
                <h2 style="margin: 0 0 16px;">Thong tin tai khoan moi</h2>
                <p style="margin: 0 0 12px;">Tai khoan cua ban da duoc tao tu file import.</p>
                <p style="margin: 0 0 8px;"><strong>Username:</strong> ${username}</p>
                <p style="margin: 0 0 8px;"><strong>Email:</strong> ${to}</p>
                <p style="margin: 0 0 20px;"><strong>Password tam thoi:</strong> ${password}</p>
                <p style="margin: 0;">Hay dang nhap va doi mat khau ngay sau lan dang nhap dau tien.</p>
            </div>
        `,
        attachments: [
            {
                filename: "user-import-banner.svg",
                content: logoSvg,
                contentType: "image/svg+xml",
                cid: "user-import-banner",
            },
        ],
    });
}

module.exports = {
    sendMail: sendResetPasswordMail,
    sendRawMail: sendMail,
    sendUserCredentialsMail: sendUserCredentialsMail,
};
