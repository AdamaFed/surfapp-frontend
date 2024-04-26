import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotForecastComponent } from './spot-forecast.component';

describe('SpotForecastComponent', () => {
  let component: SpotForecastComponent;
  let fixture: ComponentFixture<SpotForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotForecastComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpotForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
