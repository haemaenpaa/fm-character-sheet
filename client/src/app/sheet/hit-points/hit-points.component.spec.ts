import { A11yModule } from '@angular/cdk/a11y';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditableTextComponent } from '../editable-text/editable-text.component';

import { HitPointsComponent } from './hit-points.component';

describe('HitPointsComponent', () => {
  let component: HitPointsComponent;
  let fixture: ComponentFixture<HitPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HitPointsComponent, EditableTextComponent],
      imports: [A11yModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HitPointsComponent);
    component = fixture.componentInstance;

    component.current = 15;
    component.max = 15;
    component.temporary = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should adjust current down', () => {
    spyOn(component.currentChanged, 'emit');
    spyOn(component.tempChanged, 'emit');
    const initial = 10;
    const adjust = 9;
    component.current = initial;
    component.onTotalChanged(`-${adjust}`);
    expect(component.currentChanged.emit)
      .withContext('Negative value should have resulted in subtraction')
      .toHaveBeenCalledWith(initial - adjust);
  });

  it('should adjust current up', () => {
    spyOn(component.currentChanged, 'emit');
    spyOn(component.tempChanged, 'emit');
    const initial = 10;
    const adjust = 9;
    component.current = initial;
    component.onTotalChanged(`+${adjust}`);
    expect(component.currentChanged.emit)
      .withContext('Value starting with + should have resulted in addition')
      .toHaveBeenCalledWith(initial + adjust);
  });
  it('should set current', () => {
    spyOn(component.currentChanged, 'emit');
    spyOn(component.tempChanged, 'emit');
    const initial = 10;
    const adjust = 9;
    component.current = initial;
    component.onTotalChanged(`${adjust}`);
    expect(component.currentChanged.emit)
      .withContext('Value without prefix sholud have resulted in override')
      .toHaveBeenCalledWith(adjust);
  });

  it('should adjust max down', () => {
    spyOn(component.currentChanged, 'emit');
    spyOn(component.tempChanged, 'emit');
    spyOn(component.maxChanged, 'emit');
    const initial = 10;
    const adjust = 9;
    component.max = initial;
    component.onMaxChanged(`-${adjust}`);
    expect(component.maxChanged.emit)
      .withContext('Negative value should have resulted in subtraction')
      .toHaveBeenCalledWith(initial - adjust);
  });

  it('should adjust max up', () => {
    spyOn(component.currentChanged, 'emit');
    spyOn(component.tempChanged, 'emit');
    spyOn(component.maxChanged, 'emit');
    const initial = 10;
    const adjust = 9;
    component.max = initial;
    component.onMaxChanged(`+${adjust}`);
    expect(component.maxChanged.emit)
      .withContext('Value starting with + should have resulted in addition')
      .toHaveBeenCalledWith(initial + adjust);
  });
  it('should set max', () => {
    spyOn(component.currentChanged, 'emit');
    spyOn(component.tempChanged, 'emit');
    spyOn(component.maxChanged, 'emit');
    const initial = 10;
    const adjust = 9;
    component.max = initial;
    component.onMaxChanged(`${adjust}`);
    expect(component.maxChanged.emit)
      .withContext('Value without prefix sholud have resulted in override')
      .toHaveBeenCalledWith(adjust);
  });

  it('should adjust temp down', () => {
    spyOn(component.currentChanged, 'emit');
    spyOn(component.tempChanged, 'emit');
    spyOn(component.maxChanged, 'emit');
    const initial = 10;
    const adjust = 9;
    component.temporary = initial;
    component.onTempChanged(`-${adjust}`);
    expect(component.tempChanged.emit)
      .withContext('Negative value should have resulted in subtraction')
      .toHaveBeenCalledWith(initial - adjust);
  });

  it('should adjust temp up', () => {
    spyOn(component.currentChanged, 'emit');
    spyOn(component.tempChanged, 'emit');
    spyOn(component.maxChanged, 'emit');
    const initial = 10;
    const adjust = 9;
    component.temporary = initial;
    component.onTempChanged(`+${adjust}`);
    expect(component.tempChanged.emit)
      .withContext('Value starting with + should have resulted in addition')
      .toHaveBeenCalledWith(initial + adjust);
  });
  it('should set temp', () => {
    spyOn(component.currentChanged, 'emit');
    spyOn(component.tempChanged, 'emit');
    spyOn(component.maxChanged, 'emit');
    const initial = 10;
    const adjust = 9;
    component.temporary = initial;
    component.onTempChanged(`${adjust}`);
    expect(component.tempChanged.emit)
      .withContext('Value without prefix sholud have resulted in override')
      .toHaveBeenCalledWith(adjust);
  });
});
