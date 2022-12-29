import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacialAbilitiesComponent } from './racial-abilities.component';

describe('RacialAbilitiesComponent', () => {
  let component: RacialAbilitiesComponent;
  let fixture: ComponentFixture<RacialAbilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RacialAbilitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacialAbilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
