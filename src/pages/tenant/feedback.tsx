// app/routes/[routeId]/feedback/page.tsx

import RouteFeedbackPage from "./feedback-component";

export default function Feedbacks({ params }: { params: { routeId: string } }) {
  return (
    <>
      <RouteFeedbackPage params={params} />
    </>
  );
}
