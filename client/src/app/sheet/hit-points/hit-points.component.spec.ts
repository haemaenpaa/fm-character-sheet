import { A11yModule } from '@angular/cdk/a11y';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitPointsComponent } from './hit-points.component';

describe('HitPointsComponent', () => {
  let component: HitPointsComponent;
  let fixture: ComponentFixture<HitPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HitPointsComponent],
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

  it('should edit current', () => {
    spyOn(component.currentChanged, 'emit');
    spyOn(component.tempChanged, 'emit');
    const value = 9;
    component.setEditingCurrent();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#current-edit'))
      .withContext('Changing to current HP edit should show current HP edit.')
      .not.toBeNull();

    const target = { value: value.toString() } as any as HTMLInputElement;
    component.onInputValueChanged({ target: target } as any as Event);

    expect(component.currentChanged.emit)
      .withContext('Current HP edit event should have been emitted')
      .toHaveBeenCalledWith(value);
    expect(component.tempChanged.emit)
      .withContext('Temp HP edit event should not have been emitted')
      .not.toHaveBeenCalled();
  });

  it('should edit temporary', () => {
    spyOn(component.currentChanged, 'emit');
    spyOn(component.tempChanged, 'emit');
    const value = 9;
    component.setEditingTemp();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#temp-edit'))
      .withContext(
        'Changing to temporary HP edit should show temporary HP edit.'
      )
      .not.toBeNull();

    const target = { value: value.toString() } as any as HTMLInputElement;
    component.onInputValueChanged({ target: target } as any as Event);

    expect(component.tempChanged.emit)
      .withContext('Temporary HP edit event should have been emitted')
      .toHaveBeenCalledWith(value);
    expect(component.currentChanged.emit)
      .withContext('Current HP edit event should not have been emitted.')
      .not.toHaveBeenCalled();
  });

  it('should switch editing', () => {
    component.editingCurrent = true;
    fixture.detectChanges;
    component.setEditingTemp();
    fixture.detectChanges();
    expect(component.editingCurrent).toBeFalse();
    expect(component.editingTemp).toBeTrue();
    expect(fixture.nativeElement.querySelector('#temp-edit')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#current-edit')).toBeNull();

    component.setEditingCurrent();
    fixture.detectChanges();

    expect(component.editingCurrent).toBeTrue();
    expect(component.editingTemp).toBeFalse();
    expect(fixture.nativeElement.querySelector('#current-edit')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#temp-edit')).toBeNull();
  });

  it('should end editing current', () => {
    component.editingCurrent = true;
    component.endEditing();
    fixture.detectChanges();

    expect(component.editingCurrent).toBeFalse();
    expect(component.editingTemp).toBeFalse();
    expect(fixture.nativeElement.querySelector('input'))
      .withContext('No inputs should be visible after editing is ended.')
      .toBeNull();
  });
  it('should end editing temp', () => {
    component.editingTemp = true;
    component.endEditing();
    fixture.detectChanges();
    expect(component.editingCurrent).toBeFalse();
    expect(component.editingTemp).toBeFalse();
    expect(fixture.nativeElement.querySelector('input')).toBeNull();
  });
});
