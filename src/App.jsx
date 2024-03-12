/* eslint-disable jsx-a11y/accessible-emoji */
// eslint-disable-next-line import/no-duplicates
import React from 'react';
import './App.scss';
// eslint-disable-next-line import/no-duplicates
import { useState } from 'react';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const combinedData = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(
    // eslint-disable-next-line no-shadow
    category => category.id === product.categoryId,
  );

  let user;

  if (category) {
    // eslint-disable-next-line no-shadow
    user = usersFromServer.find(user => user.id === category.ownerId);
  }

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleFilter = (userId) => {
    setSelectedUser(userId);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue('');
  };

  const handleResetFilters = () => {
    setSelectedUser(null);
    setSearchValue('');
    setSelectedCategories([]);
  };

  const handleCategoryClick = (categoryId) => {
    const index = selectedCategories.indexOf(categoryId);

    if (index !== -1) {
      setSelectedCategories(
        selectedCategories.filter(item => item !== categoryId),
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const filteredProducts = combinedData.filter(
    item => (!selectedUser || (item.user && item.user.id === selectedUser)) &&
      (selectedCategories.length === 0 ||
        selectedCategories.includes(item.categoryId)) &&
      (searchValue
        ? item.name.toLowerCase().includes(searchValue.toLowerCase())
        : true),
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => handleFilter(null)}
                className={!selectedUser ? 'is-active' : ''}
              >
                All
              </a>

              {usersFromServer.map((user, index) => (
                <a
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => handleFilter(user.id)}
                  className={selectedUser === user.id ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearchChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchValue && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleClearSearch}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${
                  selectedCategories.length === 0 ? '' : 'is-outlined'
                }`}
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>

              {categoriesFromServer.map((category, index) => (
                <a
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${
                    selectedCategories.includes(category.id)
                      ? 'is-info'
                      : ''
                  }`}
                  href="#/"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        {filteredProducts.length === 0 && (
          <div className="box table-container">
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="box table-container">
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className="fas fa-sort-down"
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className="fas fa-sort-up"
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(item => (
                  <tr key={item.id} data-cy="Product">
                    <td
                      className="has-text-weight-bold"
                      data-cy="ProductId"
                    >
                      {item.id}
                    </td>
                    <td data-cy="ProductName">{item.name}</td>
                    <td data-cy="ProductCategory">
                      {item.category && (
                        <span>
                          {item.category.icon}
                          {' '}
                          -
                          {' '}
                          {item.category.title}
                        </span>
                      )}
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={
                        (() => {
                          if (item.user && item.user.sex === 'm') {
                            return 'has-text-link';
                          }

                          if (item.user && item.user.sex === 'f') {
                            return 'has-text-danger';
                          }

                          return '';
                        })()
                      }
                    >
                      {item.user && item.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
