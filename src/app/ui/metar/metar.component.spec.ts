import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MetarComponent} from './metar.component';
import {provideZonelessChangeDetection} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';

describe('MetarView', () => {
    let component: MetarComponent;
    let fixture: ComponentFixture<MetarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MetarComponent],
            providers: [provideZonelessChangeDetection(), provideHttpClient()]
        }).compileComponents();

        fixture = TestBed.createComponent(MetarComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('metar', undefined)
        fixture.componentRef.setInput('ident', undefined)
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
