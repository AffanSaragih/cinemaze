import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './Header.module.scss';
import { SearchBox } from '@/components/ui/SearchBox/SearchBox';
import { useSearch } from '@/context/SearchContext';

import CloseIcon from '@/assets/CloseRound.svg';
import LeftArrowIcon from '@/assets/LeftArrow.svg';
import MenuIcon from '@/assets/HamburgerMenu.svg';
import SearchIcon from '@/assets/Search.svg';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { searchTerm, setSearchTerm, searchOpen, openSearch, closeSearch } =
    useSearch();

  const isMobile = useIsMobile();
  const open = openSearch ?? (() => {});
  const close = closeSearch ?? (() => {});
  const elevated = scrolled || searchOpen;

  useEffect(() => {
    document.body.style.overflow =
      menuOpen || (isMobile && searchOpen) ? 'hidden' : 'auto';
  }, [menuOpen, searchOpen, isMobile]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = document.querySelector('header');
    if (!el) return;
    const apply = () => {
      const h = Math.round(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--header-height', `${h}px`);
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);

    const onResize = () => apply();
    window.addEventListener('resize', onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={clsx(styles.header, elevated && styles.scrolled)}
      >
        <div className='container'>
          <div className={styles.inner}>
            <div className={styles.logoArea}>
              <span className={styles.logoText}>cinemaze</span>
            </div>

            {/* Mobile actions */}
            <div className={styles.mobileActions}>
              <button
                className={styles.searchToggle}
                onClick={open}
                aria-label='Open search'
              >
                <SearchIcon />
              </button>
              <button
                className={styles.menuToggle}
                onClick={() => setMenuOpen(true)}
                aria-label='Open menu'
              >
                <MenuIcon />
              </button>
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

            {/* Desktop SearchBox (kanan atas) */}
            {!isMobile && (
              <div className={styles.search}>
                <div className={styles.searchDesktopWrap}>
                  <SearchBox
                    placeholder='Search Movie'
                    fullWidth
                    value={searchTerm}
                    onChange={(val) => {
                      setSearchTerm(val);
                      if (val.trim()) open();
                      else close();
                    }}
                    onFocus={() => {
                      if (searchTerm.trim()) open();
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Search overlay (mobile) */}
      {isMobile && (
        <div className={clsx(styles.searchOverlay, searchOpen && styles.open)}>
          <div className={styles.searchHeader}>
            <button
              className={styles.backButton}
              onClick={close}
              aria-label='Back'
            >
              <LeftArrowIcon />
            </button>

            <SearchBox
              placeholder='Search Movie'
              fullWidth
              value={searchTerm}
              onChange={(val) => {
                setSearchTerm(val);
                if (val.trim()) open();
                else close();
              }}
              onFocus={() => {
                if (searchTerm.trim()) open();
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
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
