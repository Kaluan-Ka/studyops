import Link from "next/link";

import styles from "@/app/content.module.css";

type NavigationItem = {
  href: string;
  title: string;
};

type ContentNavigationProps = {
  previous?: NavigationItem;
  next?: NavigationItem;
};

export function ContentNavigation({ previous, next }: ContentNavigationProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav className={styles.contentNavigation} aria-label="Navegacao entre sessoes">
      {previous ? (
        <Link href={previous.href} className={styles.navigationLink}>
          <span>Anterior</span>
          <strong>{previous.title}</strong>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className={`${styles.navigationLink} ${styles.navigationNext}`}>
          <span>Proxima</span>
          <strong>{next.title}</strong>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
