
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

interface User {
  id: string;
  email: string;
}

interface Stats {
  points: number;
  rank: string;
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
}

interface Category {
  name: string;
  completed: number;
  total: number;
  completionRate: number;
}

interface EmailSummary {
  userId: string;
  email: string;
  date: string;
  stats: Stats;
  categories: Category[];
  senderEmail?: string; // Add optional senderEmail field
}

serve(async (req) => {
  // Get request body
  const { summary } = await req.json() as { summary: EmailSummary };
  
  // Get environment variables
  const smtpHost = Deno.env.get("SMTP_HOST") || "";
  const smtpPort = Deno.env.get("SMTP_PORT") ? parseInt(Deno.env.get("SMTP_PORT") || "") : 587;
  const smtpUser = Deno.env.get("SMTP_USER") || "";
  const smtpPassword = Deno.env.get("SMTP_PASSWORD") || "";
  const defaultSenderEmail = Deno.env.get("SENDER_EMAIL") || "noreply@shadowtaskmanager.com";
  
  // Use provided sender email or fall back to the default
  const senderEmail = summary.senderEmail || defaultSenderEmail;
  
  try {
    const client = new SmtpClient();
    
    // Connect to SMTP server
    await client.connectTLS({
      hostname: smtpHost,
      port: smtpPort,
      username: smtpUser,
      password: smtpPassword,
    });
    
    // Format date
    const dateFormatted = new Date(summary.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    // Create email HTML content
    const emailHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6e42e5 0%, #8e44ad 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 20px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
            .stats { display: flex; justify-content: space-between; margin: 15px 0; flex-wrap: wrap; }
            .stat-item { background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); flex: 1; min-width: 120px; margin: 5px; text-align: center; }
            .category { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .progress-bar { height: 10px; background: #eee; border-radius: 5px; overflow: hidden; margin-top: 5px; }
            .progress { height: 100%; background: linear-gradient(135deg, #6e42e5 0%, #8e44ad 100%); }
            h2, h3 { margin-top: 0; color: #444; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Shadow Task Manager</h1>
              <p>Daily Summary - ${dateFormatted}</p>
            </div>
            <div class="content">
              <h2>Hello,</h2>
              <p>Here's your daily performance summary:</p>
              
              <div class="stats">
                <div class="stat-item">
                  <h3>Points</h3>
                  <div>${summary.stats.points}</div>
                </div>
                <div class="stat-item">
                  <h3>Rank</h3>
                  <div>${summary.stats.rank}</div>
                </div>
                <div class="stat-item">
                  <h3>Tasks Completed</h3>
                  <div>${summary.stats.completedTasks} / ${summary.stats.totalTasks}</div>
                </div>
                <div class="stat-item">
                  <h3>Completion Rate</h3>
                  <div>${summary.stats.completionRate}%</div>
                </div>
              </div>
              
              <h2>Categories</h2>
              ${summary.categories.map(category => `
                <div class="category">
                  <h3>${category.name}</h3>
                  <div>Completed: ${category.completed} / ${category.total}</div>
                  <div class="progress-bar">
                    <div class="progress" style="width: ${category.completionRate}%"></div>
                  </div>
                </div>
              `).join('')}
              
              <p>Keep up the good work and continue completing tasks to level up your rank!</p>
            </div>
            <div class="footer">
              <p>This is an automated message from Shadow Task Manager. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Send email
    await client.send({
      from: senderEmail,
      to: summary.email,
      subject: `Shadow Task Manager - Daily Summary (${dateFormatted})`,
      content: "Your email client doesn't support HTML",
      html: emailHtml,
    });
    
    // Disconnect
    await client.close();
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to send email:", error);
    
    // Return error response
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
