import React from 'react';
import styles from './SocialLayout.module.css';
import { Sidebar } from './socialComponent';

interface LayoutProps {
  children: React.ReactNode;
}

const SocialLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar>{children}</Sidebar>
    </div>
  );
};

export default SocialLayout;