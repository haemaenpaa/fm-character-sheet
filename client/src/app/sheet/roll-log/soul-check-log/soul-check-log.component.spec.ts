import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Roll } from 'src/app/model/diceroll';

import { SoulCheckLogComponent } from './soul-check-log.component';

describe('SoulCheckLogComponent', () => {
  let component: SoulCheckLogComponent;
  let fixture: ComponentFixture<SoulCheckLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoulCheckLogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SoulCheckLogComponent);
    component = fixture.componentInstance;
    component.roll = new Roll();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
