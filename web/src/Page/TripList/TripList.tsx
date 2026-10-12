import { Link } from "react-router";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { LinkButton } from "../../components/LinkButton";
import { Page } from "../../components/Page";
import { PageHeader } from "../../components/PageHeader";
import { useApi } from "../../hooks/useApi";
import type { TripListItem } from "../../types";
import { colorFor, initialOf } from "../../utils/avatar";
import { formatDateRange } from "../../utils/dates";
import styles from "./TripList.module.css";

function describeTrip(trip: TripListItem): string {
  const people = `${trip._count.members} ${trip._count.members === 1 ? "person" : "people"}`;
  const expenses = `${trip._count.expenses} ${trip._count.expenses === 1 ? "expense" : "expenses"}`;
  const dates = formatDateRange(trip.startDate, trip.endDate);
  return [dates, people, expenses].filter(Boolean).join(" · ");
}

export function TripList() {
  const {
    data: trips,
    error,
    loading,
    reload,
  } = useApi<TripListItem[]>("/trips");

  return (
    <Page
      footer={
        <LinkButton to="/trips/new" fullWidth>
          New trip
        </LinkButton>
      }
    >
      <PageHeader eyebrow="Split Money" title="Your trips" />

      {loading && !trips && (
        <p className={styles.status}>Loading your trips…</p>
      )}

      {error && (
        <Alert
          action={
            <Button variant="secondary" onClick={reload}>
              Try again
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {trips && trips.length === 0 && (
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>No trips yet</h2>
          <p className={styles.emptyText}>
            Create a trip, add your friends, and Split Money keeps track of who
            owes whom.
          </p>
        </div>
      )}

      {trips && trips.length > 0 && (
        <ul className={styles.list}>
          {trips.map((trip) => (
            <li key={trip.id}>
              <Link to={`/trips/${trip.id}`} className={styles.card}>
                <span
                  className={styles.tile}
                  style={{ background: colorFor(trip.name) }}
                  aria-hidden="true"
                >
                  {initialOf(trip.name)}
                </span>
                <span className={styles.info}>
                  <span className={styles.name}>{trip.name}</span>
                  <span className={styles.meta}>{describeTrip(trip)}</span>
                </span>
                <svg
                  className={styles.chevron}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}
