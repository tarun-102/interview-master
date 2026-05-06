import {createBrowserRouter} from 'react-router';
import Login from './features/auth/pages/Login';
import Rgister from './features/auth/pages/Rgister';
import Home from './features/interview/pages/Home';
import Protected from "./features/auth/components/Protected";
import Interview from './features/interview/pages/interview';
export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    
    {
        path: "/register",
        element: <Rgister />
    },

    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path: 'interview/:interviewId',
        element: <Protected ><Interview /></Protected>
    }
]);