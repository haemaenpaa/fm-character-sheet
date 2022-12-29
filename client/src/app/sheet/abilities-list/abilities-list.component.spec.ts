import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilitiesListComponent } from './abilities-list.component';

describe('AbilitiesListComponent', () => {
  let component: AbilitiesListComponent;
  let fixture: ComponentFixture<AbilitiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbilitiesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbilitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
