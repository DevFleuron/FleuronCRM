interface EmailTemplateOptions {
  content: string;
  bannerUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
}

const BASE_URL = "https://crm.fleuronindustries.fr";

export const getEmailTemplate = (
  contentOrOptions: string | EmailTemplateOptions,
): string => {
  const options: EmailTemplateOptions =
    typeof contentOrOptions === "string"
      ? { content: contentOrOptions }
      : contentOrOptions;

  const { content, bannerUrl, ctaText, ctaUrl } = options;

  // Rendre la bannerUrl absolue si relative
  const absoluteBannerUrl = bannerUrl?.startsWith("/")
    ? `${BASE_URL}${bannerUrl}`
    : bannerUrl;

  const bannerHtml = absoluteBannerUrl
    ? `
    <tr>
      <td style="padding: 0; font-size: 0; line-height: 0;">
        <img src="${absoluteBannerUrl}" alt="Fleuron Industries" width="600"
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
        img { -ms-interpolation-mode: bicubic; border: 0; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0 !important; padding: 0 !important; background-color: #f4f4f4; }
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .content-td { padding: 30px 20px !important; font-size: 15px !important; }
            .footer-td { padding: 24px 20px !important; }
        }
    </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="600"
                    style="width: 600px; max-width: 600px; background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">


                    <!-- Bannière -->
                    ${bannerHtml}

                    <!-- Content -->
                    <tr>
                        <td class="content-td" style="padding: 32px 40px; color: #2d2d2d; line-height: 1.75; font-size: 15px;">
                            ${content}
                        </td>
                    </tr>

                    <!-- CTA -->
                    ${ctaHtml}

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="height: 1px; background-color: #e5e7eb; font-size: 0; line-height: 0;">&nbsp;</div>
                        </td>
                    </tr>

                    <!-- Footer / Signature -->
                    <tr>
                        <td class="footer-td" style="padding: 28px 40px 32px 40px; background-color: #ffffff;">

                            <!-- Label équipe -->
                            <p style="margin: 0 0 14px 0; font-size: 11px; font-weight: 700; color: #2d2d2d; letter-spacing: 0.8px; text-transform: uppercase;">
                                L'ÉQUIPE FLEURON INDUSTRIES
                            </p>

                            <!-- Logo (seul sur sa ligne) -->
                            <a href="https://fleuronindustries.fr/" target="_blank" style="text-decoration: none; display: block; margin-bottom: 12px;">
                                <img src="${BASE_URL}/numero.webp" alt="Fleuron Industries Pro" width="130"
                                    style="width: 130px; height: auto; display: block;" />
                            </a>

                            <!-- Badge 3660 (en dessous du logo) -->
                            <a href="tel:3660" style="text-decoration: none; display: block;">
                                <img src="${BASE_URL}/numero.webp" alt="Service &amp; appel gratuits — 3660"
                                    width="115" style="width: 115px; height: auto; display: block;" />
                            </a>

                            <!-- Copyright -->
                            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f0f0f0; font-size: 11px; color: #9ca3af; text-align: center;">
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
