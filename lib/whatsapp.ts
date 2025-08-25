import twilio from "twilio";

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
}

export async function sendMembershipReminderWhatsApp(data: MembershipReminderData) {
  if (!twilioClient) {
    console.error("Twilio client not configured. Please check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables.");
    return { success: false, error: "Twilio not configured" };
  }

  try {
    const { userPhone, userName, gymName } = data;
    
    // Ensure phone number is in E.164 format (starts with +)
    const formattedPhone = userPhone.startsWith('+') ? userPhone : `+506${userPhone}`;

    const response = await twilioClient.messages.create({
      contentSid: "HX1d5e0be08a2a50b209010b1efa1685a6", // Your Twilio template SID
      from: "whatsapp:+19378803700", // Twilio Sandbox WhatsApp number (replace with your number in production)
      to: `whatsapp:${formattedPhone}`,
      contentVariables: JSON.stringify({
        "1": userName,
        "2": gymName
      })
    });

    console.log("WhatsApp message sent successfully:", response.sid);
    return { success: true, data: response };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return { success: false, error };
  }
}