import { Tab, Tabs } from '@material-ui/core';
import React from 'react';
import styles from '../styles/tabs.module.scss';

export default function TabSwitcher(
    {
        tabs,
        tab,
        onChange,
    }: {
        tabs: string[],
        tab: number,
        onChange(newTab: number): void,
    }
) {
    return <div className={styles.container}>
        <Tabs
            value={tab}
            onChange={(_, value) => onChange(value)}
            indicatorColor='primary'
            centered
        >
            {
                tabs.map(e => <Tab key={e} label={e} />)
            }
        </Tabs>
    </div>;
}
