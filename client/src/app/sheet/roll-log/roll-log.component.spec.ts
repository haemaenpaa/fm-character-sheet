import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollLogComponent } from './roll-log.component';

describe('RollLogComponent', () => {
  let component: RollLogComponent;
  let fixture: ComponentFixture<RollLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RollLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RollLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
