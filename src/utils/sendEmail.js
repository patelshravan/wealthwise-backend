const sgMail = require("@sendgrid/mail");
const Mailgen = require("mailgen");
const config = require("../config/config");

sgMail.setApiKey(config.email.smtp.auth.pass);

// Mailgen Config
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Wealthwise",
    link: "#",
    logo: "https://res.cloudinary.com/patelshravan/image/upload/v1744133624/logo-full_xfqcof.png",
  },
});

// Send OTP with Mailgen + SendGrid API
const sendOtpOnMail = async (email, name, otp) => {
  const emailTemplate = {
    body: {
      name: name,
      title: "Your One-Time Password (OTP) for Secure Login",
      intro: `Hello ${name},<br/><br/>Thank you for choosing Wealthwise!`,
      action: {
        instructions: "Use the OTP below to complete your verification:",
        button: {
          color: "#22BC66",
          text: `${otp}`,
        },
      },
      outro: `This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.<br/><br/>
              If you did not request this, you can ignore this email.`,
      signature: "Best regards,<br/>The Wealthwise Team",
    },
  };

  const emailBody = mailGenerator.generate(emailTemplate);
  const emailText = mailGenerator.generatePlaintext(emailTemplate);

  const msg = {
    to: email,
    from: config.email.from,
    subject: "Your Secure OTP for Wealthwise Login",
    text: emailText,
    html: emailBody,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("✅ OTP email sent to:", email);
  } catch (error) {
    console.error(
      "❌ OTP email sending failed:",
      error.response?.body || error.message
    );
  }
};

// Send OTP for Password Reset
const sendPasswordResetOtpOnMail = async (email, name, otp) => {
  const emailTemplate = {
    body: {
      name: name,
      title: "Your Password Reset OTP",
      intro: `Hello ${name},<br/><br/>We received a request to reset your password for your Wealthwise account.`,
      action: {
        instructions: "Please use the OTP below to reset your password:",
        button: {
          color: "#22BC66",
          text: `${otp}`,
        },
      },
      outro: `This OTP is valid for <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email.`,
      signature: "Best regards,<br/>The Wealthwise Team",
    },
  };

  const emailBody = mailGenerator.generate(emailTemplate);
  const emailText = mailGenerator.generatePlaintext(emailTemplate);

  const msg = {
    to: email,
    from: config.email.from,
    subject: "Your Password Reset OTP for Wealthwise",
    text: emailText,
    html: emailBody,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Password reset OTP email sent to:", email);
  } catch (error) {
    console.error(
      "❌ Password reset OTP email sending failed:",
      error.response?.body || error.message
    );
  }
};

module.exports = { sendOtpOnMail, sendPasswordResetOtpOnMail };
