import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellSaveLogComponent } from './spell-save-log.component';

describe('SpellSaveLogComponent', () => {
  let component: SpellSaveLogComponent;
  let fixture: ComponentFixture<SpellSaveLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpellSaveLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpellSaveLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
