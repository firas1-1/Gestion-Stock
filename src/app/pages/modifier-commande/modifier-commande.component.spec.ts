import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierCommandeComponent } from './modifier-commande.component';

describe('ModifierCommandeComponent', () => {
  let component: ModifierCommandeComponent;
  let fixture: ComponentFixture<ModifierCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierCommandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
