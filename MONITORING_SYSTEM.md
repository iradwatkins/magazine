# SteppersLife Magazine - Debug & Monitoring System

## Overview

I've created a comprehensive monitoring system that tracks everything that happens on the website. This will help us identify and fix problems immediately when you test features.

## Features

### 🔍 What Gets Tracked

1. **User Actions**
   - Button clicks
   - Form submissions
   - Page navigation
   - Login attempts

2. **Errors**
   - JavaScript errors
   - API failures
   - Authentication errors
   - Promise rejections

3. **API Calls**
   - All fetch requests
   - Response status codes
   - Request duration
   - Authentication failures (401/403)

4. **Navigation**
   - Page transitions
   - Route changes
   - Page visibility changes

5. **Authentication Events**
   - Login attempts
   - Logout events
   - Session changes
   - Permission failures

---

## How to Use

### 1. Access the Debug Dashboard

Visit: https://magazine.stepperslife.com/debug

This dashboard shows:
- Real-time event timeline
- Error logs with stack traces
- API call history
- User session tracking

### 2. Features of the Dashboard

- **Auto-Refresh**: Updates every 5 seconds when enabled
- **Export**: Download all events as JSON for analysis
- **Error Highlighting**: Red alerts for errors
- **Detailed View**: Expand any event to see full details

### 3. When Something Goes Wrong

If you encounter a problem:

1. **The system automatically captures**:
   - The exact error message
   - The URL where it happened
   - The time it occurred
   - What you clicked or did
   - The API calls that failed
   - Your session information

2. **To view the error**:
   - Go to /debug
   - Look for red error entries
   - Click "View details" to see the full error
   - Export the log if needed

---

## Example Error Tracking

When an error occurs, you'll see entries like:

```
ERROR | auth | Authentication failed: 401
GET /api/dashboard - 401
Time: 14:32:15

Details:
{
  "endpoint": "/api/dashboard",
  "status": 401,
  "duration": 234ms,
  "userId": "iradwatkins@gmail.com"
}
```

---

## Session Tracking

Each user session is tracked with:
- Unique session ID
- All actions performed
- Errors encountered
- API calls made
- Navigation path

---

## API Endpoints

### Track Event (Internal)
`POST /api/debug/track` - Receives tracking events from client

### Get Events
`GET /api/debug/track?limit=100` - Retrieve recent events
`GET /api/debug/track?type=errors` - Get only errors
`GET /api/debug/track?sessionId=xxx` - Get events for specific session

---

## Database Storage

Critical events are stored in the `debug_logs` table:
- Error events
- Authentication events
- Available for long-term analysis

Redis stores recent events for fast access:
- Last 1000 events per session
- Last 100 errors globally
- 24-hour retention

---

## Privacy & Security

- No passwords are logged
- Sensitive fields are filtered
- Session data expires after 24 hours
- Only admins can access /debug

---

## Testing the System

1. **Test Error Tracking**:
   - Try to access a protected page without login
   - The 401 error will be logged

2. **Test Action Tracking**:
   - Click any button
   - Submit a form
   - Navigate between pages
   - All actions appear in the timeline

3. **Test API Tracking**:
   - Every API call is logged
   - Duration and status are recorded

---

## Troubleshooting

### If tracking isn't working:

1. Check if Redis is running:
```bash
redis-cli ping
```

2. Check the debug API:
```bash
curl https://magazine.stepperslife.com/api/debug/track
```

3. View PM2 logs:
```bash
pm2 logs magazine-stepperslife --lines 100
```

---

## Benefits

1. **Instant Problem Detection**: Know immediately when something breaks
2. **User Journey Tracking**: See exactly what users did before an error
3. **Performance Monitoring**: Track slow API calls
4. **Authentication Issues**: Identify login problems
5. **Historical Analysis**: Export and analyze patterns

---

## Quick Links

- **Debug Dashboard**: https://magazine.stepperslife.com/debug
- **Export Logs**: Use the "Export JSON" button
- **Auto-Refresh**: Toggle for real-time monitoring

---

## Summary

This monitoring system ensures that:
- ✅ Every error is captured
- ✅ Every user action is tracked
- ✅ Every API call is logged
- ✅ You can see exactly what went wrong
- ✅ Problems can be diagnosed immediately

Now when you test the website and something doesn't work, just go to /debug to see exactly what happened!