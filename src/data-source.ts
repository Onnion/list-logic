import { Observable, of } from "rxjs";
import { DataSource } from "@angular/cdk/table";

export class ComponentDataSource extends DataSource<any> {
    private data: any[];
    private isExpandable: boolean;

    constructor(dataList: any[], isExpandable: boolean) {
        super();
        this.data = dataList;
        this.isExpandable = isExpandable;
    }

    connect(): Observable<any[]> {
        const rows = [];
        if (this.isExpandable) {
            this.data.forEach(element => rows.push(element, { detailRow: true, element }));
        } else {
            this.data.forEach(element => rows.push(element));
        }
        return of(rows);
    }

    disconnect() { }
}