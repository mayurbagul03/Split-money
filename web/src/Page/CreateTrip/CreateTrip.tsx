import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { Page } from "../../components/Page";
import { PageHeader } from "../../components/PageHeader";
import { TextField } from "../../components/TextField";
import { api, errorMessage } from "../../services/api";
import type { Trip } from "../../types";
import styles from "./CreateTrip.module.css";

interface PersonRow {
  key: number;
  name: string;
}

type Errors = Partial<Record<"name" | "people" | "endDate", string>>;

export function CreateTrip() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [people, setPeople] = useState<PersonRow[]>([
    { key: 1, name: "" },
    { key: 2, name: "" },
  ]);
  const nextKey = useRef(3);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const names = people.map((p) => p.name.trim()).filter(Boolean);

  function addPerson() {
    const key = nextKey.current;
    nextKey.current += 1;
    setPeople((rows) => [...rows, { key, name: "" }]);
  }

  function updatePerson(key: number, value: string) {
    setPeople((rows) =>
      rows.map((row) => (row.key === key ? { ...row, name: value } : row)),
    );
  }

  function removePerson(key: number) {
    setPeople((rows) => rows.filter((row) => row.key !== key));
  }

  function validate(): Errors {
    const found: Errors = {};
    if (!name.trim()) {
      found.name = "Give your trip a name.";
    }
    if (names.length === 0) {
      found.people = "Add at least one person.";
    } else if (
      new Set(names.map((n) => n.toLowerCase())).size !== names.length
    ) {
      found.people = "Each person needs a different name.";
    }
    if (startDate && endDate && endDate < startDate) {
      found.endDate = "The end date is before the start date.";
    }
    return found;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    setFormError(null);
    try {
      const trip = await api.post<Trip>("/trips", {
        name: name.trim(),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        members: names,
      });
      navigate(`/trips/${trip.id}`, { replace: true });
    } catch (error) {
      setFormError(errorMessage(error));
      setSaving(false);
    }
  }

  return (
    <Page
      footer={
        <Button type="submit" form="create-trip" fullWidth disabled={saving}>
          {saving ? "Creating trip…" : "Create trip"}
        </Button>
      }
    >
      <PageHeader title="New trip" backTo="/" backLabel="Back to your trips" />

      <form
        id="create-trip"
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
      >
        {formError && <Alert>{formError}</Alert>}

        <TextField
          label="Trip name"
          placeholder="Miami weekend"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          maxLength={80}
          autoFocus
        />

        <div className={styles.dates}>
          <TextField
            label="Start date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="End date"
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            error={errors.endDate}
          />
        </div>

        <fieldset className={styles.people}>
          <legend className={styles.legend}>Who's going?</legend>

          {people.map((person, index) => (
            <div key={person.key} className={styles.personRow}>
              <TextField
                className={styles.personField}
                label={`Person ${index + 1}`}
                hideLabel
                placeholder={index === 0 ? "Your name" : "Friend's name"}
                value={person.name}
                onChange={(e) => updatePerson(person.key, e.target.value)}
                maxLength={40}
              />
              <button
                type="button"
                className={styles.remove}
                onClick={() => removePerson(person.key)}
                disabled={people.length === 1}
                aria-label={`Remove person ${index + 1}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          ))}

          {errors.people && (
            <p className={styles.fieldError}>{errors.people}</p>
          )}

          <Button
            variant="secondary"
            onClick={addPerson}
            className={styles.addPerson}
          >
            Add person
          </Button>
        </fieldset>
      </form>
    </Page>
  );
}
