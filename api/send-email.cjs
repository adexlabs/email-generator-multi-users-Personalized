const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/send-email", async (req, res) => {

    try {

        const { users, product, discount } = req.body;

        if (!users?.length) {
            return res.status(400).json({
                success: false,
                message: "Select at least one user"
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        for (const user of users) {

            const aiResponse = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model: "openai/gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "You are a professional email marketing assistant."
                        },
                        {
                            role: "user",
                            content: `
                                    Create a professional marketing email.

                                    Customer Name: ${user.name}
                                    Product: ${product}
                                    Discount: ${discount}%

                                    Requirements:
                                        - Personalized greeting using customer name
                                        - Professional marketing tone
                                        - Mention product benefits
                                        - Mention discount offer
                                        - Add a strong call-to-action
                                        - Keep email under 150 words
                                        - Do NOT include placeholders such as:
                                        [Your Name]
                                        [Your Position]
                                        [Your Company]
                                        [Your Contact Information]
                                        [Your Company's Website]
                                        [Insert Expiration Date]
                                        - End the email with:
                                        Regards,
                                        Adex Labs Team

                                        Return only the email body.
                                    `
                        }
                    ]
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const emailContent =
                aiResponse.data.choices[0].message.content
                    .replace(/\[Your Name\]/g, "")
                    .replace(/\[Your Position\]/g, "")
                    .replace(/\[Your Company\]/g, "")
                    .replace(/\[Your Contact Information\]/g, "")
                    .replace(/\[Your Company's Website\]/g, "")
                    .replace(/\[Insert Expiration Date\]/g, "");

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: `Exclusive ${discount}% OFF on ${product}`,
                html: emailContent.replace(/\n/g, "<br>")
            });
        }

        res.json({
            success: true,
            message: "Emails sent"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});