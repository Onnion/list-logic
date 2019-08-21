import { MatPaginator, PageEvent } from '@angular/material';
import { EventEmitter } from '@angular/core';
import { ComponentDataSource } from './data-source';

export class ListComponent {
    public $pagination: MatPaginator;
    public doneLoad: EventEmitter<any> = new EventEmitter<any>();
    public dataSource: ComponentDataSource;
    public isMobile: boolean;
    public expandedElement: boolean;
    public displayedColumns: string[];
    public service: any;
    public notify: any;
    public options: object;
    public safe_pagination: boolean;
    public methodLoad = 'getData';
    public status_form = { loading: false };

    // Data
    public componentData: any;
    public filtredComponentData: any;

    // Pagination
    public status: string;
    public length: number;
    public pageEvent: PageEvent;
    public searchableFields: string[];
    public pageSize = 5;
    public page = 2;
    public orderBy = 'registered_at';
    public sortedBy = 'desc';
    public pageSizeOptions = [5, 12, 25, 50, 100, 1000, 10000];
    public doneAnimation = false;

    private changePagination = false;

    constructor() { }

    protected cleanData(): void {
        this.componentData = [];
        this.filtredComponentData = [];
        this.dataSource = new ComponentDataSource([], false);
    }

    protected listTest(list: any[]): void {
        this.cleanData();

        this.componentData = list;
        this.filtredComponentData = list;
        this.setIsMobile();
        this.status_form.loading = false;
        this.doneLoad.emit(true);

        if (this.changePagination) { this.showPagination(); }
    }

    protected createData(data: any[], mobile: boolean): void {
        this.componentData = data;
        this.filtredComponentData = data;
        this.dataSource = new ComponentDataSource(data, mobile);
    }

    protected list(options: object, mobile: boolean): void {
        this.cleanData();

        this.service[this.methodLoad](options).subscribe(
            (data: any) => {
                if (!this.safe_pagination) {
                    const pagination = data.meta.pagination;
                    this.setPagination(pagination['total'], pagination['current_page'], pagination['per_page']);
                }

                this.createData(data.data, mobile);
                this.setIsMobile();
                this.status_form.loading = false;
                this.doneLoad.emit(true);

                if (this.changePagination) { this.showPagination(); }
            },
            (err) => {
                this.status_form.loading = false;
            }
        );
    }

    public setIsMobile($event?: any): void {
        const width = $event ? $event.target.innerWidth : window.innerWidth;
        const isMobile = width <= 991;

        if ((this.isMobile !== isMobile)) {
            this.dataSource = new ComponentDataSource(this.componentData, isMobile && this.expandedElement);
        }

        this.displayedColumns = isMobile ? ['show', 'data', 'status', 'number'] : ['data', 'status', 'media', 'number'];
        this.isMobile = isMobile;
    }

    public getSearchableFields(): string {
        return `Pesquisa pode ser realizada pelos campos ${this.searchableFields.map((field) => field).join(', ')}`;
    }

    public showPagination(): void {
        this.doneAnimation = true;
        this.changePagination = false;
    }

    public setSort($event: any): void {
        this.orderBy = $event.active === 'data' ? 'registered_at' : $event.active;
        this.sortedBy = $event.direction || 'desc';
        this.loadData();
    }

    public isExpansionDetailRow(i: number, row: Object): boolean {
        return row.hasOwnProperty('detailRow');
    }

    public loadData(list?: any[], mobile?: boolean): void {
        this.status_form.loading = true;
        let options = { ...this.options };

        if (!this.safe_pagination) {
            options = {
                ...this.options,
                orderBy: this.orderBy,
                sortedBy: this.sortedBy,
                page: this.page,
                pageSize: this.pageSize,
            };
        }

        list ? this.listTest(list) : this.list(options, mobile);
    }

    public setPagination(length: number, startIndex: number, pageSize: number): void {
        this.length = length;
        this.page = startIndex;
        this.pageSize = pageSize;
    }

    public onPaginateChange(event: any): void {

        if (this.pageSize !== event.pageSize) {
            this.doneAnimation = false;
        }

        this.page = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.changePagination = true;
        this.loadData();
    }
}
