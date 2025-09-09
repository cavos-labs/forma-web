import twilio from "twilio";
import { validateAndFormatPhone } from "./phone";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

let twilioClient: ReturnType<typeof twilio> | null = null;

if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
}

export interface MembershipReminderData {
  userPhone: string;
  userName: string;
  gymName: string;
  membershipId: string;
  paymentId: string;
}

export async function sendMembershipReminderWhatsApp(
  data: MembershipReminderData
) {
  console.log("🔍 Attempting to send WhatsApp message with data:", data);
  console.log("🔑 Twilio config:", {
    hasAccountSid: !!accountSid,
    hasAuthToken: !!authToken,
    hasClient: !!twilioClient,
  });

  if (!twilioClient) {
    console.error(
      "❌ Twilio client not configured. Please check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables."
    );
    return { success: false, error: "Twilio not configured" };
  }

  try {
    const { userPhone, userName, gymName, membershipId, paymentId } = data;

    // Validate and format phone number
    const phoneValidation = validateAndFormatPhone(userPhone);
    
    if (!phoneValidation.isValid) {
      console.error("❌ Invalid phone number:", phoneValidation.error);
      return { 
        success: false, 
        error: `Invalid phone number: ${phoneValidation.error}` 
      };
    }

    const formattedPhone = phoneValidation.formattedPhone!;
    console.log("📱 Original phone:", userPhone);
    console.log("📱 Formatted phone number:", formattedPhone);
    console.log("👤 User name:", userName);
    console.log("🏋️ Gym name:", gymName);

    const messageData = {
      contentSid: "HX2c6badeb7e3cd21b73ff88917d690085", // Your Twilio template SID
      from: "whatsapp:+50685157252", // Twilio Sandbox WhatsApp number (replace with your number in production)
      to: `whatsapp:${formattedPhone}`,
      contentVariables: JSON.stringify({
        "1": gymName,
        "2": `?membershipId=${membershipId}&paymentId=${paymentId}`,
      }),
    };

    console.log("📤 Sending message with data:", messageData);

    const response = await twilioClient.messages.create(messageData);

    console.log("✅ WhatsApp message sent successfully:", response.sid);
    return { success: true, data: response };
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error);
    console.error("❌ Error details:", JSON.stringify(error, null, 2));
    return { success: false, error };
  }
}
