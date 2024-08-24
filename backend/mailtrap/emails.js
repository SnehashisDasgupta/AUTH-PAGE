import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationCode) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace(
                "{verificationCode}",
                verificationCode
            ),
            category: "Email Verification",
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.log("Error sending verification ", error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "65b13421-0525-4261-b45e-ede70c8c7490",
            template_variables: {
                name: name,
                company_info_name: "SecureSign",
            },
        });

        console.log("Welcome email sent successfully ", response);
    } catch (error) {
        console.log("Error sending welcome email ", error);
        throw new Error(`Error sending welcome email ${error}`);
    }
};
