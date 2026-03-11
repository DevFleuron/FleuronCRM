interface EmailTemplateOptions {
  content: string;
  bannerUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export const getEmailTemplate = (
  contentOrOptions: string | EmailTemplateOptions,
): string => {
  // Rétrocompatibilité — si on passe une string directement
  const options: EmailTemplateOptions =
    typeof contentOrOptions === "string"
      ? { content: contentOrOptions }
      : contentOrOptions;

  const { content, bannerUrl, ctaText, ctaUrl } = options;

  const bannerHtml = bannerUrl
    ? `
    <tr>
      <td style="padding: 0; font-size: 0; line-height: 0;">
        <img src="${bannerUrl}" alt="Fleuron Industries" width="600"
          style="width: 600px; max-width: 100%; height: auto; display: block;" />
      </td>
    </tr>`
    : "";

  const ctaHtml =
    ctaText && ctaUrl
      ? `
    <tr>
      <td style="padding: 8px 40px 40px 40px; text-align: center;">
        <a href="${ctaUrl}"
          style="display: inline-block; padding: 14px 40px; background-color: #F5771F; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: 700; font-size: 15px; letter-spacing: 0.3px;">
          ${ctaText}
        </a>
      </td>
    </tr>`
      : "";

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
        }
    </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="600"
                    style="width: 600px; max-width: 600px; background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

                    <!-- Orange top bar -->
                    <tr>
                        <td style="background-color: #F5771F; height: 5px; font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>

                    <!-- Bannière -->
                    ${bannerHtml}

                    <!-- Content -->
                    <tr>
                        <td class="content-td" style="padding: 40px 40px 32px 40px; color: #2d2d2d; line-height: 1.75; font-size: 15px;">
                            ${content}
                        </td>
                    </tr>

                    <!-- CTA -->
                    ${ctaHtml}

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="height: 1px; background-color: #f0f0f0; font-size: 0; line-height: 0;">&nbsp;</div>
                        </td>
                    </tr>

                    <!-- Footer / Signature -->
                    <tr>
                        <td class="footer-td" style="background-color: #f8f8f8; padding: 32px 40px; border-top: 3px solid #F5771F;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <!-- Logo cliquable vers le site -->
                                    <td style="vertical-align: middle;">
                                        <a href="https://fleuronindustries.fr/" target="_blank" style="text-decoration: none; display: inline-block;">
                                            <img src="https://fleuronindustries.fr/logo.png" alt="Fleuron Industries" width="140"
                                                style="width: 140px; height: auto; display: block;" />
                                        </a>
                                    </td>
                                    <!-- Badge 3660 cliquable -->
                                    <td style="vertical-align: middle; text-align: right;">
                                        <a href="tel:3660" style="text-decoration: none; display: inline-block;">
                                            <img src="https://fleuronindustries.fr/3660-badge.png" alt="Service &amp; appel gratuits — 3660"
                                                width="130" style="width: 130px; height: auto; display: block;" />
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <div style="margin-top: 20px; font-size: 11px; color: #9ca3af; text-align: center;">
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
