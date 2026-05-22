<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Event Rejected</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7fafc;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        .header {
            text-align: center;
            margin-bottom: 24px;
        }
        .header h1 {
            font-size: 24px;
            color: #111827;
            margin: 0;
        }
        .content {
            color: #374151;
            line-height: 1.6;
            font-size: 15px;
        }
        .footer {
            margin-top: 32px;
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
        }
        .reason {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 16px;
            border-radius: 8px;
            margin-top: 12px;
            color: #1f2937;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Event Submission Rejected</h1>
        </div>

        <div class="content">
            <p>Hi {{ $event->organizer->name }},</p>
            <p>We reviewed your event submission:</p>
            <p><strong>{{ $event->title }}</strong></p>
            <p>Unfortunately, this event has been rejected by the admin.</p>

            <div class="reason">
                <strong>Reason for rejection:</strong>
                <p>{{ $event->rejection_reason }}</p>
            </div>

            <p>If you want to submit an updated version, please revise the event details and send it again.</p>
            <p>Thank you for using our platform.</p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} Event Management System.</p>
        </div>
    </div>
</body>
</html>
