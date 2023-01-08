import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { HitDiceDisplayComponent } from './hit-dice-display.component';

describe('HitDiceDisplayComponent', () => {
  let component: HitDiceDisplayComponent;
  let fixture: ComponentFixture<HitDiceDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HitDiceDisplayComponent],
      providers: [{ provide: MatDialog, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(HitDiceDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display hit dice', () => {
    component.hitDiceMax = {
      6: 1,
      8: 2,
      10: 0,
      12: 4,
    };
    component.hitDiceRemaining = {
      6: 0,
      8: 1,
      10: 0,
      12: 3,
    };
    fixture.detectChanges();

    const d6element = fixture.debugElement.query(By.css('#d6'));
    expect(d6element.nativeElement.textContent.trim()).toBe('0/1 d6');
    const d8element = fixture.debugElement.query(By.css('#d8'));
    expect(d8element.nativeElement.textContent.trim()).toBe('1/2 d8');
    const d10element = fixture.debugElement.query(By.css('#d10'));
    expect(d10element).toBeNull();
    const d12element = fixture.debugElement.query(By.css('#d12'));
    expect(d12element.nativeElement.textContent.trim()).toBe('3/4 d12');
  });
});
