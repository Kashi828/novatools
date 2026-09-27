import { getMaintenanceSettings } from '@/lib/maintenance';
import { MaintenancePage } from '@/components/maintenance-page';

export const dynamic = 'force-dynamic';

export default async function MaintenanceRoute() {
  const settings = await getMaintenanceSettings();
  return <MaintenancePage settings={settings} />;
}
