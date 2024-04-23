import { MatxLoading } from 'app/components';
import axios from 'axios.js';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import React, { createContext, useEffect, useReducer } from 'react';

const JWT_SECRET = 'jwt_secret_key';
const JWT_VALIDITY = '1 day';

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}
const filterItemsequal = (arr, field, value) => { try { if (field != null) { return arr.filter((item) => { return item[field] == value }) } } catch (error) { console.error(error); } }

const isValidToken = (authorization) => {
    if (!authorization) {
        return false
    }

    const decodedToken = jwtDecode(authorization)
    const currentTime = Date.now() / 1000
    return decodedToken.exp > currentTime
}

const setSession = (authorization) => {
    if (authorization) {
        localStorage.setItem('authorization', authorization)
        axios.defaults.headers.common.Authorization = `Bearer ${authorization}`
    } else {
        localStorage.removeItem('authorization')
        delete axios.defaults.headers.common.Authorization
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated, user } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'REGISTER': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => { },
    register: () => Promise.resolve(),
})

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const login = async (email, password) => {

        const this_credentials = {
            email: email,
            password: password
        }

        const arr_user = [];

        try {

            await axios.post(process.env.REACT_APP_API_BASE_URL + "admin/login", this_credentials).then((res) => {






                res.data.getadmin.map((temp) => {
                    return arr_user.push({
                        userID: temp.id, userName: temp.name, userEmail: temp.email,

                        user_type: res.data.role,


                    });
                });



                console.log(res.data.authorization);
                setSession(res.data.authorization)
                localStorage.setItem('authorization', res.data.authorization)
                const decode = jwt.verify(res.data.authorization, JWT_SECRET);

                console.log(decode, 'decode');
            });

        } catch (error) {
            console.error(error);
            console.log('???');
        }





        const user = {
            id: arr_user[0].userID,
            avatar: '/assets/images/face-6.jpg',
            email: arr_user[0].userEmail,
            name: arr_user[0].userName,

            user_type: arr_user[0].user_type,
            role: 'SA',

            authorization: window.localStorage.getItem('authorization'),
        };




        dispatch({
            type: 'LOGIN',
            payload: {
                user,
            },
        })
    }

    const register = async (email, username, password, phone) => {
        const response = await axios.post(process.env.REACT_APP_API_BASE_URL + "user/register", {
            email,
            username,
            password,
            phone
        })

        const { authorization, user } = response.data

        setSession(authorization)

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            },
        })
    }

    const logout = () => {
        setSession(null)
        localStorage.setItem('authorization', null)
        localStorage.clear()
        dispatch({ type: 'LOGOUT' })
    }

    useEffect(() => {
        ; (async () => {

            localStorage.removeItem("l_product_info_data")
            localStorage.removeItem("last_selected")

            try {
                const authorization = window.localStorage.getItem('authorization')

                if (authorization && isValidToken(authorization)) {

                    const decode2 = jwt.verify(authorization, JWT_SECRET);


                    const this_credentials2 = {
                        email: decode2.email,
                        password: decode2.password
                    }

                    const arr_user = [];
                    var filter = [];
                    await axios.post(process.env.REACT_APP_API_BASE_URL + "admin/login", this_credentials2).then((res) => {
                        console.log(res.data, 'res444')
                        filter = filterItemsequal(res.data.branch, 'branch_id', parseInt(res.data.first_branch));


                        res.data.getadmin.map((temp) => {
                            return arr_user.push({
                                userID: temp.id, userName: temp.name, userEmail: temp.email,

                                user_type: res.data.role,

                            });
                        });

                        localStorage.setItem('authorization', res.data.authorization)

                    });



                    const user = {
                        id: arr_user[0].userID,
                        avatar: '/assets/images/face-6.jpg',
                        email: arr_user[0].userEmail,
                        name: arr_user[0].userName,

                        user_type: arr_user[0].user_type,

                        authorization: window.localStorage.getItem('authorization'),
                        role: 'SA',
                    };
                    console.log(user, 'resuserx');

                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    })
                }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading />
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
