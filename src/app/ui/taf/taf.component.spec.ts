import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TafComponent} from './taf.component';
import {provideZonelessChangeDetection} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';

describe('Taf', () => {
    let component: TafComponent;
    let fixture: ComponentFixture<TafComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TafComponent],
            providers: [provideZonelessChangeDetection(), provideHttpClient()]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TafComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('report', undefined)
        fixture.componentRef.setInput('ident', undefined)

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
