import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResistanceItemComponent } from './resistance-item.component';

describe('ResistanceItemComponent', () => {
  let component: ResistanceItemComponent;
  let fixture: ComponentFixture<ResistanceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResistanceItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResistanceItemComponent);
    component = fixture.componentInstance;
    component.resistance = {
      type: 'resistance',
      value: 'test-resistance',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display immunity when resistance type is immunity', () => {
    component.resistance.type = 'immunity';
    fixture.detectChanges();
    const found = fixture.nativeElement.querySelector('#resistance-immunity');
    expect(found).withContext('Immunity tag should be shown').toBeTruthy();
  });

  it('should not display immunity when resistance type is not immunity', () => {
    component.resistance.type = 'resistance';
    fixture.detectChanges();
    const found = fixture.nativeElement.querySelector('#resistance-immunity');
    expect(found).withContext('Immunity tag should not be shown').toBeFalsy();
  });
  it('should display racial when resistance is racial', () => {
    component.racial = true;
    fixture.detectChanges();
    const found = fixture.nativeElement.querySelector('#resistance-racial');
    expect(found).withContext('Racial tag should be shown').toBeTruthy();
  });

  it('should not display racial when resistance is not racial', () => {
    component.racial = false;
    fixture.detectChanges();
    const found = fixture.nativeElement.querySelector('#resistance-racial');
    expect(found).withContext('Racial tag should not be shown').toBeFalsy();
  });

  it('should display resistance name', () => {
    const expected = 'Test value';
    component.resistance.value = expected;
    fixture.detectChanges();
    const found = fixture.nativeElement.querySelector('#resistance-value');
    expect(found).withContext('Resistance name should be shown').toBeTruthy();
    expect(found.textContent.trim())
      .withContext('Resistance name should have been correct.')
      .toBe(expected);
  });
});
