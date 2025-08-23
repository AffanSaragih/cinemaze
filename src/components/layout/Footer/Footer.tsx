import React from 'react';
import styles from './Footer.module.scss';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';

const socialLinks = [
  { icon: FaGithub, url: 'https://github.com/AffanSaragih', label: 'GitHub' },
  {
    icon: FaLinkedin,
    url: 'https://www.linkedin.com/in/affansaragih/',
    label: 'LinkedIn',
  },
  {
    icon: FaInstagram,
    url: 'https://www.instagram.com/muhammadchoirulaffan/',
    label: 'Instagram',
  },
  {
    icon: FaEnvelope,
    url: 'mailto:mchoirulaffan@gmail.com?subject=Hello%20Affan%20(From%20Movie%20Explorer)&body=Halo%20Affan%2C%20saya%20tertarik%20terkait%20Movie%20Explorer.%20%0A%0AMohon%20info%20lebih%20lanjutnya%20ya!',
    label: 'Email',
  },
];

export const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div
      className='container'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <div className={styles.socialRow}>
        {socialLinks.map((item, idx) => {
          const Icon = item.icon;
          return (
            <a
              key={idx}
              href={item.url}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.socialIcon}
              aria-label={item.label}
            >
              <Icon className={styles.icon} />
            </a>
          );
        })}
      </div>
      <div className={styles.copy}>
        © {new Date().getFullYear()} cinemaze. All rights reserved.
      </div>
    </div>
  </footer>
);
