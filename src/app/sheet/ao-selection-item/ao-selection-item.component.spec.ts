import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AoSelectionItemComponent } from './ao-selection-item.component';

describe('AoSelectionItemComponent', () => {
  let component: AoSelectionItemComponent;
  let fixture: ComponentFixture<AoSelectionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AoSelectionItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AoSelectionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
