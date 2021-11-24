// import { NoMatch } from './components/NoMatch';
import { Main } from './features/main';
import { AddItem } from './features/addItem';
import { TableData } from './features/tableData';

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
    {
        path: '/tableData',
        component: TableData,
        name: 'Таблица',
    },
    // {
    //     component: NoMatch,
    // },
];
