import { BaseEntity } from './base.entity';

export class Tag extends BaseEntity {
    Name: string;
    Description: string;
    Index: number;

    constructor() {
        super();
    }
}