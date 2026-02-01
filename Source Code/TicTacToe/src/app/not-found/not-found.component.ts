import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.css'],
    imports: [RouterLink]
})
export class NotFoundComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}
