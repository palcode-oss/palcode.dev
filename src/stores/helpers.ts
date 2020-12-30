import { RunnerState } from './runner';
import { UploaderState } from './uploader';

export interface ApplicationState {
    runner: RunnerState;
    uploader: UploaderState;
}
