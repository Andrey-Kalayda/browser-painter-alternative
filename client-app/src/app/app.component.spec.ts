import {TestBed, async} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TopBarComponent } from './core/top-bar/top-bar.component';
import {RouterTestingModule} from '@angular/router/testing';
import { AppModule } from './app.module';


describe(AppComponent.name, () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                AppComponent,
                TopBarComponent
            ]
        }).compileComponents();
    });

    it(`${AppComponent.name} should be loaded`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
    
    it(`${AppComponent.name} should have container wrapper tag`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.getElementsByClassName('container').length).toBeGreaterThan(0, `${AppComponent.name} doesn't contain container wrapper tag`);
    }));
});