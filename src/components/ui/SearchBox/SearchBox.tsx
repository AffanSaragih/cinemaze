import React, { useRef } from 'react';
import clsx from 'clsx';
import styles from './SearchBox.module.scss';
import SearchIcon from '@/assets/Search.svg?react';
import CloseIcon from '@/assets/Close.svg?react';
import { useSearch } from '@/context/SearchContext';

interface SearchBoxProps {
  placeholder?: string;
  fullWidth?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Search Movie',
  fullWidth = false,
  onFocus,
  onBlur,
  value,
  onChange,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { openSearch, closeSearch, clearSearch } = useSearch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    onChange(next);
    if (next.trim()) openSearch();
    else closeSearch();
  };

  const handleClear = () => {
    clearSearch();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  const handleFocus = () => {
    openSearch();
    onFocus?.();
  };

  return (
    <div
      className={clsx(
        styles.searchBox,
        value && styles.focused,
        fullWidth && styles.fullWidth,
        className
      )}
    >
      <div className={styles.searchInputContainer}>
        <span className={styles.searchIconWrapper} aria-hidden>
          <SearchIcon className={styles.searchIcon} />
        </span>

        <input
          id='searchbox'
          ref={inputRef}
          type='text'
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className={styles.searchInput}
          role='searchbox'
          aria-label='Search movies'
          autoComplete='off'
          spellCheck={false}
        />

        {value && (
          <button
            type='button'
            className={styles.clearButtonWrapper}
            onClick={handleClear}
            aria-label='Clear search'
          >
            <CloseIcon className={styles.closeIcon} />
          </button>
        )}
      </div>
    </div>
  );
};
