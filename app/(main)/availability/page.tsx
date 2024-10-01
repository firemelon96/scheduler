import { getUserAvailability } from '@/actions/availability';
import { defaultAvailability } from './data';
import { AvailabilityForm } from '@/components/availability-form';

const AvailabilityPage = async () => {
  const availability = await getUserAvailability();

  return <AvailabilityForm initialData={availability || defaultAvailability} />;
};

export default AvailabilityPage;
