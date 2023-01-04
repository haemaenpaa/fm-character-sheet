import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageDiceComponent } from './damage-dice.component';

describe('DamageDiceComponent', () => {
  let component: DamageDiceComponent;
  let fixture: ComponentFixture<DamageDiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DamageDiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DamageDiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
