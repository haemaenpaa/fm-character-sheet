import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoulCheckLogComponent } from './soul-check-log.component';

describe('SoulCheckLogComponent', () => {
  let component: SoulCheckLogComponent;
  let fixture: ComponentFixture<SoulCheckLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoulCheckLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoulCheckLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
