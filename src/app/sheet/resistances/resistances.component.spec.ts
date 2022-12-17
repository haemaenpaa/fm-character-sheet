import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResistanceItemComponent } from './resistance-item/resistance-item.component';

import { ResistancesComponent } from './resistances.component';

describe('ResistancesComponent', () => {
  let component: ResistancesComponent;
  let fixture: ComponentFixture<ResistancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResistancesComponent, ResistanceItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResistancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display racial resistances', () => {
    component.resistances = [];
    component.racialResistances = [
      { type: 'immunity', value: 'test-racial-resistance' },
    ];
    fixture.detectChanges();
    const found = fixture.nativeElement.querySelector('#racial-resistance-0');

    expect(found)
      .withContext('Racial resistance components should be shown.')
      .toBeTruthy();
  });
  it('should display regular resistances', () => {
    component.resistances = [{ type: 'immunity', value: 'test-resistance' }];
    component.racialResistances = [];
    fixture.detectChanges();
    const found = fixture.nativeElement.querySelector('#resistance-0');

    expect(found)
      .withContext('Regular resistance components should be shown.')
      .toBeTruthy();
  });
});
