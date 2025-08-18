import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PageFullReport} from './page-full-report.component';
import {provideZonelessChangeDetection} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';

describe('Full', () => {
    let component: PageFullReport;
    let fixture: ComponentFixture<PageFullReport>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageFullReport],
            providers: [provideZonelessChangeDetection(), provideHttpClient()]
        }).compileComponents();

        fixture = TestBed.createComponent(PageFullReport);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
