import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitDieRowComponent } from './hit-die-row.component';

describe('HitDieRowComponent', () => {
  let component: HitDieRowComponent;
  let fixture: ComponentFixture<HitDieRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HitDieRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HitDieRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
