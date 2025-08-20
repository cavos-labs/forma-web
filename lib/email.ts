import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface PaymentProofEmailData {
  userEmail: string;
  userName: string;
  gymName: string;
  monthlyFee: number;
  membershipId: string;
  paymentId: string;
}

export async function sendPaymentProofEmail(data: PaymentProofEmailData) {
  try {
    const { userEmail, userName, gymName, monthlyFee, membershipId, paymentId } = data;
    
    // Create upload link
    const uploadUrl = `https://formacr.com/upload-payment?membershipId=${membershipId}&paymentId=${paymentId}`;

    const response = await resend.emails.send({
      from: "Forma App <adrianvrj@cavos.xyz>",
      to: [userEmail],
      subject: "Comprobante de Pago Requerido - Forma App",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Forma App - Comprobante de Pago</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, Helvetica, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header con branding de Forma -->
            <div style="background: linear-gradient(135deg, #373737 0%, #2a2a2a 100%); padding: 40px 30px; text-align: center;">
              <div style="margin-bottom: 20px;">
                <img src="https://formacr.com/images/forma-logo-white.png" alt="Forma App" style="height: 60px; width: auto;">
              </div>
              <p style="color: #F0F0F0; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Tu membresía está casi lista</p>
            </div>
            
            <!-- Contenido principal -->
            <div style="padding: 40px 30px;">
              <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(55, 55, 55, 0.1); overflow: hidden;">
                <!-- Saludo -->
                <div style="padding: 30px; border-bottom: 1px solid #f0f0f0;">
                  <h2 style="color: #373737; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">¡Hola ${userName}!</h2>
                  <p style="color: #555; line-height: 1.6; margin: 0; font-size: 16px;">
                    Tu registro en <strong style="color: #373737;">${gymName}</strong> ha sido exitoso. 
                    Para activar tu membresía, necesitamos que envíes el comprobante de pago.
                  </p>
                </div>
                
                <!-- Detalles de la membresía -->
                <div style="padding: 30px; background-color: #f8f9fa;">
                  <h3 style="color: #373737; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Detalles de la Membresía</h3>
                  <div style="background-color: #ffffff; border-radius: 8px; padding: 25px; border-left: 4px solid #373737;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                      <span style="color: #666; font-weight: 500;">Gimnasio:</span>
                      <span style="color: #373737; font-weight: 600;">${gymName}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                      <span style="color: #666; font-weight: 500;">Membresía:</span>
                      <span style="color: #373737; font-weight: 600;">Mensual</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                      <span style="color: #666; font-weight: 500;">Precio:</span>
                      <span style="color: #373737; font-weight: 600; font-size: 18px;">₡${monthlyFee.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                      <span style="color: #666; font-weight: 500;">Estado:</span>
                      <span style="color: #dc3545; font-weight: 600; background-color: #f8d7da; padding: 4px 12px; border-radius: 20px; font-size: 14px;">Pendiente de Pago</span>
                    </div>
                  </div>
                </div>
                
                <!-- Instrucciones -->
                <div style="padding: 30px;">
                  <h3 style="color: #373737; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">📋 Cómo Enviar el Comprobante</h3>
                  <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 8px; padding: 25px;">
                    <ol style="color: #373737; line-height: 1.8; margin: 0 0 25px 0; padding-left: 20px; font-size: 16px;">
                      <li style="margin-bottom: 12px;">Realiza el pago por SINPE Móvil al número del gimnasio</li>
                      <li style="margin-bottom: 12px;">Toma una captura de pantalla del comprobante</li>
                      <li style="margin-bottom: 0;">Sube la imagen usando el botón de abajo ⬇️</li>
                    </ol>
                    
                    <!-- Botón de subir comprobante -->
                    <div style="text-align: center; margin-top: 25px;">
                      <a href="${uploadUrl}" style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3); transition: transform 0.2s;">
                        📸 Subir Comprobante de Pago
                      </a>
                    </div>
                    
                    <p style="text-align: center; color: #666; font-size: 14px; margin: 15px 0 0 0;">
                      También puedes enviar la imagen por WhatsApp al administrador del gimnasio
                    </p>
                  </div>
                </div>
                
                <!-- Información adicional -->
                <div style="padding: 0 30px 30px 30px;">
                  <p style="color: #555; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                    Una vez que se verifique tu pago, tu membresía será activada automáticamente 
                    y podrás acceder al gimnasio.
                  </p>
                  <p style="color: #555; line-height: 1.6; margin: 0; font-size: 16px;">
                    Si tienes alguna pregunta, no dudes en contactar al administrador del gimnasio.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Footer con branding -->
            <div style="background-color: #373737; padding: 30px; text-align: center;">            
              <!-- Disclaimer de seguridad -->
              <div style="background-color: #28a745; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: left;">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px;">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <h4 style="color: #ffffff; margin: 0; font-size: 16px; font-weight: 600;">Correo Verificado y Seguro</h4>
                </div>
                <p style="color: #ffffff; margin: 0; font-size: 14px; line-height: 1.5; opacity: 0.95;">
                  <strong>adrianvrj@cavos.xyz</strong> es el correo oficial de <strong>Adrián</strong>, 
                  cofundador de Forma App. Este es un correo verificado y 100% seguro para 
                  comunicaciones oficiales de la empresa.
                </p>
              </div>
              
              <p style="color: #F0F0F0; margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">
                Este es un email automático, por favor no respondas a este mensaje.
              </p>
              <p style="color: #F0F0F0; margin: 0; font-size: 12px; opacity: 0.7;">
                ID de Membresía: ${membershipId}
              </p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #555;">
                <p style="color: #F0F0F0; margin: 0; font-size: 12px; opacity: 0.7;">
                  © 2024 Forma App. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error("Error sending payment proof email:", error);
    return { success: false, error };
  }
}
