import { useEffect, useState } from "react";
import { Button } from "./components/Button";
import styles from "./App.module.css";

function App() {
  const [apiStatus, setApiStatus] = useState("checking...");

  useEffect(() => {
    fetch("/api/health")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then(() => setApiStatus("connected"))
      .catch(() => setApiStatus("not reachable"));
  }, []);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Split Money</h1>
      <p className={styles.status}>API: {apiStatus}</p>

      <div className={styles.buttonRow}>
        <Button>Add expense</Button>
        <Button variant="secondary">Invite</Button>
      </div>

      <Button fullWidth>New trip</Button>
      <Button fullWidth disabled>
        Disabled
      </Button>
    </main>
  );
}

export default App;
