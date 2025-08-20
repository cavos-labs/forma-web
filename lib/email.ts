import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface PaymentProofEmailData {
  userEmail: string;
  userName: string;
  gymName: string;
  monthlyFee: number;
  membershipId: string;
}

export async function sendPaymentProofEmail(data: PaymentProofEmailData) {
  try {
    const { userEmail, userName, gymName, monthlyFee, membershipId } = data;

    const response = await resend.emails.send({
      from: "Forma App <adrianvrj@cavos.xyz>", // Cambia esto por tu dominio verificado
      to: [userEmail],
      subject: "Comprobante de Pago Requerido - Forma App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Forma App</h1>
            <p style="color: #666; font-size: 18px;">Tu membresía está casi lista</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <h2 style="color: #333; margin-bottom: 20px;">¡Hola ${userName}!</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Tu registro en <strong>${gymName}</strong> ha sido exitoso. 
              Para activar tu membresía, necesitamos que envíes el comprobante de pago.
            </p>
            
            <div style="background-color: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057; margin-bottom: 15px;">Detalles de la Membresía:</h3>
              <ul style="color: #495057; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li><strong>Gimnasio:</strong> ${gymName}</li>
                <li><strong>Membresía:</strong> Mensual</li>
                <li><strong>Precio:</strong> ₡${monthlyFee.toLocaleString()}</li>
                <li><strong>Estado:</strong> Pendiente de Pago</li>
              </ul>
            </div>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #155724; margin-bottom: 15px;">�� Cómo Enviar el Comprobante:</h3>
              <ol style="color: #155724; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Realiza el pago por SINPE Móvil al número del gimnasio</li>
                <li>Toma una captura de pantalla del comprobante</li>
                <li>Envía la imagen por WhatsApp al administrador del gimnasio</li>
                <li>O súbela directamente en la aplicación</li>
              </ol>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Una vez que se verifique tu pago, tu membresía será activada automáticamente 
              y podrás acceder al gimnasio.
            </p>
            
            <p style="color: #555; line-height: 1.6;">
              Si tienes alguna pregunta, no dudes en contactar al administrador del gimnasio.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 14px;">
              Este es un email automático, por favor no respondas a este mensaje.
            </p>
            <p style="color: #6c757d; font-size: 12px;">
              ID de Membresía: ${membershipId}
            </p>
          </div>
        </div>
      `,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error("Error sending payment proof email:", error);
    return { success: false, error };
  }
}
