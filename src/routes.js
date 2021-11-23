// import { NoMatch } from './components/NoMatch';
import { Main } from './features/main';
import { AddItem } from './features/addItem';

export const routes = [
    {
        path: '/main',
        component: Main,
    },
    {
        path: '/addItem',
        component: AddItem,
    },
    // {
    //     component: NoMatch,
    // },
];
