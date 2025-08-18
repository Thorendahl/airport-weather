import {Component, OnInit, output, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {debounceTime} from 'rxjs';

@Component({
    selector: 'app-search',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

    public readonly icao = output<string>();
    protected showError = signal(false);
    protected searchForm: FormGroup = new FormGroup({
        searchInput: new FormControl(''),
    });

    ngOnInit(): void {
        this.searchForm.valueChanges
            .pipe(debounceTime(750))
            .subscribe((value) => this.validateIcao(value.searchInput));
    }

    validateIcao = (icao: string) => icao.length === 4;
    submitIcao = () => {
        const icao = this.searchForm.value.searchInput;
        if (this.validateIcao(icao)) {
            this.icao.emit(icao.toUpperCase());
            this.showError.set(false)
        } else {
            this.showError.set(true);
        }
    }
}
