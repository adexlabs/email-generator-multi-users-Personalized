const cors = require("cors");
const nodemailer = require("nodemailer");
const axios = require("axios");

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }
    
    try {
        const { users, product, discount } = req.body;

        if (!users || users.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Select at least one user",
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        for (const user of users) {
            const aiResponse = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model: "openai/gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a professional email marketing assistant.",
                        },
                        {
                            role: "user",
                            content: `Create a professional marketing email for ${user.name}. Product: ${product}. Discount: ${discount}%`,
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const emailContent =
                aiResponse.data.choices[0].message.content;

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: `Exclusive ${discount}% OFF on ${product}`,
                html: emailContent.replace(/\n/g, "<br>"),
            });
        }

        return res.status(200).json({
            success: true,
            message: "Emails sent successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};