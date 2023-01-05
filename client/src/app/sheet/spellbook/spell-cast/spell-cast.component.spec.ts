import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellCastComponent } from './spell-cast.component';

describe('SpellCastComponent', () => {
  let component: SpellCastComponent;
  let fixture: ComponentFixture<SpellCastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpellCastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpellCastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
