<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Event Registration</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); }
        .header { text-align: center; margin-bottom: 24px; }
        .header h1 { font-size: 24px; color: #111827; margin: 0; }
        .content { color: #374151; line-height: 1.6; font-size: 15px; }
        .details { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-top: 12px; }
        .details p { margin: 6px 0; }
        .label { font-weight: 600; color: #4b5563; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-top: 8px; }
        .status-confirmed { background-color: #d1fae5; color: #065f46; }
        .status-waitlist { background-color: #fef3c7; color: #92400e; }
        .footer { margin-top: 32px; text-align: center; color: #9ca3af; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $registration->status === 'Waitlist' ? 'Waitlist Confirmation' : 'Registration Confirmed' }}</h1>
        </div>

        <div class="content">
            <p>Hi {{ $registration->user->name }},</p>

            @if ($registration->status === 'Waitlist')
                <p>You have been added to the waitlist for the event below. We will notify you if a spot becomes available.</p>
            @else
                <p>Your registration for the following event has been confirmed. We look forward to seeing you there!</p>
            @endif

            <div class="details">
                <p><span class="label">Event:</span> {{ $registration->event->title }}</p>
                <p><span class="label">Date:</span> {{ $registration->event->event_date }}</p>
                <p><span class="label">Time:</span> {{ $registration->event->event_time }}</p>
                <p><span class="label">Location:</span> {{ $registration->event->location }}</p>

                <span class="status-badge {{ $registration->status === 'Waitlist' ? 'status-waitlist' : 'status-confirmed' }}">
                    {{ $registration->status }}
                </span>

                @if ($registration->status === 'Waitlist' && $registration->position_in_waitlist)
                    <p style="margin-top: 12px;"><span class="label">Position in waitlist:</span> #{{ $registration->position_in_waitlist }}</p>
                @endif
            </div>

            <p>Thank you for using our platform.</p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} Event Management System.</p>
        </div>
    </div>
</body>
</html>
