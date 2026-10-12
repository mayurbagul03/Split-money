import { Route, Routes } from "react-router";
import { CreateTrip } from "./Page/CreateTrip";
import { NotFound } from "./Page/NotFound";
import { TripDetail } from "./Page/TripDetail";
import { TripList } from "./Page/TripList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TripList />} />
      <Route path="/trips/new" element={<CreateTrip />} />
      <Route path="/trips/:tripId" element={<TripDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;