import AddAnswer from './pages/AddAnswer';
import {LOGIN_ROUTE, REGISTRATION_ROUTE, ANSWER_ROUTE, ANSWER_CREATE, POLLS_CREATE, POLLS_ROUTE, ANALYTICS_ROUTE, NEWS_ROUTE, NEWS_ADD_ROUTE, NEWS_EDIT_ROUTE} from './utils/consts';
import Auth from './pages/Auth';
import Answer from './pages/Answer';
import CreatePoll from './components/CreatePoll';
import PollList from './components/PollList';
import BotAnalytics from './components/BotAnalytics';
import AllNews from './pages/News/AllNews';
import AddNews from './pages/News/AddNews';
import EditNews from './pages/News/EditNews';

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
    {
        path: ANALYTICS_ROUTE,
        Component: BotAnalytics,
    },
    {
        path: NEWS_ROUTE,
        Component: AllNews
    },
    {
        path: NEWS_ADD_ROUTE,
        Component: AddNews
    },
    {
        path: NEWS_EDIT_ROUTE,
        Component: EditNews
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