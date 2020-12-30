import { ApplicationState } from './helpers';
import { createAction, createReducer } from '@reduxjs/toolkit';

export interface RunnerState {
    running: boolean;
    loading: boolean;
}

export class RunnerActions {
    static requestRun = createAction('runner/request_run');
    static setRunning = createAction('runner/set_running');
    static setStopped = createAction('runner/set_stopped');
}

const initialState = {
    running: false,
    loading: false,
} as RunnerState;
const runnerReducer = createReducer(initialState, builder => {
    builder
        .addCase(RunnerActions.requestRun, state => {
            state.loading = true;
        })
        .addCase(RunnerActions.setRunning, state => {
            state.loading = false;
            state.running = true;
        })
        .addCase(RunnerActions.setStopped, state => {
            state.loading = false;
            state.running = false;
        });
});

export const runnerSelector = (state: ApplicationState): [boolean, boolean] => {
    return [
        state.runner.running,
        state.runner.loading,
    ];
}

export default runnerReducer;
