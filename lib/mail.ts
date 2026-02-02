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

export const sendWelcomeEmail = async (email: string, name: string) => {
    const logoUrl = `${domain}/finoacabadologo.png`

    await resend.emails.send({
        from: "Fino Acabados <onboarding@resend.dev>",
        to: email,
        subject: "¡Bienvenido a Fino Acabados!",
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
                <div style="background-color: #18181b; padding: 40px 20px; text-align: center;">
                    <img src="${logoUrl}" alt="Fino Acabados" style="width: 80px; height: 80px; margin-bottom: 16px;" />
                    <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Fino Acabados</h1>
                    <p style="color: #fbbf24; font-size: 12px; margin: 8px 0 0; text-transform: uppercase; letter-spacing: 4px;">Premium Store</p>
                </div>
                
                <div style="padding: 40px 30px;">
                    <h2 style="color: #18181b; font-size: 24px; font-weight: bold; margin-bottom: 20px;">¡Hola, ${name.split(' ')[0]}!</h2>
                    
                    <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin-bottom: 24px;">
                        Es un placer darte la bienvenida a <strong>Fino Acabados</strong>. Estamos muy emocionados de que formes parte de nuestra comunidad de acabados premium.
                    </p>
                    
                    <div style="background-color: #f9fafb; border-left: 4px solid #fbbf24; padding: 20px; margin-bottom: 24px;">
                        <p style="color: #1f2937; font-size: 15px; font-weight: 600; margin: 0;">Tu cuenta ha sido creada exitosamente.</p>
                        <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0;">Ya puedes empezar a explorar nuestro catálogo exclusivo.</p>
                    </div>

                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${domain}/productos" style="background-color: #18181b; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; transition: all 0.3s ease;">
                            Explorar Catálogo
                        </a>
                    </div>

                    <p style="color: #4b5563; font-size: 16px; line-height: 26px;">
                        Si tienes alguna pregunta o necesitas ayuda con tu primer pedido, no dudes en contactarnos. Estamos aquí para ayudarte a transformar tus espacios.
                    </p>
                </div>

                <div style="background-color: #f4f4f5; padding: 30px; text-align: center; border-top: 1px solid #e4e4e7;">
                    <div style="margin-bottom: 20px;">
                        <p style="color: #18181b; font-size: 14px; font-weight: bold; margin-bottom: 8px;">Fino Acabados e-Commerce</p>
                        <p style="color: #71717a; font-size: 12px; margin: 0;">Lo mejor en pinturas y acabados para tu hogar.</p>
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
                    
                    <p style="color: #a1a1aa; font-size: 12px;">
                        &copy; 2026 Fino Acabados. Todos los derechos reservados.
                        <br />
                        Recibiste este correo porque te registraste en nuestro sitio.
                    </p>
                </div>
            </div>
        `
    })
}
