import {TestBed, async} from '@angular/core/testing';
import { TopBarComponent } from './top-bar.component';
import {RouterTestingModule} from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe(TopBarComponent.name, () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                TopBarComponent
            ]
        }).compileComponents()
    }));

    it(`${TopBarComponent.name} should be loaded`, async(() => {
        let fixture = TestBed.createComponent(TopBarComponent);
        let bar = fixture.debugElement.componentInstance;
        expect(bar).toBeTruthy();
    }));

    it(`Top bar links must not be empty`, async(() => {
        let fixture = TestBed.createComponent(TopBarComponent);
        let bar = fixture.debugElement.componentInstance;
        let links = fixture.debugElement.queryAll(By.css('li a'));
        expect(links.length).toEqual(2);
        let firstLink = links[0].nativeElement;
        let secondLink = links[0].nativeElement;
        expect(firstLink).toBeTruthy();
        expect(secondLink).toBeTruthy();
    }));
});