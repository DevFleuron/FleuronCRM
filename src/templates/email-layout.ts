export const getEmailTemplate = (content: string): string => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fleuron Industries</title>
    <style>
        /* Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body, table, td, a { 
            -webkit-text-size-adjust: 100%; 
            -ms-text-size-adjust: 100%; 
        }
        table, td { 
            mso-table-lspace: 0pt; 
            mso-table-rspace: 0pt; 
        }
        img { 
            -ms-interpolation-mode: bicubic; 
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        /* Base */
        body {
            margin: 0 !important;
            padding: 0 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
        }

        /* Container */
        .email-wrapper {
            width: 100%;
            background-color: #f8fafc;
            padding: 20px 0;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, #7a2a81 0%, #9d3d96 50%, #F5771F 100%);
            padding: 40px 30px;
            text-align: center;
        }

        .logo {
            font-size: 32px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .tagline {
            color: #fef3c7;
            font-size: 15px;
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        /* Content */
        .content {
            padding: 50px 40px;
            color: #334155;
            line-height: 1.8;
            font-size: 16px;
        }

        .content strong {
            color: #7a2a81;
            font-weight: 600;
        }

        .content a {
            color: #F5771F;
            text-decoration: none;
            font-weight: 600;
        }

        .content a:hover {
            text-decoration: underline;
        }

        /* Highlight box */
        .highlight-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #F5771F;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }

        /* Button/CTA */
        .cta-button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #F5771F 0%, #fb923c 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            margin: 25px 0;
            box-shadow: 0 4px 6px -1px rgba(245, 119, 31, 0.3);
            transition: all 0.3s ease;
        }

        /* Divider */
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
            margin: 30px 0;
        }

        /* Footer */
        .footer {
            background: linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%);
            padding: 40px 30px;
            text-align: center;
            color: #cbd5e1;
        }

        .footer-brand {
            font-weight: 700;
            font-size: 20px;
            color: #ffffff;
            margin-bottom: 20px;
            letter-spacing: 1px;
        }

        .footer-info {
            margin: 20px 0;
            line-height: 1.8;
            font-size: 14px;
        }

        .footer-info a {
            color: #F5771F;
            text-decoration: none;
            font-weight: 600;
        }

        .footer-links {
            margin: 25px 0;
            padding: 20px 0;
            border-top: 1px solid #334155;
            border-bottom: 1px solid #334155;
        }

        .footer-links a {
            color: #e0e7ff;
            text-decoration: none;
            margin: 0 15px;
            font-weight: 500;
            font-size: 14px;
            transition: color 0.3s ease;
        }

        .footer-copyright {
            margin-top: 25px;
            font-size: 12px;
            color: #64748b;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                border-radius: 0 !important;
            }
            
            .header {
                padding: 30px 20px !important;
            }
            
            .logo {
                font-size: 24px !important;
            }
            
            .content {
                padding: 30px 20px !important;
                font-size: 15px !important;
            }
            
            .footer {
                padding: 30px 20px !important;
            }
            
            .footer-links a {
                display: block;
                margin: 10px 0 !important;
            }
        }
    </style>
</head>
<body>
    <table role="presentation" class="email-wrapper" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td align="center">
                <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="600">
                    
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <div class="logo">   FLEURON INDUSTRIES</div>
                            <div class="tagline">Votre expert en rénovation énergétique</div>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td class="content">
                            ${content.replace(/\n/g, "<br>")}
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            <div class="footer-brand">FLEURON INDUSTRIES</div>
                            
                            <div class="footer-info">
                                <strong style="color: #F5771F;"></strong> 75 rue Jules Guesdes<br>
                                <strong style="color: #F5771F;"></strong> 3660<br>
                                <strong style="color: #F5771F;"></strong> <a href="mailto:contact@fleuronindustries.com">contact@fleuronindustries.com</a>
                            </div>

                            <div class="footer-links">
                                <a href="https://fleuronindustries.fr/">Notre site web</a>
                                <span style="color: #475569;">•</span>
                                <a href="https://fleuronindustries.fr/nos-solutions/">Nos solutions</a>
                                <span style="color: #475569;">•</span>
                                <a href="https://fleuronindustries.fr/contact/">Contact</a>
                            </div>

                            <div class="footer-copyright">
                                © ${new Date().getFullYear()} Fleuron Industries. Tous droits réservés.
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
    <div style="text-align: center; margin: 30px 0;">
      <a href="${buttonUrl}" class="cta-button" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #F5771F 0%, #fb923c 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(245, 119, 31, 0.3);">
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
    <div class="highlight-box" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #F5771F; padding: 20px; margin: 25px 0; border-radius: 8px;">
      ${highlightText}
    </div>
  `;

  return content + box;
};
