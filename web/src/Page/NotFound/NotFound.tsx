import { LinkButton } from "../../components/LinkButton";
import { Page } from "../../components/Page";
import { PageHeader } from "../../components/PageHeader";
import styles from "./NotFound.module.css";

export function NotFound() {
  return (
    <Page>
      <PageHeader title="Page not found" />
      <p className={styles.text}>
        This page doesn't exist. It may have been moved or the link is wrong.
      </p>
      <LinkButton to="/" variant="secondary">
        Go to your trips
      </LinkButton>
    </Page>
  );
}
