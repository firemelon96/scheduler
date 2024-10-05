import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MeetingList } from './_components/meeting-list';
import { getUserMeetings } from '@/actions/meetings';
import { z } from 'zod';

export const metadata = {
  title: 'Your Meetings | Scheduler',
  description: 'View and manage your upcoming and past meetings',
};

const MeetingPage = () => {
  return (
    <Tabs defaultValue='upcoming'>
      <TabsList>
        <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
        <TabsTrigger value='past'>Past</TabsTrigger>
      </TabsList>
      <TabsContent value='upcoming'>
        <UpcomingMeeting />
      </TabsContent>
      <TabsContent value='past'>nyy</TabsContent>
    </Tabs>
  );
};

async function UpcomingMeeting() {
  const meetings = await getUserMeetings('upcoming');

  return <MeetingList type='upcoming' meetings={meetings} />;
}

export default MeetingPage;
