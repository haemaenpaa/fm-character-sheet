import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AoSelectionListComponent } from './ao-selection-list.component';

describe('AoSelectionListComponent', () => {
  let component: AoSelectionListComponent;
  let fixture: ComponentFixture<AoSelectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AoSelectionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AoSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
