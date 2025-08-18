import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PageMetarReportComponent} from './page-metar-report.component';
import {provideZonelessChangeDetection} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {provideHttpClient} from '@angular/common/http';

describe('Metar', () => {
    let component: PageMetarReportComponent;
    let fixture: ComponentFixture<PageMetarReportComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageMetarReportComponent, JsonPipe],
            providers: [
                provideZonelessChangeDetection(),
                provideHttpClient(),
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PageMetarReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
