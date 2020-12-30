import { createAction, createReducer } from '@reduxjs/toolkit';
import { ApplicationState } from './helpers';

export interface UploaderState {
    uploading: boolean;
}

export class UploaderActions {
    static setUploading = createAction('uploader/set_uploading');
    static completeUpload = createAction('uploader/complete_upload');
    // static uploadError = createAction('uploader/upload_error');
}

const uploaderReducer = createReducer({
    uploading: false,
} as UploaderState, builder => {
    builder
        .addCase(UploaderActions.setUploading, state => {
            state.uploading = true;
        })
        .addCase(UploaderActions.completeUpload, state => {
            state.uploading = false;
        });
});

export const uploaderSelector = (state: ApplicationState) => state.uploader.uploading;
export default uploaderReducer;
