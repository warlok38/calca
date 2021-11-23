import React from 'react';
import { Button } from 'antd';
import { removeDataFromStorage } from './rerenders';

const List = ({ itemsToTrack }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Item</th>
                </tr>
            </thead>
            <tbody>
                {itemsToTrack?.map((item, i) => {
                    return (
                        <tr key={i + 1}>
                            <td>{i + 1}</td>
                            <td>{item}</td>
                            <td>
                                <Button
                                    type="primary"
                                    onClick={() => removeDataFromStorage(item)}
                                >
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default List;
