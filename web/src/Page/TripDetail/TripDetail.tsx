import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { Alert } from "../../components/Alert";
import { Avatar } from "../../components/Avatar";
import { Button } from "../../components/Button";
import { CategoryIcon } from "../../components/CategoryIcon";
import { LinkButton } from "../../components/LinkButton";
import { Page } from "../../components/Page";
import { PageHeader } from "../../components/PageHeader";
import { useApi } from "../../hooks/useApi";
import { api, errorMessage } from "../../services/api";
import type { Expense, Trip, TripSummary } from "../../types";
import { formatDateRange, formatDay } from "../../utils/dates";
import { formatMoney } from "../../utils/money";
import styles from "./TripDetail.module.css";

function splitDescription(expense: Expense): string {
  switch (expense.splitType) {
    case "EQUAL":
      return `Split equally between ${expense.shares.length}`;
    case "EXACT":
      return "Split by exact amounts";
    case "SHARES":
      return "Split by shares";
  }
}

function groupByDay(expenses: Expense[]) {
  const groups = new Map<string, Expense[]>();
  for (const expense of expenses) {
    const day = expense.spentAt.slice(0, 10);
    groups.set(day, [...(groups.get(day) ?? []), expense]);
  }
  return [...groups.entries()].map(([day, items]) => ({
    day,
    label: formatDay(day),
    items,
  }));
}

export function TripDetail() {
  const { tripId = "" } = useParams();
  const trip = useApi<Trip>(`/trips/${tripId}`);
  const expenses = useApi<Expense[]>(`/trips/${tripId}/expenses`);
  const summary = useApi<TripSummary>(`/trips/${tripId}/summary`);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const names = useMemo(
    () => new Map(trip.data?.members.map((m) => [m.id, m.name]) ?? []),
    [trip.data],
  );
  const days = useMemo(() => groupByDay(expenses.data ?? []), [expenses.data]);

  const currency = trip.data?.currency ?? "USD";
  const money = (cents: number) => formatMoney(cents, currency);

  async function handleDelete(expense: Expense) {
    const confirmed = window.confirm(
      `Delete "${expense.description}"? This can't be undone.`,
    );
    if (!confirmed) return;

    setDeleteError(null);
    try {
      await api.delete(`/trips/${tripId}/expenses/${expense.id}`);
      expenses.reload();
      summary.reload();
    } catch (error) {
      setDeleteError(errorMessage(error));
    }
  }

  if (trip.error) {
    return (
      <Page>
        <PageHeader title="Trip" backTo="/" backLabel="Back to your trips" />
        <Alert
          action={
            <LinkButton to="/" variant="secondary">
              Go to your trips
            </LinkButton>
          }
        >
          {trip.error}
        </Alert>
      </Page>
    );
  }

  const data = trip.data;
  const paymentsLeft = summary.data?.suggestedPayments.length ?? 0;
  const expenseCount = expenses.data?.length ?? 0;

  return (
    <Page
      footer={
        <LinkButton to={`/trips/${tripId}/expenses/new`} fullWidth>
          Add expense
        </LinkButton>
      }
    >
      <PageHeader
        title={data?.name ?? "Loading…"}
        subtitle={
          data ? formatDateRange(data.startDate, data.endDate) : undefined
        }
        backTo="/"
        backLabel="Back to your trips"
      />

      {data && (
        <div className={styles.people}>
          <div className={styles.avatarStack}>
            {data.members.map((member) => (
              <Avatar key={member.id} name={member.name} />
            ))}
          </div>
          <span className={styles.peopleLabel}>
            {data.members.map((m) => m.name).join(", ")}
          </span>
        </div>
      )}

      {summary.data && (
        <section className={styles.total} aria-label="Trip total">
          <span className={styles.totalLabel}>Total spent</span>
          <span className={styles.totalAmount}>
            {money(summary.data.totalSpent)}
          </span>
          <span className={styles.totalMeta}>
            {expenseCount} {expenseCount === 1 ? "expense" : "expenses"}
            {data &&
              data.members.length > 0 &&
              expenseCount > 0 &&
              ` · about ${money(Math.round(summary.data.totalSpent / data.members.length))} per person`}
          </span>
        </section>
      )}

      {summary.data &&
        expenseCount > 0 &&
        (paymentsLeft > 0 ? (
          <Link to={`/trips/${tripId}/settle`} className={styles.settleCard}>
            <span className={styles.settleText}>
              <strong>Settle up</strong>
              <span>
                {paymentsLeft} {paymentsLeft === 1 ? "payment" : "payments"}{" "}
                will settle everyone
              </span>
            </span>
            <svg
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
        ) : (
          <p className={styles.settled}>Everyone is settled up.</p>
        ))}

      {deleteError && <Alert>{deleteError}</Alert>}
      {expenses.error && (
        <Alert
          action={
            <Button variant="secondary" onClick={expenses.reload}>
              Try again
            </Button>
          }
        >
          {expenses.error}
        </Alert>
      )}

      <section className={styles.expenses} aria-labelledby="expenses-heading">
        <h2 id="expenses-heading" className={styles.sectionTitle}>
          Expenses
        </h2>

        {expenses.loading && !expenses.data && (
          <p className={styles.status}>Loading expenses…</p>
        )}

        {expenses.data && expenses.data.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No expenses yet</p>
            <p className={styles.emptyText}>
              Add the first bill: a dinner, a hotel, or gas. Split Money works
              out who owes what.
            </p>
          </div>
        )}

        {days.map((group) => (
          <div key={group.day} className={styles.day}>
            <h3 className={styles.dayLabel}>{group.label}</h3>
            <ul className={styles.list}>
              {group.items.map((expense) => (
                <li key={expense.id}>
                  <details className={styles.expense}>
                    <summary className={styles.expenseRow}>
                      <CategoryIcon category={expense.category} />
                      <span className={styles.expenseInfo}>
                        <span className={styles.expenseTitle}>
                          {expense.description}
                        </span>
                        <span className={styles.expenseMeta}>
                          {expense.paidBy.name} paid
                        </span>
                      </span>
                      <span className={styles.expenseAmount}>
                        {money(expense.amount)}
                      </span>
                    </summary>

                    <div className={styles.expenseDetails}>
                      <p className={styles.splitType}>
                        {splitDescription(expense)}
                      </p>
                      <ul className={styles.shares}>
                        {expense.shares.map((share) => {
                          const name = names.get(share.memberId) ?? "Someone";
                          return (
                            <li key={share.memberId} className={styles.share}>
                              <Avatar name={name} size="sm" />
                              <span className={styles.shareName}>
                                {name}
                                {share.shares !== null &&
                                  ` · ${share.shares} ${share.shares === 1 ? "share" : "shares"}`}
                              </span>
                              <span className={styles.shareAmount}>
                                {money(share.amount)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(expense)}
                      >
                        Delete expense
                      </Button>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </Page>
  );
}
