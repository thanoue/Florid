export class BaseEntity {
    Id: string;
    Active: boolean;
    Created: number;
    IsDeleted: boolean;

    constructor() {
        this.Created = (new Date()).getTime();
    }
}
