import { base_url } from 'app/utils/constant'
import axios from 'axios'
import React, { createContext, useEffect, useReducer } from 'react'
import useAuth from 'app/hooks/useAuth';

axios.defaults.headers.common['authorization'] = 'JWT ' + window.localStorage.getItem('authorization');

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_NOTIFICATIONS': {
            return {
                ...state,
                notifications: action.payload,
            }
        }
        case 'DELETE_NOTIFICATION': {
            return {
                ...state,
                notifications: action.payload,
            }
        }
        case 'CLEAR_NOTIFICATIONS': {
            return {
                ...state,
                notifications: action.payload,
            }
        }
        case 'SEEN_NOTIFICATIONS': {
            return {
                ...state,
                notifications: action.payload,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const NotificationContext = createContext({
    notifications: [],
    deleteNotification: () => { },
    clearNotifications: () => { },
    getNotifications: () => { },
    createNotification: () => { },
    seenNotification: () => { },
})

export const NotificationProvider = ({ settings, children }) => {
    const [state, dispatch] = useReducer(reducer, [])
    const { logout, user } = useAuth();
    console.log("user1", user);

    const deleteNotification = async (notificationID) => {
        try {
            const res = await axios.post('/api/notification/delete', {
                id: notificationID,
            })
            dispatch({
                type: 'DELETE_NOTIFICATION',
                payload: res.data,
            })
        } catch (e) {
            console.error(e)
        }
    }

    const clearNotifications = async () => {
        try {
            const res = await axios.post('/api/notification/delete-all')
            dispatch({
                type: 'CLEAR_NOTIFICATIONS',
                payload: res.data,
            })
        } catch (e) {
            console.error(e)
        }
    }

    const getNotifications = async () => {

        try {
            var authorization = localStorage.getItem("authorization");
            console.log("authorization", authorization);
            // const res = await axios.get('/api/notification')
            const res = await axios.post(base_url + "notice-list")

            dispatch({
                type: 'LOAD_NOTIFICATIONS',
                payload: res.data.result,
            })
        } catch (e) {
            console.error(e)
        }
    }
    const createNotification = async (notification) => {
        try {
            const res = await axios.post('/api/notification/add', {
                notification,
            })
            dispatch({
                type: 'CREATE_NOTIFICATION',
                payload: res.data,
            })
        } catch (e) {
            console.error(e)
        }
    }
    const seenNotification = async (notification) => {
        try {
            const res = await axios.post(base_url + "notice-seen")
            dispatch({
                type: 'SEEN_NOTIFICATION',
                payload: res.data.message,
            })
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getNotifications()
    }, [])

    return (
        <>

            <NotificationContext.Provider
                value={{
                    notifications: state.notifications,
                    deleteNotification,
                    clearNotifications,
                    getNotifications,
                    createNotification,
                    seenNotification
                }}
            >
                {children}
            </NotificationContext.Provider>

        </>
    )
}

export default NotificationContext
