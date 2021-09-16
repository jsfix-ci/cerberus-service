import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useKeycloak } from '../utils/keycloak';
import NavigationItem from './NavigationItem';

const Header = () => {
  const keycloak = useKeycloak();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.preventDefault();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    keycloak.logout({
      redirectUri: window.location.origin.toString(),
    });
  };

  return (
    <header className="govuk-header" role="banner" data-module="govuk-header">
      <a href="#main-content" className="govuk-skip-link">Skip to main content</a>

      <div className="govuk-header__container govuk-width-container">
        <div className="govuk-header__content">
          <Link to="/" className="govuk-header__link govuk-header__link--service-name">
            Cerberus
            <span style={{ display: 'block', fontSize: '0.55em' }}>powered by the Central Operations Platform</span>
          </Link>
          <button
            type="button"
            className={
                mobileMenuOpen
                  ? 'govuk-header__menu-button govuk-js-header-toggle govuk-header__menu-button--open'
                  : 'govuk-header__menu-button govuk-js-header-toggle'
              }
            aria-controls="navigation"
            aria-label="Show or hide navigation menu"
            onClick={(e) => {
              toggleMenu(e);
            }}
          >
            Menu
          </button>
          <nav>
            <ul
              id="navigation"
              className={
                mobileMenuOpen
                  ? 'govuk-header__navigation govuk-header__navigation--open'
                  : 'govuk-header__navigation'
              }
              aria-label="Navigation menu"
            >
              <NavigationItem href="/tasks">Tasks</NavigationItem>
              <li className="govuk-header__navigation-item">
                <Link to="/" onClick={(e) => logout(e)} className="govuk-header__link">Sign out</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
