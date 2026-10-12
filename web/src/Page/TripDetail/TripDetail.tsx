import { useParams } from "react-router";
import { Alert } from "../../components/Alert";
import { Page } from "../../components/Page";
import { PageHeader } from "../../components/PageHeader";
import { useApi } from "../../hooks/useApi";
import type { Trip } from "../../types";
import { colorFor, initialOf } from "../../utils/avatar";
import { formatDateRange } from "../../utils/dates";
import styles from "./TripDetail.module.css";

export function TripDetail() {
  const { tripId = "" } = useParams();
  const { data: trip, error, loading } = useApi<Trip>(`/trips/${tripId}`);

  return (
    <Page>
      <PageHeader
        title={trip?.name ?? "Trip"}
        subtitle={
          trip ? formatDateRange(trip.startDate, trip.endDate) : undefined
        }
        backTo="/"
        backLabel="Back to your trips"
      />

      {loading && !trip && <p className={styles.status}>Loading trip…</p>}
      {error && <Alert>{error}</Alert>}

      {trip && (
        <ul className={styles.members}>
          {trip.members.map((member) => (
            <li key={member.id} className={styles.member}>
              <span
                className={styles.avatar}
                style={{ background: colorFor(member.name) }}
                aria-hidden="true"
              >
                {initialOf(member.name)}
              </span>
              {member.name}
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}
