import { NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/admin';
import { getAdminFeatureSettings } from '@/lib/admin-feature-settings';
import { getCommentModerationIds } from '@/lib/comment-moderation';
import { getReadContactIds, listContacts } from '@/lib/contacts';
import { listComments } from '@/lib/comments';
import { getHiddenCategorySlugs } from '@/lib/category-visibility';
import { getHiddenSlugs } from '@/lib/tool-visibility';
import { getEffectivePremiumToolSlugs } from '@/lib/tool-premium';
import { getSiteSettings } from '@/lib/site-settings';
import { getMaintenanceSettings, isMaintenanceActive } from '@/lib/maintenance';
import { redis } from '@/lib/redis';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';
import '@/data/ai-tools';
import '@/data/extra-tools';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!(await isAdminUser())) return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  const checkedAt = new Date().toISOString(); const started = Date.now(); let redisOk=false; let latencyMs:number|null=null;
  try { await redis.ping(); redisOk=true; latencyMs=Date.now()-started; } catch {}
  const [comments,contacts,readContacts,moderation,hiddenTools,hiddenCategories,premiumTools,featureSettings,siteSettings,maintenance] = await Promise.all([listComments(),listContacts(),getReadContactIds(),getCommentModerationIds(),getHiddenSlugs(),getHiddenCategorySlugs(),getEffectivePremiumToolSlugs(tools),getAdminFeatureSettings(),getSiteSettings(),getMaintenanceSettings()]);
  const flagged=new Set(moderation.flagged); const hiddenComments=new Set(moderation.hidden); const read=new Set(readContacts);
  const adminComments=comments.map(c=>({...c,status:hiddenComments.has(c.id)?'hidden':flagged.has(c.id)?'flagged':'visible'}));
  const adminContacts=contacts.map(c=>({...c,status:read.has(c.id)?'read':'unread'}));
  const categoryCounts=categories.map(c=>({slug:c.slug,name:c.name,toolCount:tools.filter(t=>t.category===c.slug).length,hidden:hiddenCategories.includes(c.slug)}));
  return NextResponse.json({checkedAt,uptime:formatUptime(process.uptime()),redis:{ok:redisOk,latencyMs},environment:{clerk:Boolean(process.env.CLERK_SECRET_KEY),redis:Boolean(process.env.UPSTASH_REDIS_REST_URL&&process.env.UPSTASH_REDIS_REST_TOKEN),gemini:Boolean(process.env.GEMINI_API_KEY),adminEmail:Boolean(process.env.ADMIN_EMAIL)},toolTotal:tools.length,hiddenTools,premiumTools,comments:adminComments,contacts:adminContacts,featureSettings,siteSettings,maintenance,maintenanceActive:isMaintenanceActive(maintenance),categoryCounts});
}
function formatUptime(seconds:number){const total=Math.max(0,Math.floor(seconds));const days=Math.floor(total/86400);const hours=Math.floor((total%86400)/3600);const minutes=Math.floor((total%3600)/60);if(days)return `${days}d ${hours}h`;if(hours)return `${hours}h ${minutes}m`;return `${minutes}m`;}
