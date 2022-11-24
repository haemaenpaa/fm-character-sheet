import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleCheckComponent } from './simple-check.component';

describe('SimpleCheckComponent', () => {
  let component: SimpleCheckComponent;
  let fixture: ComponentFixture<SimpleCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
