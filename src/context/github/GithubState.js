import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
    SEARCH_USERS,
    SET_LOADING,
    CLEAR_USERS,
    GET_USER,
    GET_REPOS
} from '../types';

let githubToken;

if (process.env.NODE_ENV !== 'production') {
    githubToken = process.env.REACT_APP_GITHUB_TOKEN;
} else {
    githubToken = process.env.GITHUB_TOKEN;
}

const GithubState = props => {
    const initialState = {
        users: [],
        user: {},
        repos: [],
        loading: false
    }

    const github = axios.create({
        baseURL: 'https://api.github.com',
        timeout: 1000,
        headers: { Authorization: githubToken }
    });

    const [state, dispatch] = useReducer(GithubReducer, initialState);

    const setLoading = () => dispatch({ type: SET_LOADING });


    //Clear users from state
    const clearUsers = () => dispatch({ type: CLEAR_USERS });

    //search Users
    const searchUsers = async (text) => {
        setLoading();

        const res = await github.get(`/search/users?q=${text}`);

        dispatch({
            type: SEARCH_USERS,
            payload: res.data.items
        });
    };

    //Get single Github user
    const getUser = async (username) => {
        setLoading();

        const res = await github.get(`/users/${username}`);

        dispatch({
            type: GET_USER,
            payload: res.data
        })
    };

    //Get user repos
    const getUserRepos = async (username) => {
        setLoading();

        const res = await github.get(`/users/${username}/repos?per_page=5&sort=created:asc`);

        dispatch({
            type: GET_REPOS,
            payload: res.data
        });
    };



    return <GithubContext.Provider value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos
    }}>
        {props.children}
    </GithubContext.Provider>
}

export default GithubState;