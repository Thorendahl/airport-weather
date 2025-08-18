import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PageTafReport} from './page-taf-report.component';
import {provideZonelessChangeDetection} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';

describe('Taf', () => {
    let component: PageTafReport;
    let fixture: ComponentFixture<PageTafReport>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageTafReport],
            providers: [provideZonelessChangeDetection(), provideHttpClient()]
        }).compileComponents();

        fixture = TestBed.createComponent(PageTafReport);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
