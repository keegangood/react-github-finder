import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
  SEARCH_USERS,
  GET_USER,
  CLEAR_USERS,
  GET_REPOS,
  SET_LOADING,
} from '../types';

const GithubState = props => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Search Users
  const searchUsers = async query => {
    setLoading();

    let response = await axios.get(
      `https://api.github.com/search/users?q=${query}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    dispatch({ type: SEARCH_USERS, payload: response.data.items });
  };

  //Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  //Get single Github user
  const getUser = async username => {
    setLoading();

    let headers = {
      client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
      client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
    };

    let response = await axios.get(
      `https://api.github.com/users/${username}`,
      headers
    );

    dispatch({
      type: GET_USER,
      payload: response.data,
    });
  };

  //get user's repos
  const getUserRepos = async username => {
    setLoading();

    let headers = {
      client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
      client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
    };

    let response = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc,`,
      headers
    );

    dispatch({
      type: GET_REPOS,
      payload: response.data,
    });
  };

  // Clear Users
  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
