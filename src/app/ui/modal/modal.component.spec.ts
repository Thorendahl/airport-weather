import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalComponent} from './modal.component';
import {provideZonelessChangeDetection} from '@angular/core';

describe('Modal', () => {
    let component: ModalComponent;
    let fixture: ComponentFixture<ModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(ModalComponent);
        component = fixture.componentInstance;


        fixture.componentRef.setInput('title', 'Headline')
        fixture.componentRef.setInput('body', 'Body')
        fixture.detectChanges();
    });

    it('should create', () => expect(component).toBeTruthy());
});
