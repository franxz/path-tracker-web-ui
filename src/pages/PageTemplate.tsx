import React from "react";
import styles from "./PageTemplate.module.css";

interface PageTemplateProps {
  topBar: React.ReactNode;
  content: React.ReactNode;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  topBar,
  content,
}) => {
  return (
    <div className={styles.pageContainer}>
      {topBar}
      {content}
    </div>
  );
};

export default PageTemplate;
