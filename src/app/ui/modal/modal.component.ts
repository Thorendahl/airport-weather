import {AfterViewInit, Component, ElementRef, inject, input} from '@angular/core';

@Component({
    selector: 'app-modal',
    imports: [],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss'
})
export class ModalComponent implements AfterViewInit {
    elementRef = inject(ElementRef<HTMLDialogElement>);

    title = input.required<string>();
    body = input.required<string>();

    ngAfterViewInit(): void {
        const dialog = this.elementRef.nativeElement.querySelector('dialog')
        dialog.addEventListener("click", (e: MouseEvent) => {
            const dialogDimensions = dialog.getBoundingClientRect()
            if (e.clientX < dialogDimensions.left || e.clientX > dialogDimensions.right || e.clientY < dialogDimensions.top || e.clientY > dialogDimensions.bottom) {
                dialog.close()
            }
        });
    }
}
