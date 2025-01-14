import AddAnswer from './pages/AddAnswer';
import {LOGIN_ROUTE, REGISTRATION_ROUTE, ANSWER_ROUTE, ANSWER_CREATE} from './utils/consts';
import Auth from './pages/Auth';
import Answer from './pages/Answer';

export const authRoutes = [
    {
        path: ANSWER_CREATE,
        Component: AddAnswer
    },
    {
        path: ANSWER_ROUTE,
        Component: Answer
    }
]

export const publicRoutes = [
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    
]