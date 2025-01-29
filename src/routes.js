import AddAnswer from './pages/AddAnswer';
import {LOGIN_ROUTE, REGISTRATION_ROUTE, ANSWER_ROUTE, ANSWER_CREATE, POLLS_CREATE, POLLS_ROUTE} from './utils/consts';
import Auth from './pages/Auth';
import Answer from './pages/Answer';
import CreatePoll from './components/CreatePoll';
import PollList from './components/PollList';

export const authRoutes = [
    {
        path: ANSWER_CREATE,
        Component: AddAnswer
    },
    {
        path: ANSWER_ROUTE,
        Component: Answer
    },
    {
        path: POLLS_CREATE,
        Component: CreatePoll,
    },
    {
        path: POLLS_ROUTE,
        Component: PollList,
    },
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