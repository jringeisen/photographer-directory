<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New inquiry for {{ $listing->company_name }}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f7f7f8; padding: 24px; color: #111827;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); overflow: hidden;">
        <tr>
            <td style="padding: 20px 24px; background: linear-gradient(135deg, #111827, #1f2937); color: #ffffff;">
                <div style="font-size: 14px; opacity: 0.9;">New Inquiry</div>
                <div style="font-size: 20px; font-weight: 700; margin-top: 4px;">{{ $listing->company_name }}</div>
            </td>
        </tr>
        <tr>
            <td style="padding: 24px;">
                <div style="margin-bottom: 16px; font-weight: 600; font-size: 16px;">From</div>
                <div style="margin-bottom: 12px;">
                    <div style="font-weight: 600; color: #111827;">{{ $contact->name }}</div>
                    <div style="color: #4b5563; font-size: 14px;">{{ $contact->email }}</div>
                    @if($contact->phone)
                        <div style="color: #4b5563; font-size: 14px;">{{ $contact->phone }}</div>
                    @endif
                </div>

                <div style="margin-top: 20px; font-weight: 600; font-size: 16px;">Message</div>
                <div style="margin-top: 8px; color: #111827; line-height: 1.6; white-space: pre-wrap;">{{ $contact->message }}</div>

                <div style="margin-top: 28px;">
                    <a href="{{ $dashboardUrl }}" style="display: inline-block; padding: 12px 16px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">
                        View dashboard
                    </a>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding: 16px 24px; background: #f9fafb; color: #6b7280; font-size: 12px;">
                You received this message via Photography Directory. You can reply directly via email or phone.
            </td>
        </tr>
    </table>
</body>
</html>
