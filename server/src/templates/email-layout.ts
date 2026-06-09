interface EmailTemplateOptions {
  content: string;
  bannerUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
}

const BASE_URL = "https://crm.fleuronindustries.com";

export const getEmailTemplate = (
  contentOrOptions: string | EmailTemplateOptions,
): string => {
  const options: EmailTemplateOptions =
    typeof contentOrOptions === "string"
      ? { content: contentOrOptions }
      : contentOrOptions;

  const { content, bannerUrl, ctaText, ctaUrl } = options;

  // Bannière : utiliser celle fournie, sinon la bannière par défaut
  const resolvedBannerUrl = bannerUrl || "/banniere-mailing-relance.webp";
  const absoluteBannerUrl = resolvedBannerUrl.startsWith("/")
    ? `${BASE_URL}${resolvedBannerUrl}`
    : resolvedBannerUrl;

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
            .content-td { padding: 24px 20px !important; font-size: 15px !important; }
            .footer-td { padding: 24px 20px !important; }
        }
        /* Styles contenu riche */
        .email-body p { margin: 0 0 14px 0; }
        .email-body p:last-child { margin-bottom: 0; }
        .email-body h1, .email-body h2, .email-body h3 {
            color: #1a1a1a;
            margin: 0 0 12px 0;
            line-height: 1.3;
        }
        .email-body h2 { font-size: 18px; }
        .email-body h3 { font-size: 16px; }
        .email-body a { color: #F5771F; text-decoration: underline; }
        .email-body ul, .email-body ol { margin: 0 0 14px 0; padding-left: 20px; }
        .email-body li { margin-bottom: 6px; }
        .email-body strong { color: #1a1a1a; }
    </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="600"
                    style="width: 600px; max-width: 600px; background-color: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.10);">

                    <!-- Bannière -->
                    ${bannerHtml}

                    <!-- Contenu -->
                    <tr>
                        <td class="content-td email-body" style="padding: 36px 40px 28px 40px; color: #2d2d2d; line-height: 1.8; font-size: 15px;">
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

                    <!-- Signature / Footer -->
                    <tr>
                        <td class="footer-td" style="padding: 28px 40px 32px 40px; background-color: #ffffff;">

                            <!-- Logo Fleuron -->
                            <a href="https://www.fleuron-industries.fr" style="text-decoration: none; display: block; margin-bottom: 14px;">
                                <img src="${BASE_URL}/logo.png" alt="Fleuron Industries"
                                    width="140" style="width: 140px; height: auto; display: block;" />
                            </a>

                            <!-- Label équipe -->
                            <p style="margin: 0 0 14px 0; font-size: 11px; font-weight: 700; color: #6b7280; letter-spacing: 0.8px; text-transform: uppercase;">
                                L'ÉQUIPE FLEURON INDUSTRIES
                            </p>

                            <!-- Badge 3660 -->
                            <a href="tel:3660" style="text-decoration: none; display: block;">
                                <img src="${BASE_URL}/numero.webp" alt="Service &amp; appel gratuits — 3660"
                                    width="115" style="width: 115px; height: auto; display: block;" />
                            </a>

                            <!-- Liens légaux -->
                            <div style="margin-top: 20px; font-size: 11px; color: #9ca3af;">
                                <a href="https://www.fleuron-industries.fr" style="color: #9ca3af; text-decoration: underline;">fleuron-industries.fr</a>
                                &nbsp;·&nbsp;
                                <a href="mailto:contact@fleuron-industries.fr" style="color: #9ca3af; text-decoration: underline;">contact@fleuron-industries.fr</a>
                            </div>

                            <!-- Copyright -->
                            <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #f0f0f0; font-size: 11px; color: #9ca3af; text-align: center;">
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
