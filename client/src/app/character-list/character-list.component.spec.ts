import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterService } from '../services/character.service';

import { CharacterListComponent } from './character-list.component';

const dummyService = {
  getAllCharacters: () => {
    return new Promise((res) => res([]));
  },
};

describe('CharacterListComponent', () => {
  let component: CharacterListComponent;
  let fixture: ComponentFixture<CharacterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterListComponent],
      providers: [{ provide: CharacterService, useValue: dummyService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
