import {ComponentFixture, TestBed} from '@angular/core/testing';
import {WeatherComponent} from './weather.component';
import {provideZonelessChangeDetection} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter} from '@angular/router';

describe('Weather', () => {
    let component: WeatherComponent;
    let fixture: ComponentFixture<WeatherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WeatherComponent],
            providers: [provideZonelessChangeDetection(), provideHttpClient(), provideRouter([])]
        }).compileComponents();

        fixture = TestBed.createComponent(WeatherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render title', () => {
        const fixture = TestBed.createComponent(WeatherComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('header')?.textContent).toContain('Airport Weather');
    });

});
