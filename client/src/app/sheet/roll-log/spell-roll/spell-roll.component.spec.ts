import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellRollComponent } from './spell-roll.component';

describe('SpellRollComponent', () => {
  let component: SpellRollComponent;
  let fixture: ComponentFixture<SpellRollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpellRollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpellRollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
