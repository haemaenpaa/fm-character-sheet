import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleRoll } from 'src/app/model/diceroll';
import { AttackComponent } from './attack.component';

describe('AttackComponent', () => {
  let component: AttackComponent;
  let fixture: ComponentFixture<AttackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttackComponent);
    component = fixture.componentInstance;
    component.roll = {
      title: '',
      rolls: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
