import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  // Configuro CORS por si acaso
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { lead, settings } = req.body;

  if (!lead || !settings || !settings.smtp_host) {
    return res.status(400).json({ message: 'Faltan datos de envio o configuración SMTP.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: parseInt(settings.smtp_port || '587', 10),
      secure: parseInt(settings.smtp_port || '587', 10) === 465, // true for 465, false for other ports
      auth: {
        user: settings.smtp_user,
        pass: settings.smtp_password,
      },
    });

    const mailOptions = {
      from: `"${settings.smtp_from_name || settings.site_name || 'Web'}" <${settings.smtp_from_email || settings.smtp_user}>`,
      to: settings.admin_email || settings.smtp_user,
      subject: `Nueva Consulta Web: ${lead.form_type} - ${lead.first_name}`,
      html: `
        <h2 style="color: #E87B37;">Nueva Consulta Web Capturada</h2>
        <p><strong>Nombre:</strong> ${lead.first_name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Teléfono:</strong> ${lead.phone || 'No especificado'}</p>
        <p><strong>Detalles:</strong> ${lead.approximate_date || 'No especificado'} - ${lead.passengers_count} personas</p>
        <hr style="border:1px solid #eee; margin:20px 0;" />
        <p><strong>Mensaje del cliente:</strong></p>
        <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${lead.message || 'Sin mensaje adicional'}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Error enviando email vía SMTP:', error);
    return res.status(500).json({ message: 'Error interno enviando email', error: error.message });
  }
}
