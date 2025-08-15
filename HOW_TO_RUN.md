# How to Run the ELID Access Control Dashboard

## Quick Start

1. **Open Terminal** and navigate to the project directory:
   ```bash
   cd /Users/carrie/Desktop/NexStack/elid-access-claudeupdate
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Wait for the server to start**. You should see:
   ```
   ▲ Next.js 15.2.4
   - Local:        http://localhost:3000
   ✓ Ready in XXXXms
   ```

5. **Open your browser** and go to:
   - **http://localhost:3000**

## Important URLs

Once the server is running, you can access:

- **Main Dashboard**: http://localhost:3000/dashboard
- **Component Showcase**: http://localhost:3000/dashboard/showcase
- **Security Center**: http://localhost:3000/dashboard/security-dashboard
- **Real-Time Monitoring**: http://localhost:3000/dashboard/monitoring/real-time

## What You'll See

### In the Showcase (http://localhost:3000/dashboard/showcase):

1. **Phase 1 - Security Foundation**
   - Emergency lockdown controls
   - Real-time security metrics
   - Connection status indicators

2. **Phase 3 - Monitoring & Incidents**
   - Multi-view monitoring dashboard
   - Intelligent event feed
   - Incident response workflow
   - Investigation tools

3. **Phase 4 - Analytics & Reporting**
   - Executive overview with KPIs
   - Operational analytics
   - Report builder
   - Compliance reporting

4. **Phase 5 - UX & Accessibility**
   - Personalization settings
   - Productivity tools (Command Palette: Cmd+K)
   - Accessibility compliance
   - Multi-language support

## Troubleshooting

If you can't access the application:

1. **Check if the server is running**:
   - Look for "✓ Ready" message in terminal
   - Make sure there are no error messages

2. **Try a different browser**:
   - Chrome, Firefox, Safari, or Edge

3. **Clear browser cache**:
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

4. **Check for port conflicts**:
   ```bash
   lsof -i :3000
   ```
   If something else is using port 3000, kill it or use a different port:
   ```bash
   npm run dev -- -p 3001
   ```

5. **Restart the server**:
   - Press Ctrl+C in terminal to stop
   - Run `npm run dev` again

## Features to Explore

1. **Click "Showcase" in the sidebar** (sparkles icon with "DEMO" badge)
2. **Navigate through the tabs** to see different phases
3. **Try the Command Palette** by pressing Cmd+K
4. **Test the emergency lockdown** in the Security Quick Controls
5. **Explore the multi-language support** in Phase 5

## Note

The application is set to automatically redirect to the dashboard. If you see a login page, it means the authentication bypass didn't work. In that case, you can:
- Use any email/password (authentication is not implemented)
- Or directly navigate to http://localhost:3000/dashboard