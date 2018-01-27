import {TestBed, async} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TopBarComponent } from './core/top-bar/top-bar.component';
import {RouterTestingModule} from '@angular/router/testing';
import { SharedModule } from './shared/shared.module';
import { AppModule } from './app.module';
import { NotificationService } from './core/notification.service';


describe(AppComponent.name, () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                SharedModule
            ],
            declarations: [
                AppComponent,
                TopBarComponent
            ], providers: [
                {provide: NotificationService, useValue: null}
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
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.getElementsByClassName('container').length).toBeGreaterThan(0, `${AppComponent.name} doesn't contain container wrapper tag`);
    }));
});