import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { BaseFile } from '../models/file.model';
@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() { }

    pushFileToStorage(file: File | Blob, fileUpload: BaseFile, uploadedCallback: (fileUpload: BaseFile) => void): void {

        if (file == null) {
            return;
        }

        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(`${fileUpload.FolderName}/${fileUpload.Name}`).put(file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                // in progress
                const snap = snapshot as firebase.storage.UploadTaskSnapshot
            },
            (error) => {
                // fail
                console.log(error);
            },
            () => {
                // success
                uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                    fileUpload.Url = url;
                    uploadedCallback(fileUpload);
                });
            }
        );
    }
}