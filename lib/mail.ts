import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`

    await resend.emails.send({
        from: "Fino Acabados <onboarding@resend.dev>",
        to: email,
        subject: "Restablece tu contraseña",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 12px;">
                <h1 style="color: #18181b; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Restablece tu contraseña</h1>
                <p style="color: #71717a; font-size: 16px; line-height: 24px;">
                    Has solicitado restablecer tu contraseña para tu cuenta en <strong>Fino Acabados</strong>. 
                </p>
                <div style="text-align: center; margin: 32px 0;">
                    <p style="color: #71717a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Tu código de recuperación:</p>
                    <div style="background-color: #f4f4f5; color: #18181b; font-size: 32px; font-weight: bold; letter-spacing: 0.2em; padding: 16px; border-radius: 8px; display: inline-block;">
                        ${token}
                    </div>
                </div>
                <p style="color: #71717a; font-size: 16px; line-height: 24px;">
                    O haz clic en el botón de abajo para continuar:
                </p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetLink}" style="background-color: #18181b; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                        Restablecer Contraseña
                    </a>
                </div>
                <p style="color: #a1a1aa; font-size: 14px; line-height: 20px;">
                    Si no solicitaste este cambio, puedes ignorar este correo de forma segura. El enlace expirará en 1 hora.
                </p>
                <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 32px 0;" />
                <p style="color: #a1a1aa; font-size: 12px; text-align: center;">
                    &copy; 2026 Fino Acabados. Todos los derechos reservados.
                </p>
            </div>
        `
    })
}
