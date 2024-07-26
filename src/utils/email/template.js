export const getDocumentStatusUpdateTemplate = ({
  docId,
  status,
  updatedBy,
  date,
  message = "The status of your document has been updated. Here are the details",
}) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document Status Updated</title>
    <style>
        body, table, td, a {
            font-family: Arial, sans-serif;
            font-size: 16px;
            color: #333;
            line-height: 1.5;
        }
        body {
            margin: 0;
            padding: 0;
            width: 100%;
        }
        table {
            border-collapse: collapse;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background-color: #f9f9f9;
        }
        .email-header {
            background-color: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
        }
        .email-body p {
            margin: 0 0 15px;
        }
        .email-body .cta {
            display: inline-block;
            padding: 10px 20px;
            background-color: #28a745;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }
        .email-footer {
            padding: 10px 20px;
            background-color: #f7f7f7;
            text-align: center;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }
        .email-footer p {
            margin: 0;
            font-size: 12px;
            color: #666;
        }
        @media (max-width: 600px) {
            .email-container {
                width: 100%;
                border: none;
                border-radius: 0;
                box-shadow: none;
            }
            .email-header, .email-body, .email-footer {
                padding: 15px;
            }
            .email-header h1 {
                font-size: 20px;
            }
            .email-body .cta {
                padding: 8px 15px;
                font-size: 14px;
            }
        }
    </style>
</head>

<body>
    <table role="presentation" class="email-container" align="center" cellspacing="0" cellpadding="0">
        <tr>
            <td class="email-header">
                <h1>Document Status Updated</h1>
            </td>
        </tr>
        <tr>
            <td class="email-body">
                <p>Hello,</p>
                <p>${message}:</p>
                <ul>
                    <li><strong>Document ID:</strong> ${docId}</li>
                    <li><strong>New Status:</strong> ${status}</li>
                    <li><strong>Updated By:</strong> ${updatedBy}</li>
                    <li><strong>Date:</strong> ${date}</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td class="email-footer">
                <p>If you have any questions, contact us at <a href="mailto:lizapatel2711@gmail.com">lizapatel2711@gmail.com</a>.</p>
                <p>© ${new Date().getFullYear()} RapidAId. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>

</html>
`;
