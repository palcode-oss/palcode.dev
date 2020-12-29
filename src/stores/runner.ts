import { ApplicationState } from './helpers';

export interface RunnerState {
    running: boolean;
    loading: boolean;
}

export type RunnerActionType = 'runner/request_run' | 'runner/set_running' | 'runner/set_stopped'
export interface RunnerAction {
    type: RunnerActionType;
}

function runnerReducer(state: ApplicationState, action: RunnerAction): RunnerState {
    switch(action.type) {
        case 'runner/request_run':
            return {
                loading: true,
                running: false,
            };
        case 'runner/set_running':
            return {
                loading: false,
                running: true,
            };
        case 'runner/set_stopped':
            return {
                loading: false,
                running: false,
            }
        default:
            return {
                loading: false,
                running: false,
            }
    }
}

export class RunnerActions {
    static requestRun = 'runner/request_run' as RunnerActionType;
    static setRunning = 'runner/set_running' as RunnerActionType;
    static setStopped = 'runner/set_stopped' as RunnerActionType;
}

type runnerSelectorReturnType = [boolean, boolean];
export const runnerSelector = (state: ApplicationState): runnerSelectorReturnType => {
    return [
        state.runner.running,
        state.runner.loading,
    ];
}

export default runnerReducer;
