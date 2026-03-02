export const getEmailTemplate = (content: string): string => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fleuron Industries</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0 !important; padding: 0 !important; background-color: #f4f4f4; }
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .content-td { padding: 30px 20px !important; font-size: 15px !important; }
            .footer-td { padding: 30px 20px !important; }
            .footer-link { display: block !important; margin: 8px 0 !important; }
        }
    </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="600" style="width: 600px; max-width: 600px; background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

                    <!-- Orange top bar -->
                    <tr>
                        <td style="background-color: #F5771F; height: 5px; font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>

                    <!-- Header -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 28px 40px 24px 40px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                            <img src="https://fleuronindustries.fr/logo.png" alt="Fleuron Industries" width="180" style="max-width: 180px; height: auto; display: inline-block;" />
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td class="content-td" style="padding: 40px 40px; color: #2d2d2d; line-height: 1.75; font-size: 15px;">
                            ${content.replace(/\n/g, "<br>")}
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="height: 1px; background-color: #f0f0f0; font-size: 0; line-height: 0;">&nbsp;</div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="footer-td" style="background-color: #f8f8f8; padding: 36px 40px; text-align: center; color: #6b7280; border-top: 3px solid #F5771F;">

                            <div style="margin-bottom: 20px;">
                                <span style="font-size: 16px; font-weight: 700; color: #2d2d2d; letter-spacing: 1.5px; text-transform: uppercase;">FLEURON INDUSTRIES</span>
                                <div style="margin-top: 8px; text-align: center;">
                                    <span style="display: inline-block; width: 36px; height: 2px; background-color: #F5771F;"></span>
                                </div>
                            </div>

                            <div style="margin: 20px 0; line-height: 2; font-size: 13px; color: #6b7280;">
                                 75 rue Jules Guesdes<br>
                                 <a href="tel:3660" style="color: #6b7280; text-decoration: none;">3660</a><br>
                                 <a href="mailto:contact@fleuronindustries.com" style="color: #F5771F; text-decoration: none; font-weight: 600;">contact@fleuronindustries.com</a>
                            </div>

                            <div style="margin: 24px 0; padding: 16px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; font-size: 13px;">
                                <a href="https://fleuronindustries.fr/" class="footer-link" style="color: #4b5563; text-decoration: none; margin: 0 12px; font-weight: 500;">Notre site</a>
                                <span style="color: #d1d5db;">•</span>
                                <a href="https://fleuronindustries.fr/nos-solutions/" class="footer-link" style="color: #4b5563; text-decoration: none; margin: 0 12px; font-weight: 500;">Nos solutions</a>
                                <span style="color: #d1d5db;">•</span>
                                <a href="https://fleuronindustries.fr/contact/" class="footer-link" style="color: #4b5563; text-decoration: none; margin: 0 12px; font-weight: 500;">Contact</a>
                            </div>

                            <div style="margin-top: 20px; font-size: 11px; color: #9ca3af;">
                                © ${new Date().getFullYear()} Fleuron Industries SaS — Tous droits réservés
                            </div>

                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
  `;
};

export const addCallToAction = (
  content: string,
  buttonText: string,
  buttonUrl: string,
): string => {
  const button = `
    <div style="text-align: center; margin: 32px 0;">
      <a href="${buttonUrl}" style="display: inline-block; padding: 14px 36px; background-color: #F5771F; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: 700; font-size: 15px; letter-spacing: 0.3px;">
        ${buttonText}
      </a>
    </div>
  `;
  return content + button;
};

export const addHighlightBox = (
  content: string,
  highlightText: string,
): string => {
  const box = `
    <div style="background-color: #fff7f0; border-left: 3px solid #F5771F; padding: 16px 20px; margin: 24px 0; border-radius: 2px; font-size: 14px; color: #2d2d2d; line-height: 1.6;">
      ${highlightText}
    </div>
  `;
  return content + box;
};
