const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  port: process.env.GMAIL_PORT,
  secure: false, // true if using port 465
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/**
 * Send email to multiple followers when a new challenge is created.
 * @param {Array} emails - list of follower emails
 * @param {String} challengeId - challenge ID
 * @param {String} challengeTitle - challenge title
 */
async function SendMailToFollowers(emails, challengeId, challengeTitle, creatorName) {
    try {
      const mailOptions = {
        from: `"Challenge App" <${process.env.GMAIL_USER}>`,
        to: emails,
        subject: `🔥 New Challenge from ${creatorName}: ${challengeTitle}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f6f9fc;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 10px;
              padding: 20px 30px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #eee;
              padding-bottom: 15px;
            }
            .header h2 {
              color: #333;
              margin: 0;
            }
            .creator {
              font-size: 14px;
              color: #777;
              margin-top: 5px;
            }
            .content {
              margin: 20px 0;
              line-height: 1.6;
              color: #444;
            }
            .btn {
              display: inline-block;
              background-color: #4f46e5;
              color: #ffffff !important;
              text-decoration: none;
              padding: 12px 20px;
              border-radius: 6px;
              font-weight: bold;
              margin-top: 20px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🚀 New Challenge Alert!</h2>
              <p class="creator">Created by <strong>${creatorName}</strong></p>
            </div>
            <div class="content">
              <p>Hello Challenger,</p>
              <p>A new challenge has just been created, and you’ve been invited to join!</p>
              <p><strong>Challenge Title:</strong> ${challengeTitle}</p>
              <a href="http://localhost:5173/challengeinfo/${challengeId}" class="btn">View Challenge</a>
            </div>
            <div class="footer">
              <p>You are receiving this because you follow <strong>${creatorName}</strong>.</p>
              <p>© ${new Date().getFullYear()} Challenge App. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
        `,
      };
  
      await transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log("Error sending mail:", err);
        } else {
          console.log("Mail sent:", info.response);
        }
      });
  
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  }
  
module.exports=SendMailToFollowers;