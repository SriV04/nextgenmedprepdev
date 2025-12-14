import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

interface EmailLogStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
  bounced: number;
  successRate: number;
}

interface DomainStats {
  domain: string;
  total: number;
  sent: number;
  failed: number;
  successRate: number;
}

/**
 * Get email delivery statistics for a specific time period
 */
export async function getEmailStats(
  startDate?: Date,
  endDate?: Date
): Promise<EmailLogStats> {
  let query = supabase
    .from('email_logs')
    .select('status');

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching email stats:', error);
    throw error;
  }

  const stats: EmailLogStats = {
    total: data.length,
    sent: data.filter(log => log.status === 'sent').length,
    failed: data.filter(log => log.status === 'failed').length,
    pending: data.filter(log => log.status === 'pending').length,
    bounced: data.filter(log => log.status === 'bounced').length,
    successRate: 0
  };

  stats.successRate = stats.total > 0 
    ? (stats.sent / stats.total) * 100 
    : 0;

  return stats;
}

/**
 * Get email delivery statistics by domain
 */
export async function getEmailStatsByDomain(
  startDate?: Date,
  endDate?: Date
): Promise<DomainStats[]> {
  let query = supabase
    .from('email_logs')
    .select('recipient_domain, status');

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching email stats by domain:', error);
    throw error;
  }

  // Group by domain
  const domainMap = new Map<string, { total: number; sent: number; failed: number }>();

  data.forEach(log => {
    const domain = log.recipient_domain || 'unknown';
    if (!domainMap.has(domain)) {
      domainMap.set(domain, { total: 0, sent: 0, failed: 0 });
    }

    const stats = domainMap.get(domain)!;
    stats.total++;
    if (log.status === 'sent') stats.sent++;
    if (log.status === 'failed') stats.failed++;
  });

  // Convert to array and calculate success rates
  const domainStats: DomainStats[] = Array.from(domainMap.entries()).map(([domain, stats]) => ({
    domain,
    total: stats.total,
    sent: stats.sent,
    failed: stats.failed,
    successRate: (stats.sent / stats.total) * 100
  }));

  // Sort by total count descending
  domainStats.sort((a, b) => b.total - a.total);

  return domainStats;
}

/**
 * Get failed email logs for a specific domain
 */
export async function getFailedEmailsByDomain(
  domain: string,
  limit: number = 50
): Promise<any[]> {
  const { data, error } = await supabase
    .from('email_logs')
    .select('*')
    .eq('recipient_domain', domain)
    .eq('status', 'failed')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`Error fetching failed emails for ${domain}:`, error);
    throw error;
  }

  return data;
}

/**
 * Get email logs for a specific recipient
 */
export async function getEmailLogsByRecipient(
  recipient: string
): Promise<any[]> {
  const { data, error } = await supabase
    .from('email_logs')
    .select('*')
    .eq('recipient', recipient)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching email logs for ${recipient}:`, error);
    throw error;
  }

  return data;
}

/**
 * Get email logs by type
 */
export async function getEmailLogsByType(
  emailType: string,
  startDate?: Date,
  endDate?: Date
): Promise<any[]> {
  let query = supabase
    .from('email_logs')
    .select('*')
    .eq('email_type', emailType)
    .order('created_at', { ascending: false });

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching email logs for type ${emailType}:`, error);
    throw error;
  }

  return data;
}

/**
 * Check if Hotmail/Outlook emails are being delivered
 */
export async function checkHotmailOutlookDelivery(): Promise<{
  hotmail: DomainStats;
  outlook: DomainStats;
  recommendations: string[];
}> {
  const domainStats = await getEmailStatsByDomain();
  
  const hotmail = domainStats.find(s => s.domain === 'hotmail.com') || {
    domain: 'hotmail.com',
    total: 0,
    sent: 0,
    failed: 0,
    successRate: 0
  };

  const outlook = domainStats.find(s => s.domain === 'outlook.com') || {
    domain: 'outlook.com',
    total: 0,
    sent: 0,
    failed: 0,
    successRate: 0
  };

  const recommendations: string[] = [];

  if (hotmail.successRate < 80 || outlook.successRate < 80) {
    recommendations.push('⚠️ Low delivery rate detected for Hotmail/Outlook');
    recommendations.push('Consider implementing SPF, DKIM, and DMARC records');
    recommendations.push('Verify your domain is not on any blacklists');
    recommendations.push('Consider using a dedicated email service like SendGrid, Mailgun, or Amazon SES');
  }

  if (hotmail.total === 0 && outlook.total === 0) {
    recommendations.push('ℹ️ No emails sent to Hotmail/Outlook addresses yet');
  }

  return { hotmail, outlook, recommendations };
}

// CLI tool for checking email stats
if (require.main === module) {
  (async () => {
    console.log('\n📊 Email Delivery Statistics\n');
    console.log('='.repeat(60));

    // Overall stats
    const stats = await getEmailStats();
    console.log('\n📈 Overall Stats:');
    console.log(`Total Emails: ${stats.total}`);
    console.log(`✅ Sent: ${stats.sent}`);
    console.log(`❌ Failed: ${stats.failed}`);
    console.log(`⏳ Pending: ${stats.pending}`);
    console.log(`🔄 Bounced: ${stats.bounced}`);
    console.log(`📊 Success Rate: ${stats.successRate.toFixed(2)}%`);

    // Domain stats
    console.log('\n\n📧 Stats by Domain:');
    console.log('='.repeat(60));
    const domainStats = await getEmailStatsByDomain();
    domainStats.forEach(domain => {
      const status = domain.successRate >= 90 ? '✅' : 
                    domain.successRate >= 70 ? '⚠️' : '❌';
      console.log(`${status} ${domain.domain.padEnd(20)} | Total: ${domain.total.toString().padStart(4)} | Sent: ${domain.sent.toString().padStart(4)} | Failed: ${domain.failed.toString().padStart(4)} | Success: ${domain.successRate.toFixed(1)}%`);
    });

    // Hotmail/Outlook specific check
    console.log('\n\n🔍 Hotmail/Outlook Delivery Check:');
    console.log('='.repeat(60));
    const { hotmail, outlook, recommendations } = await checkHotmailOutlookDelivery();
    
    console.log('\nHotmail.com:');
    console.log(`  Total: ${hotmail.total} | Sent: ${hotmail.sent} | Failed: ${hotmail.failed} | Success: ${hotmail.successRate.toFixed(1)}%`);
    
    console.log('\nOutlook.com:');
    console.log(`  Total: ${outlook.total} | Sent: ${outlook.sent} | Failed: ${outlook.failed} | Success: ${outlook.successRate.toFixed(1)}%`);

    if (recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      recommendations.forEach(rec => console.log(`  ${rec}`));
    }

    console.log('\n' + '='.repeat(60) + '\n');
  })().catch(console.error);
}
