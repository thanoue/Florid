import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GenericModel } from 'src/app/models/generic.model';
@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    insertDataCallback: BehaviorSubject<GenericModel> = new BehaviorSubject<GenericModel>(null);
    insertDataWithIdResCallback: BehaviorSubject<GenericModel> = new BehaviorSubject<GenericModel>(null);


    insertData(data: GenericModel) {
        this.insertDataCallback.next(data);
    }

    insertWithIdResData(data: GenericModel) {
        this.insertDataWithIdResCallback.next(data);
    }

}
