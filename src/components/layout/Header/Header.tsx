import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './Header.module.scss';
import SearchBox from '@/components/ui/SearchB0x/SearchBox';
import CloseIcon from '@/assets/Close.svg';
import LeftArrowIcon from '@/assets/LeftArrow.svg';
import MenuIcon from '@/assets/HamburgerMenu.svg';
import SearchIcon from '@/assets/Search.svg';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : 'auto';
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={clsx(styles.header, scrolled && styles.scrolled)}
      >
        <div className='container'>
          <div className={styles.inner}>
            <div className={styles.logoArea}>
              <span className={styles.logoText}>cinemaze</span>
            </div>

            <div className={styles.mobileActions}>
              <div
                className={styles.searchToggle}
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon />
              </div>
              <div
                className={styles.menuToggle}
                onClick={() => setMenuOpen(true)}
              >
                <MenuIcon />
              </div>
            </div>

            {/* Nav (desktop only) */}
            <nav className={styles.nav}>
              <a href='/' className={styles.navLink}>
                Home
              </a>
              <a href='/favorites' className={styles.navLink}>
                Favorites
              </a>
            </nav>

            {/* SearchBox (desktop only) */}
            <div className={styles.search}>
              <SearchBox placeholder='Search Movie' />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Overlay Search */}
      <div className={clsx(styles.searchOverlay, searchOpen && styles.open)}>
        <div className={styles.searchHeader}>
          <button
            className={styles.backButton}
            onClick={() => setSearchOpen(false)}
            aria-label='Back'
          >
            <LeftArrowIcon />
          </button>
          <SearchBox placeholder='Search Movie' fullWidth />
        </div>
      </div>

      {/* Overlay Menu (mobile) */}
      <div className={clsx(styles.mobileOverlay, menuOpen && styles.open)}>
        <div className={styles.overlayHeader}>
          <span className={styles.logoText}>cinemaze</span>
          <button
            className={styles.closeButton}
            onClick={() => setMenuOpen(false)}
            aria-label='Close menu'
          >
            <CloseIcon />
          </button>
        </div>

        <nav className={styles.navMobile}>
          <a href='/' onClick={() => setMenuOpen(false)}>
            Home
          </a>
          <a href='/favorites' onClick={() => setMenuOpen(false)}>
            Favorites
          </a>
        </nav>
      </div>
    </>
  );
};
