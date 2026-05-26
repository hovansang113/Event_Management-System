<!DOCTYPE html>
<html>
<head>
    <title>Event Cancelled</title>
</head>
<body>
    <h2>Event Cancelled</h2>
    <p>The event "{{ $event->title }}" has been cancelled.</p>
    <p><strong>Reason:</strong> {{ $event->cancellation_reason }}</p>
    <p>We apologize for any inconvenience.</p>
</body>
</html>