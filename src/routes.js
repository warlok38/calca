// import { NoMatch } from './components/NoMatch';
import { Main } from './features/main';
import { AddItem } from './features/addItem';

export const routes = [
    {
        path: '/main',
        component: Main,
        name: 'Главная',
    },
    {
        path: '/addItem',
        component: AddItem,
        name: 'Добавить',
    },
    // {
    //     component: NoMatch,
    // },
];
